# Aseprite Medieval Corner Assets - Guidelines

## File Structure Required

```
/src/assets/ornaments/
├── corners/
│   ├── fleur-de-lis/
│   │   ├── top-left.png
│   │   ├── top-right.png
│   │   ├── bottom-left.png
│   │   └── bottom-right.png
│   ├── gothic/
│   │   ├── top-left.png
│   │   ├── top-right.png
│   │   ├── bottom-left.png
│   │   └── bottom-right.png
│   ├── celtic/
│   ├── baroque/
│   ├── runes/
│   └── carved/
├── edges/ (optional)
│   ├── horizontal.png
│   └── vertical.png
└── decorations/ (optional)
    ├── center-medallion.png
    └── side-ornaments.png
```

## Canvas Specifications

### Corner Pieces
- **Canvas Size**: 32x32 pixels (recommended)
  - Minimum: 16x16 pixels
  - Maximum: 64x64 pixels
- **Color Mode**: Indexed Color (for authentic pixel art)
- **Background**: Transparent
- **Export Format**: PNG with transparency

### Edge Pieces (Optional)
- **Horizontal**: 32x16 pixels
- **Vertical**: 16x32 pixels

## Design Guidelines

### 1. Windows 95 Color Palette
Use these core colors for compatibility:
- **Light Gray**: #C0C0C0 (main background)
- **White**: #FFFFFF (highlights)
- **Dark Gray**: #808080 (shadows)
- **Black**: #000000 (deep shadows/outlines)

### 2. Medieval Accent Colors
- **Gold**: #DAA520, #FFD700
- **Bronze**: #CD7F32, #B8860B
- **Silver**: #C0C0C0, #E5E5E5
- **Dark Bronze**: #8B4513, #654321

### 3. Corner Design Rules

#### Symmetry
- **Top-left**: Original design
- **Top-right**: Horizontally flipped
- **Bottom-left**: Vertically flipped
- **Bottom-right**: Both horizontally and vertically flipped

#### Border Integration
- Leave 2-4 pixels on the edges transparent or with Windows 95 colors
- The ornament should "sit on top" of the border, not replace it
- Ensure corners don't overlap when placed on actual borders

#### Style Characteristics

**Fleur-de-Lis**:
- Classic French lily motif
- Use gold/yellow tones
- Should have 3 main petals
- Add small decorative details

**Gothic**:
- Sharp, angular designs
- Stone/gray tones with gold accents
- Cathedral-inspired patterns
- Cross or arch motifs

**Celtic**:
- Knotwork patterns
- Green/gold color scheme
- Interwoven lines
- Natural/organic curves

**Baroque**:
- Ornate, flowing designs
- Rich colors (gold, deep reds)
- Curved flourishes
- Scrollwork patterns

**Runes**:
- Norse/Viking inspired
- Stone/weathered appearance
- Angular runic symbols
- Darker, earthier tones

**Carved**:
- Stone carving appearance
- Raised/recessed effect using highlights/shadows
- Simple geometric patterns
- Monochromatic (grays with subtle color)

## Technical Requirements

### 1. File Naming Convention
```
{style-name}-{position}.png

Examples:
- fleur-de-lis-top-left.png
- gothic-bottom-right.png
- celtic-top-right.png
```

### 2. Transparency
- Use true transparency (not magic pink)
- Anti-aliasing should be minimal or none for pixel-perfect scaling
- Transparent areas should allow the underlying border to show through

### 3. Pixel Perfect Guidelines
- Use 1:1 pixel ratio (no sub-pixels)
- Avoid anti-aliasing on main shapes
- Use manual anti-aliasing only for diagonal lines if needed
- Ensure sharp edges for that authentic pixel art look

### 4. Shadow and Highlight
Follow Windows 95 lighting conventions:
- **Light source**: Top-left
- **Highlights**: Top and left edges
- **Shadows**: Bottom and right edges
- **Depth**: Use 2-3 tone gradients maximum

## Size Variants (Optional)
Create multiple sizes for different use cases:
- **Small**: 16x16px (for small buttons)
- **Medium**: 32x32px (standard windows)
- **Large**: 48x48px (title bars, important windows)

## Export Settings in Aseprite
1. File → Export Sprite
2. Format: PNG
3. Check "Transparent Color" if using indexed mode
4. Uncheck "Apply pixel ratio" 
5. Scale: 100%
6. Don't resize

## Testing Template
Create a test file with:
- A 200x200 pixel canvas
- Windows 95 style border drawn
- Place your corners in each position
- Test different backgrounds to ensure transparency works

## Implementation Notes
Once you provide the files, I'll create:
1. An asset loader utility
2. A corner renderer component
3. Automatic corner positioning system
4. Size scaling algorithms
5. Theme switching functionality

The system will automatically:
- Load appropriate corner assets
- Position them correctly on any sized container
- Handle rotation/flipping for each corner
- Scale proportionally when containers resize
- Blend with existing Windows 95 borders

## Recommended Workflow
1. Start with the fleur-de-lis style (most recognizable)
2. Create just the top-left corner first
3. Test integration before creating all 4 corners
4. Once satisfied, create the remaining corners
5. Move to the next style

Would you like me to create a specific color palette file (.pal) for Aseprite with the exact Windows 95 + medieval colors?
