# 3D Model Viewer - Testing Guide

## 🎲 **3D Model Drag-and-Drop System**

Your Windows 95-themed React app now includes a lightweight Three.js viewer for GLB/GLTF 3D models with Firebase persistence!

## ✨ **Features Implemented**

### **Drag-and-Drop 3D Models**
- Drop GLB or GLTF files anywhere on the desktop
- Automatic upload to Firebase Storage 
- Persistent storage in Firestore
- Each model opens in its own windowed frame
- Models auto-rotate for demonstration

### **3D Viewer Windows**
- Windows 95-style window frames
- Draggable around the desktop
- Individual close buttons
- Model name in title bar
- Full 3D navigation (orbit, zoom, pan)

### **Storage & Persistence**
- Models stored in Firebase Storage
- Metadata in Firestore (position, name, etc.)
- Automatic position saving when dragging
- Models persist across page refreshes
- 50MB file size limit

## 🚀 **How to Test**

### **1. Get Test GLB Files**
You can get free GLB models from:
- **Sketchfab**: https://sketchfab.com/3d-models/categories/free
- **Kenney Assets**: https://kenney.nl/assets/category:3D
- **Google Poly Archive**: Various sources
- **Blender**: Export simple models as GLB

### **2. Upload Models**
1. **Drag GLB/GLTF files** onto the desktop
2. **Drop zone appears** with teal highlight
3. **Upload progress** shown in top-right
4. **3D viewer window** appears automatically

### **3. Interact with Models**
- **Orbit**: Left-click and drag
- **Zoom**: Mouse wheel or right-click drag
- **Pan**: Middle-click drag (or Shift + left-click)
- **Move Window**: Drag the title bar
- **Close**: Click ✕ in title bar

## 🔧 **Technical Details**

### **File Support**
- **.GLB** (Binary GLTF) - Recommended
- **.GLTF** (Text GLTF) - Supported
- **Max size**: 50MB per file
- **Auto-rotation**: Models rotate slowly for demo

### **3D Scene Setup**
- **Lighting**: Ambient + 2 directional lights
- **Camera**: Perspective, FOV 50°
- **Background**: Transparent checkerboard pattern
- **Controls**: Full orbit controls enabled

### **Firebase Integration**
- **Storage path**: `desktop-3d-models/`
- **Collection**: `desktop3DModels`
- **Fields**: name, url, position, windowId, createdAt, storageRef

## 📱 **Component Structure**

```
Desktop3DModels/
├── index.tsx           # Main drag-drop component
├── useDesktop3DModels  # Firebase hook
└── ThreeDViewer/
    └── index.tsx       # 3D viewer component
```

## 🎨 **Styling**

- **Windows 95 theme**: Consistent with existing UI
- **Teal headers**: `#008080` for 3D model windows
- **Pixel fonts**: Pixelify Sans for all text
- **Drop zones**: Animated teal borders
- **Progress bars**: Windows 95-style progress

## 🐛 **Error Handling**

- **Invalid files**: Shows error for non-GLB/GLTF
- **Large files**: 50MB limit with clear message
- **Upload failures**: Automatic cleanup and retry
- **Loading errors**: Fallback error display in 3D scene

## 🔄 **Performance Features**

- **Debounced position updates**: Reduces Firestore writes
- **Model preloading**: Better performance on re-opens
- **Automatic cleanup**: Removes storage files when deleted
- **Responsive UI**: Immediate local updates

## 📋 **Usage Example**

1. **Start the dev server**: `npm run dev`
2. **Open the app** in your browser
3. **Download a test GLB** (e.g., from Sketchfab)
4. **Drag the file** onto the desktop
5. **Watch the upload progress**
6. **Interact with your 3D model** in the new window!

## 🎯 **Next Steps**

The system is ready for use! You can:
- **Create custom models** in Blender and export as GLB
- **Download models** from 3D asset stores
- **Test different file sizes** and complexity
- **Enjoy 3D models** on your Windows 95 desktop!

---

**Note**: The Three.js bundle increases the app size, but provides full 3D capabilities. The viewer supports complex models with textures, animations, and materials.
