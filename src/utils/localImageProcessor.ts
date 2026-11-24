import { DevelopSettings, LearnedStyleProfile, PRESET_PROFILES, PresetProfileId } from './xmpGenerator';

export interface HistogramBins {
  r: number[];
  g: number[];
  b: number[];
  luma: number[];
}

/**
 * Attempts to extract the largest embedded JPEG preview from a Camera RAW file (.CR2, .CR3, .NEF, .ARW, .DNG, .RAF).
 * Most RAW formats store full-res or medium-res JFIF/Exif JPEG previews marked by 0xFF 0xD8 ... 0xFF 0xD9.
 */
export async function extractRawEmbeddedPreview(file: File): Promise<Blob | null> {
  try {
    // Limit read to first 12MB where embedded previews almost always reside
    const maxSlice = Math.min(file.size, 12 * 1024 * 1024);
    const buffer = await file.slice(0, maxSlice).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let bestStart = -1;
    let bestEnd = -1;
    let bestSize = 0;

    // Scan for JPEG SOI markers (0xFF 0xD8 0xFF)
    for (let i = 0; i < bytes.length - 4; i++) {
      if (bytes[i] === 0xff && bytes[i + 1] === 0xd8 && bytes[i + 2] === 0xff) {
        // Look ahead for EOI (0xFF 0xD9) within reasonable JPEG bounds
        const searchLimit = Math.min(bytes.length - 1, i + 4_500_000);
        for (let j = i + 256; j < searchLimit; j++) {
          if (bytes[j] === 0xff && bytes[j + 1] === 0xd9) {
            const candidateSize = j + 2 - i;
            // Ignore tiny EXIF thumbnails (< 18KB) if larger preview exists
            if (candidateSize > bestSize && candidateSize > 18_000) {
              bestStart = i;
              bestEnd = j + 2;
              bestSize = candidateSize;
            }
            if (candidateSize > 120_000) {
              i = j + 2;
              break;
            }
          }
        }
      }
    }

    if (bestStart !== -1 && bestEnd > bestStart) {
      return new Blob([bytes.slice(bestStart, bestEnd)], { type: 'image/jpeg' });
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Loads a File or Blob into an HTMLImageElement safely.
 */
export function loadImageFromSource(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Generates a lightweight Smart Preview (max 1024px, JPEG ~150-280KB) directly on the user's device.
 * Never uploads full RAW/high-res originals for AI inference.
 */
export async function generateSmartPreview(
  imageSrc: string,
  maxDimension = 1024,
  quality = 0.84
): Promise<{ base64: string; mimeType: string; width: number; height: number }> {
  const img = await loadImageFromSource(imageSrc);
  const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
  const width = Math.max(1, Math.round((img.naturalWidth || 800) * scale));
  const height = Math.max(1, Math.round((img.naturalHeight || 600) * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D não disponível neste navegador.');
  }
  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  return {
    base64: dataUrl,
    mimeType: 'image/jpeg',
    width,
    height,
  };
}

/**
 * Generates a small fast thumbnail data URL for the filmstrip grid.
 */
export async function generateFastThumbnail(imageSrc: string, maxDim = 240): Promise<string> {
  const preview = await generateSmartPreview(imageSrc, maxDim, 0.72);
  return preview.base64;
}

/**
 * Renders Lightroom-calibrated adjustments onto a Canvas element and returns live RGB Histogram bins.
 */
export function renderAdjustedToCanvas(
  sourceImg: HTMLImageElement,
  targetCanvas: HTMLCanvasElement,
  settings: DevelopSettings,
  maxRenderWidth = 1400
): HistogramBins {
  const natW = sourceImg.naturalWidth || sourceImg.width || 1000;
  const natH = sourceImg.naturalHeight || sourceImg.height || 750;
  const scale = Math.min(1, maxRenderWidth / Math.max(natW, natH));
  const w = Math.max(1, Math.round(natW * scale));
  const h = Math.max(1, Math.round(natH * scale));

  if (targetCanvas.width !== w) targetCanvas.width = w;
  if (targetCanvas.height !== h) targetCanvas.height = h;

  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });

  const emptyBins = (): HistogramBins => ({
    r: new Array(32).fill(0),
    g: new Array(32).fill(0),
    b: new Array(32).fill(0),
    luma: new Array(32).fill(0),
  });

  if (!ctx) return emptyBins();

  const skinSmooth = Number(settings.skinSmoothing || 0);
  ctx.filter = skinSmooth > 12 ? `blur(${(skinSmooth * 0.008).toFixed(2)}px)` : 'none';
  ctx.drawImage(sourceImg, 0, 0, w, h);
  ctx.filter = 'none';

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Precompute multipliers cleanly with safe finite numbers
  const expVal = Number.isFinite(settings.exposure) ? settings.exposure : 0;
  const tempVal = Number.isFinite(settings.temperature) ? settings.temperature : 5500;
  const tintVal = Number.isFinite(settings.tint) ? settings.tint : 0;
  const contrastVal = Number.isFinite(settings.contrast) ? settings.contrast : 0;
  const highlightsVal = Number.isFinite(settings.highlights) ? settings.highlights : 0;
  const shadowsVal = Number.isFinite(settings.shadows) ? settings.shadows : 0;
  const whitesVal = Number.isFinite(settings.whites) ? settings.whites : 0;
  const blacksVal = Number.isFinite(settings.blacks) ? settings.blacks : 0;
  const clarityVal = Number.isFinite(settings.clarity) ? settings.clarity : 0;
  const satVal = Number.isFinite(settings.saturation) ? settings.saturation : 0;
  const vibVal = Number.isFinite(settings.vibrance) ? settings.vibrance : 0;

  const exposureMult = Math.pow(2, expVal * 0.85);
  const tempDelta = (tempVal - 5500) / 3800; // responsive warm/cool Kelvin shift
  const tintDelta = tintVal / 90;
  const contrastFactor = Math.max(0.2, 1 + (contrastVal / 100) * 0.65);
  const highlightsAdj = (highlightsVal / 100) * 0.58;
  const shadowsAdj = (shadowsVal / 100) * 0.62;
  const whitesAdj = (whitesVal / 100) * 42;
  const blacksAdj = (blacksVal / 100) * 38;
  const satFactor = Math.max(0, 1 + (satVal / 100) * 0.85);
  const vibFactor = (vibVal / 100) * 0.65;
  const clarityAmt = (clarityVal / 100) * 0.28;

  const rMult = Math.max(0.25, 1 + tempDelta * 0.28 + tintDelta * 0.1);
  const gMult = Math.max(0.25, 1 - tintDelta * 0.22);
  const bMult = Math.max(0.25, 1 - tempDelta * 0.30 + tintDelta * 0.1);

  const bins = emptyBins();
  const clamp255 = (v: number) => (!Number.isFinite(v) ? 0 : v < 0 ? 0 : v > 255 ? 255 : v);

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. White balance (Temperature + Tint)
    r *= rMult;
    g *= gMult;
    b *= bMult;

    // 2. Exposure
    r *= exposureMult;
    g *= exposureMult;
    b *= exposureMult;

    // 3. Luminance-aware Shadows / Highlights / Whites / Blacks (strictly clamped 0..1 to avoid Math.pow NaN)
    const rawLuma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const luma = rawLuma < 0 ? 0 : rawLuma > 1 ? 1 : rawLuma;

    if (shadowsAdj !== 0 && luma < 0.55) {
      const ratio = Math.max(0, 1 - luma / 0.55);
      const weight = Math.pow(ratio, 1.45);
      const lift = shadowsAdj * weight * 120;
      r += lift;
      g += lift;
      b += lift;
    }

    if (highlightsAdj !== 0 && luma > 0.45) {
      const ratio = Math.max(0, (luma - 0.45) / 0.55);
      const weight = Math.pow(ratio, 1.35);
      const pull = highlightsAdj * weight * 125;
      r += pull;
      g += pull;
      b += pull;
    }

    if (whitesAdj !== 0 && luma > 0.72) {
      const wWeight = (luma - 0.72) / 0.28;
      r += whitesAdj * wWeight;
      g += whitesAdj * wWeight;
      b += whitesAdj * wWeight;
    }

    if (blacksAdj !== 0 && luma < 0.28) {
      const bWeight = 1 - luma / 0.28;
      r += blacksAdj * bWeight;
      g += blacksAdj * bWeight;
      b += blacksAdj * bWeight;
    }

    // 4. Contrast + Midtone Clarity S-curve
    if (contrastFactor !== 1 || clarityAmt !== 0) {
      const mid = 127.5;
      const midMask = 1 - Math.abs(luma - 0.5) * 1.4;
      const totalC = contrastFactor + clarityAmt * Math.max(0, midMask);
      r = (r - mid) * totalC + mid;
      g = (g - mid) * totalC + mid;
      b = (b - mid) * totalC + mid;
    }

    // 5. Vibrance (protects saturated colors & skin tones) + Saturation
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const curSat = maxC > 0 ? Math.min(1, Math.max(0, (maxC - minC) / maxC)) : 0;
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    const effSat = Math.max(0, satFactor + vibFactor * (1 - curSat));
    r = gray + (r - gray) * effSat;
    g = gray + (g - gray) * effSat;
    b = gray + (b - gray) * effSat;

    const fr = clamp255(r);
    const fg = clamp255(g);
    const fb = clamp255(b);

    data[i] = fr;
    data[i + 1] = fg;
    data[i + 2] = fb;

    // Sample histogram every 4th pixel
    if ((i & 15) === 0) {
      const fl = 0.299 * fr + 0.587 * fg + 0.114 * fb;
      bins.r[Math.min(31, fr >> 3)]++;
      bins.g[Math.min(31, fg >> 3)]++;
      bins.b[Math.min(31, fb >> 3)]++;
      bins.luma[Math.min(31, fl >> 3)]++;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return bins;
}

/**
 * Exports a fully processed JPEG File/Blob from an original local photo at high resolution
 * so only finalized JPGs are saved to disk or sent to Frame+ Art Gallery.
 */
export async function exportEditedJpgBlob(
  imageSrc: string,
  settings: DevelopSettings,
  maxDimension = 2800,
  quality = 0.92
): Promise<Blob> {
  const img = await loadImageFromSource(imageSrc);
  const canvas = document.createElement('canvas');
  renderAdjustedToCanvas(img, canvas, settings, maxDimension);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Falha ao renderizar JPG editado.'));
      },
      'image/jpeg',
      quality
    );
  });
}

/**
 * Local Histogram Analyzer (Demo Mode & Calibration-aware fallback).
 * Measures real pixel luminance, shadow/highlight clipping, RGB color cast, and blends toward the photographer's
 * 10-photo Learned Style Profile (if provided) or chosen Preset Profile.
 */
export async function analyzeImageWithLocalHistogram(
  imageSrc: string,
  presetProfile: PresetProfileId,
  learnedProfile?: LearnedStyleProfile | null
): Promise<DevelopSettings> {
  const img = await loadImageFromSource(imageSrc);
  const w = 180;
  const h = Math.max(1, Math.round(((img.naturalHeight || 1) / (img.naturalWidth || 1)) * w));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Contexto 2D indisponível para leitura de histograma.');
  }
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let sumLuma = 0;
  let darkPixels = 0;
  let brightPixels = 0;
  let skinPixels = 0;
  const totalPixels = w * h;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    sumR += r;
    sumG += g;
    sumB += b;
    sumLuma += luma;

    if (luma < 45) darkPixels++;
    if (luma > 220) brightPixels++;
    if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
      skinPixels++;
    }
  }

  const avgR = sumR / totalPixels;
  const avgG = sumG / totalPixels;
  const avgB = sumB / totalPixels;
  const avgLuma = sumLuma / totalPixels; // 0-255
  const darkRatio = darkPixels / totalPixels;
  const brightRatio = brightPixels / totalPixels;
  const skinRatio = skinPixels / totalPixels;

  const presetObj = PRESET_PROFILES.find((p) => p.id === presetProfile) || PRESET_PROFILES[0];
  const base: Partial<DevelopSettings> = learnedProfile ? learnedProfile.meanSettings : presetObj.baseBias;

  // Target luma ~126; compute scene-adaptive EV compensation blended with photographer's calibrated bias
  const evAuto = Math.min(1.35, Math.max(-1.1, ((126 - avgLuma) / 140) * 1.1));
  const rbDiff = avgR - avgB;
  const baseTemp = base.temperature || 5500;
  const tempAuto = Math.min(
    7800,
    Math.max(3800, Math.round(baseTemp - rbDiff * (learnedProfile ? 9 : 14)))
  );
  const tintAuto = Math.min(
    25,
    Math.max(-25, Math.round((base.tint || 0) + ((avgR + avgB) / 2 - avgG) * 0.12))
  );

  const highlightsAuto =
    brightRatio > 0.14
      ? Math.max(-90, Math.min(-10, (base.highlights ?? -20) - 20))
      : base.highlights ?? -15;
  const shadowsAuto =
    darkRatio > 0.22
      ? Math.min(85, (base.shadows ?? 18) + 20)
      : base.shadows ?? 18;

  const baseExp = base.exposure ?? 0;
  const exposure = Number(
    (learnedProfile ? baseExp * 0.72 + evAuto * 0.5 : baseExp * 0.5 + evAuto * 0.85).toFixed(2)
  );

  const reasons: string[] = [];
  if (learnedProfile) {
    reasons.push(`aplicado padrão pessoal "${learnedProfile.name}" (${learnedProfile.sampleCount} fotos)`);
  }
  if (evAuto > 0.15) reasons.push(`exposição ajustada (${exposure >= 0 ? '+' : ''}${exposure.toFixed(2)} EV)`);
  else if (evAuto < -0.15) reasons.push(`exposição contida (${exposure.toFixed(2)} EV)`);
  else reasons.push('equilíbrio tonal calibrado');

  if (brightRatio > 0.14) reasons.push(`realces (${highlightsAuto})`);
  if (darkRatio > 0.22) reasons.push(`sombras (+${shadowsAuto})`);
  if (skinRatio > 0.08) reasons.push('tons de pele detectados e protegidos');

  return {
    temperature: tempAuto,
    tint: tintAuto,
    exposure,
    contrast: base.contrast ?? 10,
    highlights: highlightsAuto,
    shadows: shadowsAuto,
    whites: base.whites ?? 8,
    blacks: base.blacks ?? -8,
    clarity: base.clarity ?? 8,
    vibrance: base.vibrance ?? 12,
    saturation: base.saturation ?? 0,
    skinSmoothing:
      skinRatio > 0.08
        ? Math.max(learnedProfile ? base.skinSmoothing ?? 15 : 18, base.skinSmoothing ?? 15)
        : base.skinSmoothing ?? 8,
    cullingScore: brightRatio < 0.35 && darkRatio < 0.45 ? 4 : 3,
    focusStatus: 'nítida',
    eyesOpen: true,
    sceneType: skinRatio > 0.1 ? 'Retrato / Pessoas' : 'Cena Geral',
    aiReasoning: `Histograma local (${learnedProfile ? learnedProfile.name : presetProfile}): ${reasons.join(', ')}.`,
  };
}
