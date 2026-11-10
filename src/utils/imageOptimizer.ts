/**
 * Utilitário de Otimização e Conversão de Imagens para WebP de Altíssima Fidelidade
 *
 * Converte imagens enviadas no site para o formato moderno .webp:
 * - Mantém qualidade visual máxima (qualidade 0.92 = indistinguível do original para fotografia profissional)
 * - Redução drástica de peso em bytes (economiza entre 60% e 85% de tráfego e armazenamento)
 * - Preserva transparência alfa para logos, favicons e PNGs
 * - Mantém resolução nativa de alta definição (até 4K / 3840px)
 * - Arquivos vetoriais SVG e vídeos (MP4/WebM) são preservados intactos
 */

export interface WebPOptimizeOptions {
  quality?: number; // 0.0 a 1.0 (padrão 0.92 para qualidade visual máxima)
  maxDimension?: number; // padrão 3840px (Ultra HD 4K)
}

export async function convertToWebP(
  file: File,
  options: WebPOptimizeOptions = {}
): Promise<File> {
  // Ignora arquivos que não sejam imagem ou que sejam vetoriais SVG
  if (!file || !file.type || !file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  const quality = options.quality ?? 0.92;
  const maxDimension = options.maxDimension ?? 3840;

  try {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Não foi possível ler o arquivo de imagem'));
    });

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    // Se a foto tiver dimensões astronômicas (> 4K / 3840px de câmeras RAW de 60MP),
    // reduz proporcionalmente para 4K preservando total nitidez sem sobrecarregar a memória
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      return file;
    }

    // Ativa interpolação de alta qualidade para não perder detalhes
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    URL.revokeObjectURL(objectUrl);

    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/webp', quality);
    });

    if (!webpBlob) {
      return file;
    }

    // Gera o nome do arquivo com a extensão .webp
    const originalName = file.name || 'image';
    const lastDotIndex = originalName.lastIndexOf('.');
    const baseName = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName;
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const webpName = `${sanitizedBase}.webp`;

    console.log(
      `[WebP Optimizer] Convertido: "${file.name}" (${(file.size / 1024).toFixed(1)} KB) -> "${webpName}" (${(webpBlob.size / 1024).toFixed(1)} KB) | Economia de ${Math.max(0, Math.round((1 - webpBlob.size / file.size) * 100))}% mantendo qualidade máxima.`
    );

    return new File([webpBlob], webpName, {
      type: 'image/webp',
      lastModified: Date.now()
    });
  } catch (error) {
    console.warn('[WebP Optimizer] Fallback para arquivo original:', error);
    return file;
  }
}
