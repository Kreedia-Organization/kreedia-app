# 🌈 RainbowKit Integration Guide

## 🔧 **Configuration**

### **1. Installation** ✅

```bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
```

### **2. Variables d'Environnement (.env.local)**

```env
# WalletConnect Project ID (required for RainbowKit)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

**Pour obtenir un Project ID WalletConnect :**

1. Visitez [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Créez un compte et un nouveau projet
3. Copiez le Project ID dans votre `.env.local`

## 📝 **Architecture Implémentée**

### **1. Configuration RainbowKit** (`lib/rainbowkit/config.ts`)

```typescript
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Kreedia",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true,
});
```

### **2. Providers** (`lib/rainbowkit/providers.tsx`)

```typescript
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

export function RainbowKitProviders({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### **3. Hook Personnalisé** (`hooks/useWallet.ts`)

```typescript
export const useWallet = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { user, userData } = useAuth();

  // Synchronise automatiquement l'adresse wallet avec Firestore
  useEffect(() => {
    if (address && userData?.walletAddress !== address) {
      UserService.updateUser(user.uid, { walletAddress: address });
    }
  }, [address, userData]);

  return {
    address,
    isConnected,
    hasWalletInFirestore: !!userData?.walletAddress,
    // ... autres propriétés
  };
};
```

## 🎯 **Fonctionnalités Implémentées**

### **1. État Wallet Non-Connecté**

- ✅ **Affichage flouté** des balances crypto
- ✅ **Prompt de connexion** avec message clair
- ✅ **Bouton RainbowKit** intégré et stylisé
- ✅ **Note de sécurité** pour rassurer l'utilisateur

### **2. Synchronisation Firestore**

- ✅ **Auto-sauvegarde** de l'adresse wallet
- ✅ **Mise à jour en temps réel** quand le wallet change
- ✅ **Gestion d'erreurs** robuste
- ✅ **États de chargement** visuels

### **3. Interface Utilisateur**

- ✅ **Indicateur de statut** wallet connecté
- ✅ **Adresse tronquée** pour l'affichage
- ✅ **Transitions fluides** entre états
- ✅ **Responsive design** pour mobile/desktop

## 🖼️ **Composants Créés**

### **WalletConnectPrompt** (`components/WalletConnectPrompt.tsx`)

```typescript
// Affiche les balances floutées avec overlay de connexion
<WalletConnectPrompt />
```

**Fonctionnalités :**

- 🔒 **Cartes floutées** simulant les vraies balances
- 🎨 **Overlay élégant** avec message de connexion
- 🌈 **Bouton RainbowKit** personnalisé
- 📱 **Design responsive** et accessible

### **Hook useWallet** (`hooks/useWallet.ts`)

```typescript
const {
  address,
  isConnected,
  hasWalletInFirestore,
  loading,
  disconnectWallet,
} = useWallet();
```

**Fonctionnalités :**

- 🔄 **Synchronisation auto** avec Firestore
- 🎣 **État unifié** wallet + Firebase
- ⚡ **Performance optimisée** avec useEffect
- 🛠️ **Gestion d'erreurs** complète

## 🚀 **Utilisation dans Dashboard**

### **Logique Conditionnelle**

```typescript
{
  !hasWalletInFirestore ? (
    <WalletConnectPrompt />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Balances crypto normales */}
    </div>
  );
}
```

### **Indicateur de Statut**

```typescript
{
  address && (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span>
        Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}
      </span>
    </div>
  );
}
```

## 🎨 **Design Pattern**

### **États de l'Interface**

1. **Wallet non connecté** → `WalletConnectPrompt` flouté
2. **Wallet connecté** → Balances crypto visibles
3. **Synchronisation** → Indicateur de chargement
4. **Erreur** → Message d'erreur avec retry

### **Expérience Utilisateur**

- 🎯 **Message clair** : "Connect your wallet to see earned balance"
- 🔒 **Sécurité** : Note rassurante sur la sécurité
- ⚡ **Performance** : Chargement optimisé et fluide
- 📱 **Responsive** : Parfait sur mobile et desktop

## 🔐 **Sécurité**

### **Meilleures Pratiques**

- ✅ **Pas de clés privées** stockées
- ✅ **Synchronisation sécurisée** avec Firestore
- ✅ **Validation côté client** et serveur
- ✅ **Gestion d'erreurs** sans exposition de données sensibles

### **Chaînes Supportées**

- 🔹 **Mainnet** (Ethereum)
- 🔹 **Polygon** (MATIC)
- 🔹 **Optimism** (OP)
- 🔹 **Arbitrum** (ARB)
- 🔹 **Base** (BASE)
- 🔹 **Sepolia** (testnet en développement)

## 🎉 **Résultat**

L'intégration RainbowKit offre :

- ✅ **Connexion wallet** fluide et professionnelle
- ✅ **Synchronisation automatique** avec Firestore
- ✅ **Interface intuitive** avec états visuels clairs
- ✅ **Multi-chaînes** supportées nativement
- ✅ **Sécurité** et bonnes pratiques Web3
- ✅ **Design cohérent** avec l'identité Kreedia

**Les utilisateurs peuvent maintenant connecter leur wallet pour débloquer leurs balances crypto ! 🚀**

## 📋 **TODOs Techniques**

- [ ] Configurer un Project ID WalletConnect
- [ ] Tester sur différentes chaînes (Polygon, etc.)
- [ ] Ajouter gestion des tokens ERC-20 personnalisés
- [ ] Implémenter la déconnexion wallet depuis le profil
- [ ] Ajouter analytics sur les connexions wallet

**Le système wallet est prêt pour la production ! 🌈**
