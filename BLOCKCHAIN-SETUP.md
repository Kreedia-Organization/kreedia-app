# Configuration Blockchain - Kreedia Contract

## 📋 Prérequis

1. **Ether.js** déjà installé ✅
2. **Smart Contract** déployé sur Sepolia testnet ✅
3. **ABI** du contrat disponible ✅

## 🔧 Configuration Requise

### 1. Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec :

```bash
# Configuration API
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Configuration Blockchain - Sepolia Testnet
NEXT_PUBLIC_KREEDIA_CONTRACT_ADDRESS=0xYOUR_KREEDIA_CONTRACT_ADDRESS_HERE
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Adresses des tokens sur Sepolia Testnet
NEXT_PUBLIC_USDC_ADDRESS=0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8
NEXT_PUBLIC_USDT_ADDRESS=0x7169D38820dfd117C3FA1f22a697dBA58d90BA06
NEXT_PUBLIC_DAI_ADDRESS=0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357
```

### 2. Adresses des Tokens Sepolia

Les adresses par défaut sont pour Sepolia testnet :

- **USDC**: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
- **USDT**: `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`
- **DAI**: `0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`

### 3. RPC Provider

Vous devez configurer un RPC provider pour Sepolia :

- **Infura**: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
- **Alchemy**: `https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY`
- **Public RPC**: `https://rpc.sepolia.org`

## 🚀 Fonctionnalités Implémentées

### 1. Service Contract (`lib/blockchain/services/contract.ts`)

- ✅ **getWorkerTotalEarned()** - Récupère les gains totaux d'un worker (USDC, USDT, DAI)
- ✅ **getDynamicWorkerEarnings()** - Récupère les gains pour tous les tokens acceptés dynamiquement
- ✅ **getAcceptedTokens()** - Récupère la liste des tokens acceptés par le contrat
- ✅ **getUserNFTCount()** - Récupère le nombre de NFTs d'un utilisateur
- ✅ **getMissionDetails()** - Récupère les détails d'une mission
- ✅ **getMissionProgress()** - Récupère le progrès d'une mission
- ✅ **hasUserMissionNFT()** - Vérifie si un utilisateur a un NFT pour une mission
- ✅ **getNFTDetails()** - Récupère les détails d'un NFT
- ✅ **getTotalSupply()** - Récupère le nombre total de NFTs mintés
- ✅ **isTokenAccepted()** - Vérifie si un token est accepté

### 2. Hooks Personnalisés

#### `useBlockchainData()`

Hook principal pour toutes les données blockchain :

```typescript
const { workerEarnings, nftData, loading, error, refreshData } =
  useBlockchainData();
```

#### `useWorkerEarnings()`

Hook spécialisé pour les gains :

```typescript
const { earnings, loading, error, refresh } = useWorkerEarnings();
```

#### `useUserNFTs()`

Hook spécialisé pour les NFTs :

```typescript
const { totalNFTs, loading, error, refresh } = useUserNFTs();
```

#### `useDynamicWorkerEarnings()`

Hook spécialisé pour les gains dynamiques (tous les tokens acceptés) :

```typescript
const { tokens, totalEarnings, loading, error, refresh } =
  useDynamicWorkerEarnings();
```

### 3. Intégration Dashboard

Le hook `useWalletBalances` a été mis à jour pour utiliser les données du smart contract :

- **USDC Balance**: Récupéré via `workerTotalEarned()`
- **USDT Balance**: Récupéré via `workerTotalEarned()`
- **DAI Balance**: Récupéré via `workerTotalEarned()`
- **NFT Count**: Récupéré via `balanceOf()`

## 🔄 Flux de Données

1. **Connexion Wallet** → `useWallet()`
2. **Récupération Adresse** → `useBlockchainData()`
3. **Appel Smart Contract** → `contractService.getWorkerTotalEarned()`
4. **Mise à Jour Dashboard** → `useWalletBalances()`

## 🛠️ Utilisation

### Dans le Dashboard

```typescript
import { useWalletBalances } from "@/hooks/useWalletBalances";

const Dashboard = () => {
  const { USDC, USDT, DAI, NFT, loading, error } = useWalletBalances();

  return (
    <div>
      <p>USDC: {USDC?.balance || "0"}</p>
      <p>USDT: {USDT?.balance || "0"}</p>
      <p>DAI: {DAI?.balance || "0"}</p>
      <p>NFTs: {NFT?.count || 0}</p>
    </div>
  );
};
```

### Pour une Mission Spécifique

```typescript
import { contractService } from "@/lib/blockchain/services/contract";

const MissionDetails = ({ missionId }: { missionId: string }) => {
  const [mission, setMission] = useState(null);

  useEffect(() => {
    const loadMission = async () => {
      const details = await contractService.getMissionDetails(missionId);
      setMission(details);
    };
    loadMission();
  }, [missionId]);

  return (
    <div>
      {mission && (
        <div>
          <p>Token: {mission.token}</p>
          <p>Amount: {mission.amount}</p>
          <p>Completed: {mission.completed ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};
```

## ⚠️ Notes Importantes

1. **Adresse du Contrat**: Remplacez `0xYOUR_KREEDIA_CONTRACT_ADDRESS_HERE` par l'adresse réelle de votre contrat déployé
2. **RPC Provider**: Configurez un provider RPC fiable (Infura/Alchemy recommandé)
3. **Gestion d'Erreurs**: Tous les appels blockchain incluent une gestion d'erreurs
4. **Performance**: Les données sont mises en cache et rechargées automatiquement
5. **Testnet**: Assurez-vous d'utiliser Sepolia testnet pour les tests

## 🔍 Debugging

Pour déboguer les appels blockchain :

1. Ouvrez la console du navigateur
2. Les logs montrent les données récupérées
3. Vérifiez que l'adresse du contrat est correcte
4. Vérifiez que le RPC provider fonctionne

## 📝 Prochaines Étapes

1. **Configurer les variables d'environnement**
2. **Déployer le contrat sur Sepolia**
3. **Tester les appels blockchain**
4. **Intégrer dans l'interface utilisateur**
5. **Ajouter la gestion des transactions** (mint, transfer, etc.)
