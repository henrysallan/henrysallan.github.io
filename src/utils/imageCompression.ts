/**
 * Image compression utility for converting and compressing images to WebP format
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, where 1 is best quality
  format?: 'webp' | 'jpeg' | 'png';
}

export const compressImage = (
  file: File, 
  options: CompressionOptions = {}
): Promise<Blob> => {
  const {
    maxWidth = 800,
    maxHeight = 600,
    quality = 0.8,
    format = 'webp'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          `image/${format}`,
          quality
        );
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    
    // Create object URL for the image
    img.src = URL.createObjectURL(file);
  });
};

export const getCompressedFileName = (originalName: string, format: string = 'webp'): string => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}.${format}`;
};

export const estimateCompressionSavings = (originalSize: number, compressedSize: number): string => {
  const savings = ((originalSize - compressedSize) / originalSize) * 100;
  return `${savings.toFixed(1)}%`;
};
