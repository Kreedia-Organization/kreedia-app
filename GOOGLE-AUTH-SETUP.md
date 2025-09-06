# Configuration de l'Authentification Google

## 1. Créer un Projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Identity Services

## 2. Configurer OAuth 2.0

1. Dans la console Google Cloud, allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configurez l'écran de consentement OAuth si ce n'est pas déjà fait
4. Créez un client OAuth 2.0 pour "Web application"

## 3. Configurer les URIs de Redirection

Ajoutez ces URIs autorisés :

- `http://localhost:3000` (pour le développement)
- `https://votre-domaine.com` (pour la production)

## 4. Variables d'Environnement

Ajoutez dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre-client-id-google
```

## 5. Tester l'Authentification

1. Démarrez le serveur : `npm run dev`
2. Allez sur `http://localhost:3000/auth/signin`
3. Cliquez sur "Continue with Google"
4. Sélectionnez votre compte Google
5. Vous devriez être redirigé vers le dashboard

## 6. Dépannage

### Erreur "Popup blocked"

- Autorisez les popups pour localhost:3000
- Essayez en mode incognito

### Erreur "Invalid client"

- Vérifiez que le CLIENT_ID est correct
- Vérifiez que l'URI de redirection est configuré

### Erreur "Access denied"

- Vérifiez l'écran de consentement OAuth
- Assurez-vous que l'API est activée

## 7. Production

Pour la production :

1. Ajoutez votre domaine dans les URIs autorisés
2. Configurez l'écran de consentement OAuth
3. Testez avec votre domaine de production
