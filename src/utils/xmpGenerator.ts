export interface DevelopSettings {
  temperature: number; // 2000 - 12000 Kelvin
  tint: number; // -50 to +50
  exposure: number; // -3.00 to +3.00 EV
  contrast: number; // -100 to +100
  highlights: number; // -100 to +100
  shadows: number; // -100 to +100
  whites: number; // -100 to +100
  blacks: number; // -100 to +100
  clarity: number; // -100 to +100
  vibrance: number; // -100 to +100
  saturation: number; // -100 to +100
  skinSmoothing: number; // 0 to 100
  cullingScore?: number; // 1 to 5 stars
  focusStatus?: string;
  eyesOpen?: boolean;
  sceneType?: string;
  aiReasoning?: string;
}

export type PresetProfileId =
  | 'Clean & Natural'
  | 'Editorial Warm'
  | 'Moody & Contrast'
  | 'High-Key Studio'
  | string;

export interface LearnedStyleDna {
  summary: string;
  wbTendency: string;
  exposureStyle: string;
  contrastAndTone: string;
  skinRule: string;
  colorPalette: string;
}

export interface LearnedStyleProfile {
  id: string;
  ownerId: string;
  name: string;
  sampleCount: number;
  meanSettings: DevelopSettings;
  sampleThumbnails?: string[];
  styleDna: LearnedStyleDna;
  createdAt: string;
  updatedAt: string;
}

export interface CalibrationSample {
  photoId: string;
  fileName: string;
  thumbnailUrl: string | null;
  previewBase64: string;
  settings: DevelopSettings;
}

export const PRESET_PROFILES: {
  id: PresetProfileId;
  label: string;
  description: string;
  baseBias: Partial<DevelopSettings>;
}[] = [
  {
    id: 'Clean & Natural',
    label: 'Clean & Natural',
    description: 'Cores fiéis, pele natural e luz equilibrada',
    baseBias: {
      temperature: 5450,
      tint: 3,
      exposure: 0.15,
      contrast: 10,
      highlights: -25,
      shadows: 22,
      whites: 8,
      blacks: -8,
      clarity: 6,
      vibrance: 12,
      saturation: 0,
      skinSmoothing: 15,
    },
  },
  {
    id: 'Editorial Warm',
    label: 'Editorial Warm',
    description: 'Tons quentes, contraste suave e realce dourado',
    baseBias: {
      temperature: 6050,
      tint: 7,
      exposure: 0.2,
      contrast: 8,
      highlights: -32,
      shadows: 26,
      whites: 6,
      blacks: -6,
      clarity: 4,
      vibrance: 14,
      saturation: -4,
      skinSmoothing: 20,
    },
  },
  {
    id: 'Moody & Contrast',
    label: 'Moody & Contrast',
    description: 'Sombras profundas e atmosfera cinematográfica',
    baseBias: {
      temperature: 5200,
      tint: 4,
      exposure: -0.1,
      contrast: 22,
      highlights: -42,
      shadows: -12,
      whites: 4,
      blacks: -22,
      clarity: 16,
      vibrance: 6,
      saturation: -14,
      skinSmoothing: 12,
    },
  },
  {
    id: 'High-Key Studio',
    label: 'High-Key Studio',
    description: 'Brancos limpos, alta nitidez e pele uniforme',
    baseBias: {
      temperature: 5300,
      tint: 2,
      exposure: 0.45,
      contrast: 6,
      highlights: -18,
      shadows: 35,
      whites: 20,
      blacks: -4,
      clarity: 10,
      vibrance: 10,
      saturation: -2,
      skinSmoothing: 25,
    },
  },
];

export const DEFAULT_DEVELOP_SETTINGS: DevelopSettings = {
  temperature: 5500,
  tint: 0,
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  clarity: 0,
  vibrance: 0,
  saturation: 0,
  skinSmoothing: 0,
  cullingScore: 0,
};

export function getXmpFileName(originalFileName: string): string {
  const dotIndex = originalFileName.lastIndexOf('.');
  const baseName = dotIndex > 0 ? originalFileName.slice(0, dotIndex) : originalFileName;
  return `${baseName}.xmp`;
}

export function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) return '';
  return fileName.slice(dotIndex + 1).toLowerCase();
}

export const RAW_EXTENSIONS = new Set([
  'cr3',
  'cr2',
  'crw',
  'nef',
  'nrw',
  'arw',
  'srf',
  'sr2',
  'dng',
  'raf',
  'orf',
  'rw2',
  'pef',
  'srw',
  '3fr',
  'fff',
]);

export const WEB_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

export function isRawFileName(fileName: string): boolean {
  return RAW_EXTENSIONS.has(getFileExtension(fileName));
}

export function isSupportedPhotoFile(fileName: string): boolean {
  const ext = getFileExtension(fileName);
  return WEB_IMAGE_EXTENSIONS.has(ext) || RAW_EXTENSIONS.has(ext);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatSignedInt(val: number): string {
  const rounded = Math.round(val);
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

function formatExposure(val: number): string {
  const fixed = val.toFixed(2);
  return val > 0 ? `+${fixed}` : fixed;
}

/**
 * Generates an Adobe Camera Raw / Lightroom Classic compliant .XMP sidecar file.
 * Compatible with Adobe Lightroom Classic, Adobe Bridge, and Camera Raw (Process Version 15.4).
 */
export function generateAdobeXmp(
  settings: DevelopSettings,
  originalFileName: string,
  presetProfile?: string
): string {
  const isoNow = new Date().toISOString();
  const rating = Math.min(5, Math.max(0, Math.round(settings.cullingScore || 0)));
  // Map skinSmoothing subtly into Texture (-skinSmoothing * 0.35) so Lightroom applies organic skin softening
  const textureVal = settings.skinSmoothing > 0 ? Math.round(-settings.skinSmoothing * 0.35) : 0;
  const sharpnessVal = settings.skinSmoothing > 20 ? 35 : 40;
  const rawRawFileName = escapeXml(originalFileName);
  const label = rating >= 4 ? 'Green' : rating === 3 ? 'Yellow' : '';

  return `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Frame+ AI Studio XMP Engine 2.0">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:xmp="http://ns.adobe.com/xap/1.0/"
    xmlns:aux="http://ns.adobe.com/exif/1.0/aux/"
    xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmp:CreatorTool="Frame+ AI Studio"
   xmp:ModifyDate="${isoNow}"
   xmp:MetadataDate="${isoNow}"
   xmp:Rating="${rating}"
   ${label ? `xmp:Label="${label}"` : ''}
   crs:Version="16.4"
   crs:ProcessVersion="15.4"
   crs:WhiteBalance="Custom"
   crs:Temperature="${Math.round(settings.temperature)}"
   crs:Tint="${formatSignedInt(settings.tint)}"
   crs:Exposure2012="${formatExposure(settings.exposure)}"
   crs:Contrast2012="${formatSignedInt(settings.contrast)}"
   crs:Highlights2012="${formatSignedInt(settings.highlights)}"
   crs:Shadows2012="${formatSignedInt(settings.shadows)}"
   crs:Whites2012="${formatSignedInt(settings.whites)}"
   crs:Blacks2012="${formatSignedInt(settings.blacks)}"
   crs:Texture="${formatSignedInt(textureVal)}"
   crs:Clarity2012="${formatSignedInt(settings.clarity)}"
   crs:Dehaze="0"
   crs:Vibrance="${formatSignedInt(settings.vibrance)}"
   crs:Saturation="${formatSignedInt(settings.saturation)}"
   crs:Sharpness="${sharpnessVal}"
   crs:LuminanceSmoothing="${Math.min(40, Math.round(settings.skinSmoothing * 0.5))}"
   crs:ColorNoiseReduction="25"
   crs:RawFileName="${rawRawFileName}"
   crs:HasSettings="True"
   crs:AlreadyApplied="False">
   ${presetProfile ? `<dc:description>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">Frame+ AI Studio Profile: ${escapeXml(presetProfile)}${settings.aiReasoning ? ` — ${escapeXml(settings.aiReasoning)}` : ''}</rdf:li>
    </rdf:Alt>
   </dc:description>` : ''}
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
`;
}

/**
 * Parses an existing .XMP sidecar string back into DevelopSettings sliders.
 */
export function parseXmpToDevelopSettings(xmpText: string): Partial<DevelopSettings> | null {
  if (!xmpText || typeof xmpText !== 'string') return null;

  const extractNum = (attr: string): number | undefined => {
    const match = xmpText.match(new RegExp(`${attr}="([+-]?\\d+(?:\\.\\d+)?)"`, 'i'));
    if (!match) return undefined;
    const n = parseFloat(match[1]);
    return Number.isFinite(n) ? n : undefined;
  };

  const result: Partial<DevelopSettings> = {};
  const temp = extractNum('crs:Temperature');
  if (temp !== undefined) result.temperature = temp;

  const tint = extractNum('crs:Tint');
  if (tint !== undefined) result.tint = tint;

  const exp = extractNum('crs:Exposure2012');
  if (exp !== undefined) result.exposure = exp;

  const contrast = extractNum('crs:Contrast2012');
  if (contrast !== undefined) result.contrast = contrast;

  const highlights = extractNum('crs:Highlights2012');
  if (highlights !== undefined) result.highlights = highlights;

  const shadows = extractNum('crs:Shadows2012');
  if (shadows !== undefined) result.shadows = shadows;

  const whites = extractNum('crs:Whites2012');
  if (whites !== undefined) result.whites = whites;

  const blacks = extractNum('crs:Blacks2012');
  if (blacks !== undefined) result.blacks = blacks;

  const clarity = extractNum('crs:Clarity2012');
  if (clarity !== undefined) result.clarity = clarity;

  const vibrance = extractNum('crs:Vibrance');
  if (vibrance !== undefined) result.vibrance = vibrance;

  const saturation = extractNum('crs:Saturation');
  if (saturation !== undefined) result.saturation = saturation;

  const rating = extractNum('xmp:Rating');
  if (rating !== undefined) result.cullingScore = rating;

  const texture = extractNum('crs:Texture');
  if (texture !== undefined && texture < 0) {
    result.skinSmoothing = Math.min(100, Math.round(Math.abs(texture) / 0.35));
  }

  return Object.keys(result).length > 0 ? result : null;
}
