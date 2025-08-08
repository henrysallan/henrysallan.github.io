// Utility to create placeholder ornament images
// This helps during development before real sprites are available

export const createPlaceholderOrnament = (
  canvas: HTMLCanvasElement,
  style: string,
  _position: string, // Position used for future corner-specific variations
  size: number = 32
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  canvas.width = size;
  canvas.height = size;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // Windows 95 colors
  const colors = {
    light: '#FFFFFF',
    medium: '#C0C0C0', 
    dark: '#808080',
    black: '#000000',
    gold: '#DAA520',
    bronze: '#CD7F32'
  };

  // Draw base circle
  ctx.fillStyle = colors.medium;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
  ctx.fill();

  // Draw border
  ctx.strokeStyle = colors.dark;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw style-specific symbol
  ctx.fillStyle = colors.gold;
  ctx.font = `${size/2}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  let symbol = '◆';
  switch (style) {
    case 'fleur-de-lis': symbol = '⚜'; break;
    case 'gothic': symbol = '✠'; break;
    case 'celtic': symbol = '❋'; break;
    case 'baroque': symbol = '❦'; break;
    case 'runes': symbol = 'ᚱ'; break;
    case 'carved': symbol = '◢'; break;
  }
  
  ctx.fillText(symbol, size/2, size/2);
  
  return canvas.toDataURL();
};

// Generate all placeholder images
export const generatePlaceholders = () => {
  const styles = ['fleur-de-lis', 'gothic', 'celtic', 'baroque', 'runes', 'carved'];
  const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const placeholders: Record<string, string> = {};
  
  const canvas = document.createElement('canvas');
  
  styles.forEach(style => {
    positions.forEach(position => {
      const key = `${style}/${position}`;
      const dataUrl = createPlaceholderOrnament(canvas, style, position);
      if (dataUrl) {
        placeholders[key] = dataUrl;
      }
    });
  });
  
  return placeholders;
};
