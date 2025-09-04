# Ecoflow Setup Guide

## 🚀 Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory with:

   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Google OAuth Setup**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🎨 Features

- ✅ **Authentication**: Google OAuth with NextAuth.js
- ✅ **Dashboard**: User stats, balance, and mission overview
- ✅ **Missions**: Browse, start, and track environmental missions
- ✅ **NFT Collection**: View and manage earned environmental NFTs
- ✅ **Profile**: User profile with achievements and activity
- ✅ **Responsive Design**: Mobile-first with Tailwind CSS
- ✅ **Dark Mode**: Toggle between light and dark themes
- ✅ **Notifications**: Real-time notification system
- ✅ **Charts**: Progress tracking with Recharts
- ✅ **Modern UI**: Clean, minimalist design

## 🏗️ Project Structure

```
app/
  ├── (dashboard)/           # Protected route group
  │   ├── dashboard/         # Main dashboard
  │   ├── missions/          # Mission management
  │   ├── nft/              # NFT collection
  │   └── profile/          # User profile
  ├── auth/signin/          # Authentication page
  ├── api/auth/             # NextAuth.js API routes
  └── layout.tsx            # Root layout

components/
  ├── ui/                   # Reusable UI components
  ├── Header.tsx            # App header with navigation
  ├── NavBar.tsx            # Responsive navigation
  ├── BalanceCard.tsx       # Crypto balance display
  ├── MissionCard.tsx       # Mission components
  ├── NFTCard.tsx           # NFT display components
  ├── ProgressChart.tsx     # Earnings progress chart
  └── NotificationSystem.tsx # Notification management

lib/
  ├── auth.ts               # NextAuth configuration
  ├── data.ts               # Mock data for development
  ├── providers.tsx         # React providers
  ├── theme-provider.tsx    # Dark mode provider
  └── utils.ts              # Utility functions
```

## 🎯 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Charts**: Recharts
- **TypeScript**: Full type safety
- **UI Components**: Custom component library

## 🌍 Environmental Theme

Ecoflow transforms environmental actions into crypto rewards:

- **Green Color Scheme**: Primary color #22c55e (green-500)
- **Eco-friendly Icons**: Leaf, tree, recycling symbols
- **Mission-based Rewards**: Complete environmental tasks
- **NFT Certificates**: Proof of environmental impact
- **Community Impact**: Track collective environmental benefits

## 📱 Responsive Design

- **Mobile Navigation**: Bottom tab bar for easy thumb navigation
- **Desktop Navigation**: Top horizontal navigation
- **Adaptive Layout**: Grid systems adjust to screen size
- **Touch-friendly**: Large touch targets for mobile devices

## 🔐 Security Features

- **Secure Authentication**: OAuth 2.0 with Google
- **Protected Routes**: Authentication guards for dashboard
- **Type Safety**: Full TypeScript coverage
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set production environment variables**

   - Update `NEXTAUTH_URL` to your production domain
   - Ensure all OAuth redirect URIs are configured

3. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS
   - Google Cloud Platform

## 📈 Future Enhancements

- [ ] Real blockchain integration (Base L2)
- [ ] Actual NFT minting
- [ ] Map integration for missions
- [ ] Photo upload and validation
- [ ] NGO partnership integration
- [ ] Referral system
- [ ] Advanced analytics
- [ ] Mobile app version
