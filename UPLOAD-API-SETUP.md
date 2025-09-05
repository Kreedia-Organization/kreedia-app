# Upload API Configuration

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
# Upload API Configuration
NEXT_PUBLIC_UPLOAD_API_URL=http://localhost:8000/api/upload
```

Replace `http://localhost:8000` with your actual API server URL.

## API Endpoints

### POST /api/upload

Upload one or multiple files to your custom API.

#### Single File Upload

```javascript
const formData = new FormData();
formData.append("file", file);

const response = await fetch("http://your-api.com/api/upload", {
  method: "POST",
  body: formData,
});
```

#### Multiple Files Upload

```javascript
const formData = new FormData();
files.forEach((file) => {
  formData.append("files", file);
});

const response = await fetch("http://your-api.com/api/upload", {
  method: "POST",
  body: formData,
});
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "original_name": "document.pdf",
    "file_name": "550e8400-e29b-41d4-a716-446655440000.pdf",
    "extension": "pdf",
    "size": 1024000,
    "url": "http://your-domain.com/storage/uploads/550e8400-e29b-41d4-a716-446655440000.pdf",
    "path": "uploads/550e8400-e29b-41d4-a716-446655440000.pdf"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "file": ["The file field is required."]
  }
}
```

## File Validation

- **Maximum file size**: 10MB per file
- **Maximum files**: 10 files per request
- **Accepted types**: All file types (configurable in components)

## Components Updated

1. **ImageUpload** - Single image upload with preview
2. **MultiFileUpload** - Multiple files upload with management
3. **MissionForm** - Mission image upload
4. **UserSettingsModal** - Profile picture upload

## Usage Examples

### ImageUpload Component

```tsx
<ImageUpload
  onUploadComplete={(result) => console.log("Uploaded:", result.url)}
  onUploadError={(error) => console.error("Error:", error)}
  placeholder="Upload an image"
  maxFileSize={10}
  acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
/>
```

### MultiFileUpload Component

```tsx
<MultiFileUpload
  onUploadComplete={(files) => console.log("Uploaded files:", files)}
  onUploadError={(error) => console.error("Error:", error)}
  maxFiles={5}
  maxFileSize={10}
  acceptedTypes={["image/*", "application/pdf"]}
/>
```

## Migration from Cloudinary

The following files have been updated to use the new upload API:

- `lib/upload/api.ts` - New upload service
- `hooks/useFileUpload.ts` - Custom upload hook
- `components/ui/ImageUpload.tsx` - Updated image upload component
- `components/ui/MultiFileUpload.tsx` - New multi-file upload component
- `components/MissionForm.tsx` - Mission creation form
- `components/UserSettingsModal.tsx` - User profile settings

## Dependencies Removed

The following Cloudinary dependencies can be removed:

```bash
npm uninstall next-cloudinary
```

## Testing

To test the upload functionality:

1. Set up your upload API server
2. Configure the `NEXT_PUBLIC_UPLOAD_API_URL` environment variable
3. Test single file upload in mission creation
4. Test multiple file upload in appropriate components
5. Test profile picture upload in user settings
