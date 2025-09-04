# 🔐 Guide d'Authentification Simplifiée - Ecoflow

## 🎯 Objectif

Ce guide explique comment utiliser le système d'authentification **frontend-only** pour Ecoflow, parfait pour les démonstrations et le développement sans backend.

## 🚀 Options d'Authentification

### Option 1 : NextAuth avec Credentials Provider (Recommandée)

- ✅ Utilise NextAuth.js mais sans vrai backend
- ✅ Compatible avec tous les composants existants
- ✅ Simulation réaliste d'une connexion

### Option 2 : Système d'Authentification Factice Pure

- ✅ Système localStorage simple
- ✅ Plus léger, moins de dépendances
- ✅ Contrôle total sur le flux

## 📋 Configuration Actuelle

### Fichiers Modifiés pour l'Auth Factice

1. **`lib/auth.ts`** - Configuration NextAuth avec CredentialsProvider
2. **`lib/fake-auth.ts`** - Système d'auth localStorage
3. **`lib/use-fake-auth.ts`** - Hook React pour l'auth factice
4. **`app/auth/signin/page.tsx`** - Page de connexion NextAuth modifiée
5. **`app/auth/signin/page-simple.tsx`** - Page de connexion pure

### Utilisation Option 1 (NextAuth - Actuelle)

La page de connexion actuelle (`app/auth/signin/page.tsx`) utilise NextAuth avec un CredentialsProvider qui simule une connexion automatique.

**Flux :**

1. L'utilisateur clique sur "Enter Ecoflow Dashboard"
2. NextAuth simule une connexion avec des données factices
3. Redirection automatique vers `/dashboard`

### Utilisation Option 2 (Auth Factice Pure)

Pour utiliser le système d'auth factice pur :

1. **Remplacer la page de connexion :**

   ```bash
   mv app/auth/signin/page.tsx app/auth/signin/page-nextauth.tsx
   mv app/auth/signin/page-simple.tsx app/auth/signin/page.tsx
   ```

2. **Remplacer le layout dashboard :**

   ```bash
   mv app/(dashboard)/layout.tsx app/(dashboard)/layout-nextauth.tsx
   mv app/(dashboard)/layout-simple.tsx app/(dashboard)/layout.tsx
   ```

3. **Remplacer le Header :**

   ```bash
   mv components/Header.tsx components/Header-nextauth.tsx
   mv components/Header-simple.tsx components/Header.tsx
   ```

4. **Optionnel : Remplacer la page profile :**
   ```bash
   mv app/(dashboard)/profile/page.tsx app/(dashboard)/profile/page-nextauth.tsx
   mv app/(dashboard)/profile/page-simple.tsx app/(dashboard)/profile/page.tsx
   ```

## 🔧 Fonctionnement

### Données Utilisateur Factices

```typescript
const FAKE_USER = {
  id: "1",
  name: "Eco Warrior",
  email: "ecowarrior@ecoflow.app",
  image: "/icon.png",
};
```

### Délais de Simulation

- **Connexion :** 1 seconde (simule un appel API)
- **Déconnexion :** 0.5 seconde

### Stockage

- **NextAuth :** Utilise les sessions internes NextAuth
- **Auth Factice :** Utilise `localStorage` avec la clé `ecoflow_auth`

## 🎮 Utilisation

### Connexion

1. Aller sur `/auth/signin`
2. Cliquer sur le bouton de connexion
3. Attendre la simulation de connexion (spinner)
4. Redirection automatique vers `/dashboard`

### Déconnexion

1. Aller sur `/profile`
2. Cliquer sur "Sign Out"
3. Redirection vers `/auth/signin`

## 🛠 Développement

### Ajouter des Utilisateurs Factices

Modifier `lib/fake-auth.ts` :

```typescript
const FAKE_USERS = [
  {
    id: "1",
    name: "Eco Warrior",
    email: "ecowarrior@ecoflow.app",
    image: "/icon.png",
  },
  {
    id: "2",
    name: "Green Guardian",
    email: "green@ecoflow.app",
    image: "/icon.png",
  },
];
```

### Personnaliser les Délais

```typescript
// Dans fakeAuth.signIn()
setTimeout(() => {
  // Changer de 1000ms à la valeur désirée
  resolve({ success: true, user: FAKE_USER });
}, 1000);
```

## 🎯 Avantages

### Option 1 (NextAuth)

- ✅ Réutilise tous les composants existants
- ✅ Pas de modification majeure du code
- ✅ Facile à migrer vers une vraie auth plus tard

### Option 2 (Auth Factice)

- ✅ Plus simple et direct
- ✅ Moins de dépendances
- ✅ Contrôle total sur le comportement

## 📝 Variables d'Environnement

### Pour NextAuth (Option 1)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=fake-secret-for-demo
```

### Pour Auth Factice (Option 2)

Aucune variable requise ! 🎉

## 🚀 Déploiement

Les deux options fonctionnent parfaitement en production pour une démonstration frontend-only.

### Vercel/Netlify

- Option 1 : Définir `NEXTAUTH_SECRET` dans les variables d'environnement
- Option 2 : Aucune configuration requise

## 🔄 Migration vers une Vraie Auth

### Depuis NextAuth Factice

1. Remplacer `CredentialsProvider` par `GoogleProvider`
2. Ajouter les vraies clés Google OAuth
3. Configurer une base de données si nécessaire

### Depuis Auth Factice

1. Installer NextAuth : `npm install next-auth`
2. Remplacer `useFakeAuth` par `useSession`
3. Configurer les providers OAuth

---

🎭 **Mode Démo Activé** - Profitez de votre expérience Ecoflow sans contraintes techniques !
