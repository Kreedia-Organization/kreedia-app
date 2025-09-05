# 🔧 Configuration Environnement - Kreedia

## Variables d'Environnement Requises

Créez un fichier `.env.local` à la racine du projet avec :

```env
# NextAuth Configuration pour Demo
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=demo-secret-key-for-Kreedia-frontend-only

# Variables factices (non utilisées mais requises par NextAuth)
GOOGLE_CLIENT_ID=demo
GOOGLE_CLIENT_SECRET=demo
```

## 🚀 Lancement

1. **Installer les dépendances :**

   ```bash
   npm install
   ```

2. **Créer .env.local :**

   ```bash
   cp ENV-SETUP.md .env.local
   # Puis copier les variables ci-dessus dans le fichier
   ```

3. **Lancer en développement :**

   ```bash
   npm run dev
   ```

4. **Accéder à l'application :**
   - Ouvrir http://localhost:3000
   - Cliquer sur "Enter Kreedia Dashboard"
   - Connexion automatique simulée ! 🎉

## 🎯 Mode Demo

L'application fonctionne entièrement en mode frontend-only :

- ✅ Connexion automatique simulée
- ✅ Données mockées réalistes
- ✅ Navigation complète
- ✅ Thème sombre/clair
- ✅ Notifications
- ✅ Graphiques et statistiques

## 🔧 Personnalisation

Pour changer l'utilisateur fictif, modifier `lib/auth.ts` :

```typescript
async authorize() {
  return {
    id: '1',
    name: 'Votre Nom', // ← Modifier ici
    email: 'votre@email.com', // ← Modifier ici
    image: '/icon.png',
  };
},
```
