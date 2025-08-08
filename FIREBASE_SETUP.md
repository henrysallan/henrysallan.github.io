# Firebase Setup Instructions

## Updated Database Configuration

I've restructured the database to use user subcollections which eliminates the index requirement and improves security.

### 1. New Database Structure

Instead of a global `images` collection with userId filters, we now use:
```
/users/{userId}/desktopImages/{imageId}
```

This approach:
- ✅ Eliminates complex index requirements
- ✅ Improves security (users can only access their own data)
- ✅ Simplifies queries
- ✅ Better Firebase best practices

### 2. Required Firebase Configuration Steps

#### A. Update Firestore Security Rules
Go to Firebase Console → Firestore Database → Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcollections for user data
      match /desktopImages/{imageId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Legacy collections (if needed)
    match /notes/{document} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /bookmarks/{document} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /layouts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### B. Update Firebase Storage Rules
Go to Firebase Console → Storage → Rules and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload/read their own images
    match /desktopImages/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Desktop Images Feature (Now with Compression!)

The app now supports dragging images from your desktop directly onto the browser window with automatic compression:

1. **Drag & Drop**: Drag image files from desktop → browser window
2. **Automatic Compression**: Images are compressed to WebP format (typically 60-80% size reduction)
3. **Borderless Images**: Images appear as floating elements (not in windows)
4. **Draggable**: Click and drag images around the desktop
5. **Resizable**: Drag the corner handle to resize
6. **Persistent**: Positions/sizes saved to Firebase automatically
7. **Delete**: Right-click on images to delete
8. **Performance Optimized**: Fast loading thanks to WebP compression

#### Compression Details:
- **Format**: Converts all images to WebP
- **Max Dimensions**: 1200x900 pixels (maintains aspect ratio)
- **Quality**: 80% (excellent quality, great compression)
- **Size Limit**: 50MB original (usually compresses to <5MB)
- **Typical Savings**: 60-80% file size reduction

### 4. Testing Steps

1. Apply the Firebase rules above
2. Open the app at http://localhost:5178/
3. Log in with Google
4. Drag an image file from your desktop onto the browser
5. Watch the compression indicator ("🗜️ Compressing and uploading image...")
6. Check browser console for compression stats (original vs compressed size)
7. Image should appear as a floating element
8. Try moving and resizing it
9. Refresh - image should persist

**Performance Tip**: The first upload might take a moment for compression, but subsequent loads will be much faster due to the smaller WebP files!

### 5. What Changed

- ✅ Restructured database queries to avoid index requirements
- ✅ Updated all CRUD operations for new structure  
- ✅ Fixed TypeScript types
- ✅ Removed unused imports
- ✅ Created proper security rules
3. Ensure the bucket has proper CORS rules for your domain

**Alternative: Use Firestore for small images**
For now, we can store small images as base64 data URLs in Firestore to avoid CORS issues.

### 3. Storage Security Rules
Make sure your Firebase Storage security rules allow authenticated users to upload:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /desktopImages/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Current Implementation

The desktop images feature is now implemented with:
- Drag & drop images from desktop onto browser
- Images appear as borderless draggable elements on the desktop background
- Position and size are stored in Firestore
- Images are stored in Firebase Storage
- Delete functionality with hover UI

## Usage
1. Drag an image file from your desktop onto the browser window
2. The image will appear as a draggable element
3. Drag to move, use resize handle to resize
4. Hover to see delete button
5. All changes are automatically saved
