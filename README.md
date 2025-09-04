# 🌱 Ecoflow - Clean the Environment, Earn Crypto

Une application complète Next.js 14 qui transforme les actions environnementales en récompenses crypto et NFTs.

![Ecoflow Logo](public/logo_green.png)

## ✨ Fonctionnalités

### 🔐 Authentification

- **Connexion Google OAuth** via NextAuth.js
- **Protection des routes** avec redirection automatique
- **Gestion de session** persistante

### 📊 Dashboard Complet

- **Balance crypto** avec progression hebdomadaire
- **Statistiques d'impact** (missions, zones nettoyées, photos)
- **Graphique de progression** des gains avec Recharts
- **Missions en cours** et disponibles
- **Actions rapides** pour navigation facile

### 🎯 Système de Missions

- **Filtrage avancé** par difficulté et localisation
- **Recherche** par nom, description ou lieu
- **Statuts multiples** : Disponible, En cours, Terminé
- **Récompenses crypto** et NFTs
- **Vue responsive** grille/liste

### 🏆 Collection NFT

- **Galerie responsive** avec vues grille et liste
- **Filtrage par rareté** (Commun à Légendaire)
- **Tri** par date, rareté ou nom
- **Statistiques détaillées** par type de rareté
- **Métadonnées complètes** (lieu, date, description)

### 👤 Profil Utilisateur

- **Statistiques d'impact** environnemental
- **Système d'achievements** avec progression
- **Historique d'activité** détaillé
- **Gestion de compte** et déconnexion

### 🎨 Design & UX

- **Responsive mobile-first** avec navigation adaptative
- **Mode sombre/clair** avec persistance localStorage
- **Animations fluides** et transitions
- **Charte graphique verte** (#22c55e) cohérente
- **Composants réutilisables** avec Tailwind CSS

### 🔔 Système de Notifications

- **Notifications temps réel** avec badge de compteur
- **Types multiples** : succès, info, warning, erreur
- **Actions contextuelles** (marquer lu, supprimer)
- **Timestamps** relatifs intelligents

## 🚀 Technologies

- **Framework** : Next.js 14 avec App Router
- **Styling** : Tailwind CSS + composants personnalisés
- **Authentification** : NextAuth.js + Google Provider
- **Charts** : Recharts pour visualisations
- **Icons** : Lucide React (1000+ icônes)
- **TypeScript** : Sécurité de type complète
- **Responsive** : Mobile-first design

## 📱 Navigation Responsive

### Mobile (< 768px)

- **Bottom navigation** avec 4 onglets principaux
- **Touch-friendly** boutons larges
- **Indicateur actif** visuel
- **Layout vertical** optimisé

### Desktop (≥ 768px)

- **Top navigation** horizontale
- **Sidebar** potentielle pour extensions
- **Layout en grille** adaptatif
- **Hover effects** riches

## 🎯 Architecture

```
app/
├── (dashboard)/              # Groupe de routes protégées
│   ├── layout.tsx           # Layout avec Header + NavBar
│   ├── dashboard/page.tsx   # Page principale
│   ├── missions/page.tsx    # Gestion des missions
│   ├── nft/page.tsx         # Collection NFT
│   └── profile/page.tsx     # Profil utilisateur
├── auth/signin/page.tsx     # Page de connexion
└── api/auth/               # Routes NextAuth.js

components/
├── ui/                     # Composants UI de base
│   ├── Button.tsx         # Bouton avec variants
│   ├── Card.tsx           # Composant carte
│   └── Badge.tsx          # Badges colorés
├── Header.tsx             # En-tête avec notifications
├── NavBar.tsx             # Navigation responsive
├── BalanceCard.tsx        # Affichage balance crypto
├── MissionCard.tsx        # Carte mission
├── NFTCard.tsx            # Carte NFT
├── WeeklyStats.tsx        # Statistiques hebdomadaires
├── ProgressChart.tsx      # Graphique progression
└── NotificationSystem.tsx # Système notifications

lib/
├── auth.ts               # Configuration NextAuth
├── data.ts               # Données mockées
├── providers.tsx         # Providers React
├── theme-provider.tsx    # Provider mode sombre
└── utils.ts              # Utilitaires
```

## 📊 Données & État

### Mock Data Incluses

- **12 missions** variées avec différents statuts
- **6 NFTs** avec raretés diverses
- **Statistiques utilisateur** réalistes
- **Notifications** d'exemple
- **Activité** récente simulée

### Gestion d'État

- **State local** pour UI (filtres, recherche)
- **NextAuth session** pour authentification
- **localStorage** pour préférences thème
- **Props drilling** minimal avec composition

## 🎨 Thème & Design

### Palette de Couleurs

- **Primary** : #22c55e (vert éco-friendly)
- **Backgrounds** : Blanc/Gris foncé adaptatifs
- **Text** : Contrastes optimaux pour accessibilité
- **Borders** : Subtils et cohérents

### Composants Stylisés

- **Cards** avec hover effects et ombres
- **Buttons** multiples variants (primary, outline, ghost)
- **Badges** colorés par contexte
- **Forms** avec focus states
- **Loading** spinners cohérents

## 🔧 Configuration Simplifiée

1. **Cloner le projet**
2. **Installer les dépendances** : `npm install`
3. **Créer .env.local** (voir ENV-SETUP.md)
4. **Lancer** : `npm run dev`
5. **Profiter** : Connexion automatique sans configuration ! 🎉

### 🎭 Mode Démo Frontend-Only

L'application fonctionne **sans backend** grâce à :

- **Authentification simulée** avec NextAuth + CredentialsProvider
- **Données mockées** réalistes pour la démonstration
- **Connexion automatique** en un clic
- **Déconnexion fonctionnelle** avec redirection

## 🌟 Points Forts

- ✅ **Code production-ready** avec TypeScript
- ✅ **Design cohérent** et professionnel
- ✅ **Performance optimisée** Next.js 14
- ✅ **Sécurité** authentication OAuth
- ✅ **Accessibilité** WCAG guidelines
- ✅ **Responsive** tous devices
- ✅ **Extensible** architecture modulaire
- ✅ **Maintenable** code organisé et documenté

## 🚀 Déploiement

Application prête pour déploiement sur :

- **Vercel** (recommandé)
- **Netlify**
- **AWS Amplify**
- **Railway**

Toutes les dépendances sont compatibles serverless.

---

_Construit avec ❤️ et 🌱 pour un avenir plus vert_
