# Ornamental Corner Examples & Templates

## Quick Start Guide

### 1. First Time Setup in Aseprite
1. **Open Aseprite**
2. **Create New Sprite**: 32x32 pixels
3. **Load Palette**: File → Import → `src/assets/ornaments/windows95-medieval.pal`
4. **Set Mode**: Sprite → Color Mode → Indexed
5. **Transparent Background**: Layer → Background → Convert to Layer

### 2. Example: Simple Fleur-de-Lis Corner

#### Step-by-Step Creation
```
Pixels to draw for top-left corner (32x32):

Row 1-5: Start with a small triangle
Row 6-12: Add middle petal
Row 13-20: Add side petals  
Row 21-32: Fade to transparent

Colors to use:
- #FFD700 (bright gold) for main shape
- #DAA520 (gold) for shadows
- #B8860B (dark gold) for deep shadows
- #FFFFFF (white) for highlights
```

#### Visual Template (X = gold, . = transparent, o = shadow)
```
X...............................
XX..............................
XXX.............................
XXXX............................
XXXXX...........................
XXXXoX..........................
XXXooXX.........................
XXXoooXX........................
XXooooXX........................
XooooXXX........................
XooooXXX........................
XoooXXXX........................
XooXXXXX........................
XoXXXXXX........................
XXXXXXXX........................
.XXXXXXX........................
..XXXXXX........................
...XXXXX........................
....XXXX........................
.....XXX........................
......XX........................
.......X........................
................................
................................
................................
................................
................................
................................
................................
................................
................................
................................
```

### 3. Design Patterns by Style

#### Fleur-de-Lis Pattern
- **Central element**: Three-petal lily
- **Corner placement**: Main petal points outward from corner
- **Colors**: Primarily gold with gray shadows
- **Size**: Should fit in 24x24 pixel area, leaving 8 pixels for border

#### Gothic Pattern  
- **Central element**: Pointed arch or trefoil
- **Corner placement**: Arch crown at exact corner
- **Colors**: Stone gray with gold accents
- **Details**: Sharp, angular lines representing carved stone

#### Celtic Pattern
- **Central element**: Interwoven knot or spiral
- **Corner placement**: Knot center near corner, extending inward
- **Colors**: Bronze/green with darker line work
- **Details**: Continuous flowing lines, over/under weaving

#### Baroque Pattern
- **Central element**: Scrollwork or acanthus leaf
- **Corner placement**: Scroll curl at corner
- **Colors**: Rich gold with red accents
- **Details**: Flowing, organic curves with elaborate detail

#### Runes Pattern
- **Central element**: Angular runic symbol
- **Corner placement**: Symbol carved into corner stone
- **Colors**: Gray stone with darker carved lines
- **Details**: Weathered, aged appearance

#### Carved Pattern
- **Central element**: Geometric relief pattern
- **Corner placement**: Raised design emerging from corner
- **Colors**: Monochromatic grays with highlight/shadow
- **Details**: Strong 3D effect using light/shadow

## Pro Tips

### Aseprite Workflow
1. **Use Onion Skinning**: To check symmetry when creating flipped versions
2. **Layer Organization**: 
   - Base shape layer
   - Shadow layer  
   - Highlight layer
   - Detail layer
3. **Preview**: View → Tiled Mode to see how corners connect
4. **Export Batch**: File → Export Sprite → Export All Layers

### Design Validation
- **Corner Test**: Place all 4 corners together in a test file
- **Scale Test**: View at 1x, 2x, and 4x zoom
- **Background Test**: Try on light and dark backgrounds
- **Border Test**: Test with actual Windows 95 border pixels

### Common Mistakes to Avoid
- ❌ **Too detailed**: Ornaments should be clear at 32px
- ❌ **Wrong light source**: Always light from top-left
- ❌ **Inconsistent style**: Each set should feel cohesive
- ❌ **Missing transparency**: Areas without ornament must be transparent
- ❌ **Anti-aliasing**: Avoid automatic anti-aliasing for pixel-perfect look

## File Naming Convention
```
/corners/{style}/
├── top-left.png     (your main design)
├── top-right.png    (horizontal flip)
├── bottom-left.png  (vertical flip)  
└── bottom-right.png (both flips)
```

## Testing Integration

### Quick Test Process
1. Save your PNG files in appropriate folder
2. In the React app, open "UI Demo" window
3. Scroll to "Medieval Window Examples"
4. Select your style from dropdown
5. Resize window to test corner behavior

### What to Look For
- ✅ Corners appear at exact window corners
- ✅ Ornaments don't interfere with window content
- ✅ Style remains consistent when window resizes
- ✅ Transparency works (no ugly backgrounds)
- ✅ All 4 corners align properly

## Placeholder Testing

Until you create real assets, the app uses generated placeholder corners. You can see these in the UI Demo to understand:
- How corners are positioned
- How they scale with window size  
- How different styles should look different
- The general aesthetic we're aiming for

## Advanced Features (Optional)

### Edge Decorations
If you want to add connecting elements between corners:
- **Horizontal edge**: 32x8 pixels, repeatable pattern
- **Vertical edge**: 8x32 pixels, repeatable pattern
- Should connect seamlessly with corners

### Center Medallions  
For very large windows, you could create:
- **Center piece**: 64x64 pixels, goes in window center
- **Should complement** the corner style
- **Lower opacity** to not interfere with content

## Ready to Start?

1. **Choose your first style** (recommend starting with Fleur-de-Lis)
2. **Open Aseprite** with a 32x32 canvas
3. **Load the color palette** from the project
4. **Start with the top-left corner**
5. **Follow the visual template** above
6. **Test frequently** in the React app

Remember: Start simple and add detail gradually. It's better to have clean, readable ornaments than overly complex ones that become muddy at small sizes.

## Questions?

If you need help with:
- Specific Aseprite techniques
- Color choices for particular styles  
- Design feedback on your creations
- Technical integration issues

Just ask! I'm here to help you create beautiful medieval ornaments that perfectly complement the Windows 95 aesthetic.
