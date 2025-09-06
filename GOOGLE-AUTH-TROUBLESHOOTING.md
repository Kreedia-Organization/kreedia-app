# Guide de Dépannage Google Auth

## Problème : "Google sign-in was cancelled or blocked"

### Causes Possibles

1. **Configuration Google Console**
2. **Paramètres du navigateur**
3. **Problèmes de CORS**
4. **Client ID incorrect**

### Solutions

#### 1. Vérifier la Configuration Google Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Allez dans "APIs & Services" > "Credentials"
4. Vérifiez que votre Client ID est correct
5. Dans "Authorized JavaScript origins", ajoutez :
   - `http://localhost:3000` (pour le développement)
   - `https://votre-domaine.com` (pour la production)

#### 2. Vérifier le Client ID dans l'Application

Vérifiez que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre-client-id-google
```

#### 3. Problèmes de Navigateur

- **Désactiver les bloqueurs de popup** : Assurez-vous que les popups ne sont pas bloqués
- **Cookies tiers** : Autorisez les cookies tiers pour Google
- **Mode incognito** : Testez en mode incognito pour éviter les conflits de cache

#### 4. Vérifier la Console du Navigateur

Ouvrez la console du navigateur (F12) et vérifiez :

- Si Google Identity Services se charge correctement
- S'il y a des erreurs CORS
- Si le Client ID est correct

#### 5. Test de l'Authentification

1. Ouvrez la console du navigateur
2. Tapez : `window.google.accounts.id.initialize`
3. Si cela retourne `undefined`, Google Identity Services n'est pas chargé

#### 6. Solution Alternative : Bouton Visible

Si le problème persiste, vous pouvez utiliser un bouton Google visible au lieu d'un bouton caché :

```tsx
// Dans votre composant de connexion
<div id="google-signin-button"></div>;

// Dans useEffect
useEffect(() => {
  if (window.google) {
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "outline",
        size: "large",
        type: "standard",
        shape: "rectangular",
        text: "signin_with",
        width: 200,
      }
    );
  }
}, []);
```

### Messages d'Erreur Courants

- **"Google sign-in was cancelled or blocked"** : Popup bloqué ou annulé
- **"Google Identity Services not loaded yet"** : Script Google pas encore chargé
- **"Failed to decode Google token"** : Problème avec le JWT token
- **"Authentication failed - invalid response format"** : Problème avec l'API Laravel

### Debug

Ajoutez ces logs dans votre code pour débugger :

```typescript
console.log("Google loaded:", !!window.google);
console.log("Client ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
console.log("Google accounts:", !!window.google?.accounts?.id);
```

### Test Rapide

1. Ouvrez `http://localhost:3000/auth/signin`
2. Ouvrez la console du navigateur
3. Cliquez sur le bouton de connexion
4. Vérifiez les messages dans la console
5. Si une popup Google apparaît, le problème est résolu

### Configuration Recommandée

```typescript
// Configuration optimale pour Google Identity Services
window.google.accounts.id.initialize({
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  callback: handleGoogleResponse,
  auto_select: false,
  cancel_on_tap_outside: false,
  use_fedcm_for_prompt: false,
});
```

### Support

Si le problème persiste :

1. Vérifiez les logs de la console
2. Testez sur différents navigateurs
3. Vérifiez la configuration Google Console
4. Contactez le support technique
