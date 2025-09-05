# Configuration Cloudinary pour Kreedia

## 📋 **Variables d'environnement à ajouter**

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCPIk96kMxWnoWR6XRmxKqe5AUTP8I8oSQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kreedia.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kreedia
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kreedia.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1010721513871
NEXT_PUBLIC_FIREBASE_APP_ID=1:1010721513871:web:88f3bc1853d5b4a2fbebfa
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# NextAuth (if still needed)
NEXTAUTH_SECRET=codingwithabbas

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBfin1Xubgctvjl_LYW_2HdIPdPJQXttTg

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🛠️ **Configuration Cloudinary Dashboard**

### 1. **Upload Presets** (obligatoire)

Dans votre dashboard Cloudinary, créez ces upload presets :

- **missions_preset** : Pour les images de missions

  - Delivery type : Upload
  - Mode : Unsigned
  - Folder : `missions`
  - Transformations : Optimisation automatique

- **locations_preset** : Pour les images d'emplacements

  - Delivery type : Upload
  - Mode : Unsigned
  - Folder : `locations`
  - Transformations : Optimisation automatique

- **profiles_preset** : Pour les photos de profil
  - Delivery type : Upload
  - Mode : Unsigned
  - Folder : `profiles`
  - Transformations : Redimensionnement automatique

### 2. **Structure des dossiers**

```
cloudinary/
├── missions/       # Images des missions
├── locations/      # Images des emplacements
└── profiles/       # Photos de profil
```

## 🔧 **Fonctionnalités intégrées**

### ✅ **Upload d'images**

- ✅ Drag & drop
- ✅ Validation des types de fichiers (JPG, PNG, WebP)
- ✅ Limitation de taille (10MB max)
- ✅ Prévisualisation en temps réel
- ✅ Optimisation automatique des images
- ✅ Gestion des erreurs

### ✅ **Optimisation automatique**

- ✅ Redimensionnement intelligent
- ✅ Compression avec qualité optimale
- ✅ Format WebP automatique
- ✅ Responsive images

### ✅ **Intégration complète**

- ✅ Formulaire de création de missions
- ✅ Page d'ajout d'emplacements
- ✅ Service de suppression d'images
- ✅ Gestion des métadonnées (tags, contexte)

## 📱 **Utilisation**

### **Créer une mission**

1. Allez sur `/missions/create`
2. Uploadez une image via le composant drag & drop
3. L'image est automatiquement optimisée et stockée sur Cloudinary
4. L'URL est sauvegardée dans Firestore

### **Ajouter un emplacement**

1. Allez sur `/add-location`
2. Uploadez une photo de l'emplacement
3. L'image est optimisée et le formulaire est soumis

## 🚀 **API Routes disponibles**

### `DELETE /api/cloudinary/delete`

Supprime une image de Cloudinary (sécurisé côté serveur)

```javascript
// Utilisation
await fetch("/api/cloudinary/delete", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ publicId: "image_public_id" }),
});
```

## 🎨 **Optimisation des images**

Le système génère automatiquement plusieurs variants :

- **Thumbnail** : 150x150px
- **Small** : 400x300px
- **Medium** : 800x600px (défaut)
- **Large** : 1200x900px
- **Original** : Taille originale

## 🔒 **Sécurité**

- ✅ Upload presets non signés pour plus de sécurité
- ✅ Validation côté client et serveur
- ✅ API secret protégé côté serveur uniquement
- ✅ Limitation des types de fichiers
- ✅ Limitation de la taille des fichiers

## 🐛 **Dépannage**

### **Problème : Upload failed**

- Vérifiez que les upload presets sont bien configurés
- Vérifiez les variables d'environnement
- Vérifiez que le cloud_name est correct

### **Problème : Images non affichées**

- Vérifiez l'URL générée
- Vérifiez les permissions Cloudinary
- Testez l'URL directement dans le navigateur

### **Problème : CORS errors**

- Configurez les domaines autorisés dans Cloudinary
- Vérifiez les settings de sécurité

## 📞 **Support**

Si vous rencontrez des problèmes :

1. Vérifiez les logs de la console
2. Testez l'upload directement via l'API Cloudinary
3. Vérifiez la configuration des upload presets
