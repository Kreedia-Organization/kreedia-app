# 🗺️ Configuration Google Maps - Kreedia

## 🔧 Variables d'Environnement Requises

Ajoutez cette variable à votre fichier `.env.local` :

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## 🚀 Obtenir une Clé API Google Maps

### 1. Créer un Projet Google Cloud

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Activer la facturation (nécessaire pour l'API Maps)

### 2. Activer les APIs Nécessaires

Activer ces APIs dans la section "APIs & Services" :

- **Maps JavaScript API**
- **Geocoding API**
- **Places API** (optionnel)

### 3. Créer une Clé API

1. Aller dans "Credentials"
2. Cliquer sur "Create Credentials" → "API Key"
3. Copier la clé générée

### 4. Sécuriser la Clé (Recommandé)

1. Cliquer sur la clé créée pour l'éditer
2. Dans "Application restrictions" → sélectionner "HTTP referrers"
3. Ajouter vos domaines :
   - `http://localhost:3000/*` (développement)
   - `https://yourdomain.com/*` (production)

## 🎯 Utilisation dans l'Application

La clé est utilisée dans :

- `/add-location` - Sélection d'emplacement sur carte
- Géocodage inverse (coordonnées → adresse)
- Affichage de cartes avec thème sombre

## 🔒 Sécurité

- ✅ Clé préfixée `NEXT_PUBLIC_` (exposée côté client)
- ✅ Restrictions de domaine configurées
- ✅ Limites d'utilisation API recommandées
- ✅ Surveillance des quotas Google Cloud

## 🎨 Personnalisation

La carte utilise un thème sombre personnalisé défini dans `add-location/page.tsx` :

```typescript
styles: [
  {
    elementType: "geometry",
    stylers: [{ color: "#1f2937" }],
  },
  // ... autres styles
];
```

## 💡 Mode Développement

Si aucune clé n'est fournie, l'application utilise une clé de démonstration `"demo_key"` qui affichera un message d'erreur mais permettra de tester l'interface.

## 📊 Quotas par Défaut

Google Maps offre **$200 de crédit gratuit** par mois, ce qui équivaut à :

- ~28,000 chargements de carte
- ~40,000 requêtes de géocodage

Pour une application de démonstration, c'est largement suffisant.
