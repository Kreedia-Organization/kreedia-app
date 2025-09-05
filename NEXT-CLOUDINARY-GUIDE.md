# 📸 Next-Cloudinary Integration Guide

## 🔧 **Configuration**

### **1. Installation**

```bash
npm install next-cloudinary
```

### **2. Variables d'Environnement (.env.local)**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **3. Upload Presets Cloudinary**

#### **Pour les Profils :**

- **Nom :** `PROFILES`
- **Mode :** `unsigned`
- **Transformations :**
  - Resize: `w_400,h_400,c_fill,g_face`
  - Quality: `auto`
  - Format: `auto`
- **Folder :** `profiles`

#### **Pour les Missions :**

- **Nom :** `MISSIONS`
- **Mode :** `unsigned`
- **Transformations :**
  - Resize: `w_800,h_600,c_fill`
  - Quality: `auto`
  - Format: `auto`
- **Folder :** `missions`

## 📝 **Utilisation dans le Code**

### **1. Upload Widget de Base**

```typescript
import { CldUploadWidget } from "next-cloudinary";

<CldUploadWidget
  uploadPreset="PROFILES"
  options={{
    maxFiles: 1,
    resourceType: "image",
    maxImageFileSize: 5000000, // 5MB
    folder: "profiles",
    cropping: true,
    croppingAspectRatio: 1,
    quality: "auto",
    format: "auto",
  }}
  onSuccess={(result: any) => {
    if (result.event === "success") {
      console.log("Upload successful:", result.info.secure_url);
    }
  }}
  onError={(error: any) => {
    console.error("Upload error:", error);
  }}
>
  {({ open }) => <button onClick={() => open()}>Upload Image</button>}
</CldUploadWidget>;
```

### **2. Composant CloudinaryUpload Réutilisable**

```typescript
import CloudinaryUpload from "@/components/CloudinaryUpload";

<CloudinaryUpload
  uploadPreset="MISSIONS"
  folder="missions"
  maxFiles={5}
  maxFileSize={10000000} // 10MB
  onUploadSuccess={(url, publicId) => {
    console.log("Image uploaded:", url);
    setImageUrl(url);
  }}
  onUploadError={(error) => {
    console.error("Upload failed:", error);
  }}
  showPreview={true}
  buttonText="Upload Mission Photos"
/>;
```

### **3. UserSettingsModal Implementation**

Le modal de paramètres utilisateur utilise `CldUploadWidget` pour l'upload de photos de profil :

```typescript
<CldUploadWidget
  uploadPreset="PROFILES"
  options={{
    maxFiles: 1,
    resourceType: "image",
    maxImageFileSize: 5000000, // 5MB
    folder: "profiles",
    cropping: true,
    croppingAspectRatio: 1,
    gravity: "center",
    quality: "auto",
    format: "auto",
  }}
  onUpload={() => setUploadingImage(true)}
  onSuccess={(result: any) => {
    if (result.event === "success") {
      handleImageUpload(result.info.secure_url);
      setUploadingImage(false);
    }
  }}
  onError={(error: any) => {
    setError("Failed to upload image. Please try again.");
    setUploadingImage(false);
  }}
>
  {({ open }) => (
    <button onClick={() => open()}>
      {uploadingImage ? "Uploading..." : "Upload New Photo"}
    </button>
  )}
</CldUploadWidget>
```

## 🎯 **Fonctionnalités Principales**

### **États de Chargement**

- `onUpload()` : Déclenché au début de l'upload
- `onSuccess()` : Déclenché quand l'upload réussit
- `onError()` : Déclenché en cas d'erreur

### **Options Avancées**

```typescript
options={{
  // Fichiers
  maxFiles: 1,
  maxImageFileSize: 5000000, // bytes
  clientAllowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],

  // Dossiers
  folder: "profiles",

  // Cropping
  cropping: true,
  croppingAspectRatio: 1, // carré
  gravity: "center",

  // Qualité
  quality: "auto",
  format: "auto",

  // Transformations
  eager: "w_400,h_400,c_fill",

  // Métadonnées
  context: {
    userId: "user123",
    type: "profile"
  }
}}
```

### **Gestion des Événements**

```typescript
// Événements disponibles
onUpload={() => {
  console.log('Upload started');
  setLoading(true);
}}

onSuccess={(result) => {
  console.log('Upload completed:', result.info);
  setImageUrl(result.info.secure_url);
  setLoading(false);
}}

onError={(error) => {
  console.error('Upload failed:', error);
  setError('Upload failed');
  setLoading(false);
}}

onClose={() => {
  console.log('Widget closed');
}}
```

## 🔐 **Sécurité**

### **Upload Presets Sécurisés**

Pour la production, utilisez des presets `signed` :

```typescript
// Preset signé (recommandé pour la production)
uploadPreset="PROFILES_SIGNED"

// Avec signature
options={{
  // ... autres options
  signatureEndpoint: "/api/cloudinary/sign"
}}
```

### **API Route pour Signature** (`app/api/cloudinary/sign/route.ts`)

```typescript
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: Request) {
  const { paramsToSign } = await request.json();

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return Response.json({ signature });
}
```

## 🖼️ **Affichage d'Images**

### **Composant CldImage Optimisé**

```typescript
import { CldImage } from "next-cloudinary";

<CldImage
  src="profiles/user123_avatar"
  width="400"
  height="400"
  alt="Profile picture"
  crop="fill"
  gravity="face"
  quality="auto"
  format="auto"
/>;
```

### **Transformations Courantes**

```typescript
// Avatar carré optimisé
<CldImage
  src={publicId}
  width="150"
  height="150"
  crop="fill"
  gravity="face"
  radius="max" // rond
  quality="auto"
  format="auto"
/>

// Image de mission responsive
<CldImage
  src={publicId}
  width="800"
  height="600"
  crop="fill"
  quality="auto"
  format="auto"
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

## 📊 **Avantages de Next-Cloudinary**

### **vs Upload Manuel**

- ✅ **Interface intégrée** : Widget natif Cloudinary
- ✅ **Optimisations automatiques** : Compression, format, qualité
- ✅ **Cropping intégré** : Interface utilisateur native
- ✅ **Gestion d'erreurs** : Callbacks standardisés
- ✅ **Performance** : CDN global automatique

### **vs ImageUpload Custom**

- ✅ **Moins de code** : Pas besoin de gérer l'upload manuellement
- ✅ **Plus robuste** : Gestion native des erreurs réseau
- ✅ **Features avancées** : Cropping, filtres, transformations
- ✅ **Maintenance** : Mis à jour par Cloudinary

## 🚀 **Migration du Code Existant**

### **Remplacer ImageUpload par CldUploadWidget**

**Avant (ImageUpload custom) :**

```typescript
<ImageUpload
  onUploadSuccess={handleImageUpload}
  uploadPreset="PROFILES"
  folder="profiles"
  currentImageUrl={imageUrl}
  cropAspectRatio={1}
  maxSizeInMB={5}
/>
```

**Après (next-cloudinary) :**

```typescript
<CldUploadWidget
  uploadPreset="PROFILES"
  options={{
    folder: "profiles",
    cropping: true,
    croppingAspectRatio: 1,
    maxImageFileSize: 5000000,
  }}
  onSuccess={(result) => {
    handleImageUpload(result.info.secure_url);
  }}
>
  {({ open }) => <button onClick={() => open()}>Upload Image</button>}
</CldUploadWidget>
```

## 🔧 **Configuration Next.js**

### **next.config.mjs**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
```

## 📝 **Exemples d'Utilisation**

### **Upload de Profil (UserSettingsModal)**

- ✅ **Implémenté** : Modal de paramètres utilisateur
- ✅ **Features** : Cropping carré, preview, états de chargement
- ✅ **Intégration** : Firebase Auth + Firestore

### **Upload de Mission (à implémenter)**

```typescript
<CldUploadWidget
  uploadPreset="MISSIONS"
  options={{
    folder: "missions",
    maxFiles: 5,
    maxImageFileSize: 10000000,
  }}
  onSuccess={(result) => {
    addMissionImage(result.info.secure_url);
  }}
>
  {({ open }) => <button onClick={() => open()}>Add Mission Photos</button>}
</CldUploadWidget>
```

## 🎉 **Résultat**

L'intégration de `next-cloudinary` offre :

- ✅ **Interface native** Cloudinary
- ✅ **Performance optimale** avec CDN
- ✅ **Transformations automatiques**
- ✅ **Code plus simple** et maintenable
- ✅ **Gestion d'erreurs** robuste
- ✅ **Cropping intégré** pour les avatars

**Le système d'upload est maintenant plus robuste et professionnel !** 📸
