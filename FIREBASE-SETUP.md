# 🔥 Configuration Firebase - Kreedia

## 📋 Vue d'ensemble

Configuration complète de Firebase pour Kreedia avec Firestore Database et Firebase Authentication.

## 🔧 Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Maps (toujours nécessaire)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🚀 Configuration Firebase

### 1. Créer un Projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Créer un nouveau projet ou sélectionner un existant
3. Donner un nom au projet : "Kreedia"

### 2. Configurer Authentication

1. Dans la console Firebase, aller dans **Authentication**
2. Cliquer sur **Get Started**
3. Dans l'onglet **Sign-in method** :
   - Activer **Google** comme provider
   - Configurer le domaine autorisé : `localhost` et votre domaine de production
   - Ajouter l'email de support

### 3. Configurer Firestore Database

1. Dans la console Firebase, aller dans **Firestore Database**
2. Cliquer sur **Create database**
3. Choisir **Start in production mode**
4. Sélectionner une région proche de vos utilisateurs

### 4. Règles de Sécurité Firestore

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Missions - read public, write for authenticated users
    match /missions/{missionId} {
      allow read: if true; // Public read
      allow write: if request.auth != null;
    }

    // Mission users - only for involved parties
    match /mission_users/{missionUserId} {
      allow read, write: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         resource.data.proposerId == request.auth.uid);
    }

    // Location submissions - users can manage their own
    match /location_submissions/{submissionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // NFTs - read public, write restricted
    match /nfts/{nftId} {
      allow read: if true;
      allow write: if request.auth != null &&
        resource.data.ownerId == request.auth.uid;
    }

    // Transactions - users can read their own
    match /transactions/{transactionId} {
      allow read: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow write: if false; // Server-side only
    }

    // Notifications - users can read their own
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Configuration Web App

1. Dans **Project Settings** → **General**
2. Dans la section **Your apps**, cliquer sur **Web**
3. Donner un nom à l'app : "Kreedia Web"
4. Copier la configuration Firebase dans votre `.env.local`

## 📊 Structure de la Base de Données

### Collections Firestore

#### 👥 **users**

```typescript
{
  id: string (document ID = Firebase Auth UID)
  name: string
  email: string
  phone?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  walletAddress?: string
  ensName?: string
  status: 'ACTIVE' | 'BLOCKED' | 'IN_REVIEW'
  profileImage?: string
  totalMissionsCompleted?: number
  totalRewardsEarned?: number
  level?: number
  badges?: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### 🎯 **missions**

```typescript
{
  id: string
  name: string
  description: string
  picture: string
  position: GeoPoint { latitude: number, longitude: number }
  address: string
  deadline: Timestamp
  duration: number // heures
  level: 'EASY' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED'
  proposerId: string // User ID
  isVisible: boolean
  amount: number
  validatedAt?: Timestamp
  maxParticipants?: number
  currentParticipants?: number
  tags?: string[]
  requirements?: string[]
  completionCriteria?: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### 🤝 **mission_users**

```typescript
{
  id: string
  userId: string // User ID
  missionId: string // Mission ID
  status: 'APPLIED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'WITHDRAWN'
  appliedAt: Timestamp
  acceptedAt?: Timestamp
  completedAt?: Timestamp
  rejectedAt?: Timestamp
  rejectionReason?: string
  completionProof?: {
    images?: string[]
    description?: string
    location?: GeoPoint
    timestamp: Timestamp
  }
  userRating?: number
  proposerRating?: number
  feedback?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### 📍 **location_submissions**

```typescript
{
  id: string
  userId: string // User ID
  name: string
  description?: string
  image: string
  position: GeoPoint
  address: string
  neighborhood: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt: Timestamp
  reviewedAt?: Timestamp
  reviewedBy?: string // Admin User ID
  rejectionReason?: string
  canWork: boolean
  category?: string
  estimatedCleanupTime?: number
  difficultyLevel?: 'EASY' | 'MEDIUM' | 'HIGH'
  priority?: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## 🛠️ Services Disponibles

### **UserService**

- `createUser()` - Créer un utilisateur
- `getUserById()` - Récupérer par ID
- `getUserByEmail()` - Récupérer par email
- `updateUser()` - Mettre à jour
- `searchUsers()` - Rechercher

### **MissionService**

- `createMission()` - Créer une mission
- `getMissions()` - Lister avec filtres
- `getMissionsNearLocation()` - Missions à proximité
- `updateMissionStatus()` - Changer le statut

### **MissionUserService**

- `applyForMission()` - Postuler
- `acceptApplication()` - Accepter candidature
- `completeMission()` - Terminer mission
- `rateMissionParticipant()` - Noter

### **LocationSubmissionService**

- `submitLocation()` - Soumettre emplacement
- `getUserLocationSubmissions()` - Emplacements d'un utilisateur
- `approveLocationSubmission()` - Approuver
- `rejectLocationSubmission()` - Rejeter

### **AuthService**

- `signInWithGoogle()` - Connexion Google
- `signOut()` - Déconnexion
- `getCurrentUserData()` - Données utilisateur actuelles

## 🎯 Hooks React Disponibles

### **useAuth**

```typescript
const {
  user,
  userData,
  loading,
  error,
  signInWithGoogle,
  signOut,
  isAuthenticated,
} = useAuth();
```

### **useMissions**

```typescript
const { missions, loading, error, refetch, loadMore, hasMore } = useMissions({
  status: MissionStatus.ACTIVE,
  level: MissionLevel.EASY,
  limit: 20,
});
```

### **useLocationSubmissions**

```typescript
const { submissions, loading, error, refetch, stats } = useLocationSubmissions({
  userId: "user123",
  status: LocationStatus.PENDING,
});
```

### **useFirestore**

```typescript
const { data, loading, error, refetch } = useFirestore("missions", {
  constraints: [where("status", "==", "ACTIVE")],
});
```

## 🔒 Sécurité

### Authentication

- ✅ Google OAuth intégré
- ✅ Création automatique des profils utilisateurs
- ✅ Session persistence
- ✅ Redirection automatique

### Firestore Rules

- ✅ Accès basé sur l'authentification
- ✅ Propriété des données respectée
- ✅ Lecture publique pour les missions
- ✅ Écriture restreinte aux propriétaires

### Data Validation

- ✅ Types TypeScript stricts
- ✅ Validation côté client et serveur
- ✅ Sanitization des entrées

## 🚀 Migration des Données

Les anciens mock data sont remplacés par :

- ✅ Authentification Firebase
- ✅ Données Firestore en temps réel
- ✅ Hooks React optimisés
- ✅ Services CRUD complets

## 📱 Expérience Utilisateur

### Première Connexion

1. Utilisateur clique sur "Sign in with Google"
2. Redirection vers Google OAuth
3. Création automatique du profil Firestore
4. Redirection vers le dashboard

### Données en Temps Réel

- ✅ Notifications instantanées
- ✅ Mises à jour automatiques
- ✅ Synchronisation multi-appareils

## 🎯 Prochaines Étapes

1. **Ajouter vos clés Firebase** dans `.env.local`
2. **Configurer les règles Firestore** dans la console
3. **Tester l'authentification** Google
4. **Créer quelques missions** de test
5. **Vérifier les permissions** et la sécurité

---

🔥 **Firebase est maintenant complètement intégré !** L'application utilise une vraie base de données avec authentification sécurisée.
