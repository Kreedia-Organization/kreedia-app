# 🔧 Firebase Troubleshooting Guide

## 🚨 **Problem Identified:**

User gets "Authentication Error" on dashboard after successful Google sign-in, and data is not being saved to Firestore.

## 📋 **Quick Checklist:**

### **1. Environment Variables (.env.local)**

Verify all Firebase keys are present and correct:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **2. Firebase Console Settings**

#### **Authentication:**

- ✅ Enable Google Sign-in method
- ✅ Add your domain to authorized domains
- ✅ Check if users are appearing in Authentication > Users

#### **Firestore Database:**

- ✅ Create Firestore database (start in test mode for now)
- ✅ Verify database exists and is accessible

### **3. Firestore Security Rules**

Ensure your rules allow authenticated access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow authenticated users to read missions
    match /missions/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Allow authenticated users to manage their mission relationships
    match /mission_users/{document} {
      allow read, write: if request.auth != null;
    }

    // Allow authenticated users to manage their location submissions
    match /location_submissions/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔍 **Debug Steps:**

### **Step 1: Access Debug Page**

Navigate to `/debug` in your app to see detailed diagnostics.

### **Step 2: Check Browser Console**

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for Firebase-related errors
4. Check for 🔍, ✅, ❌ emoji logs

### **Step 3: Common Error Messages**

#### **"Missing or insufficient permissions"**

- **Cause:** Firestore security rules too restrictive
- **Fix:** Update rules to allow authenticated access

#### **"API key not valid"**

- **Cause:** Incorrect or missing API key
- **Fix:** Verify NEXT_PUBLIC_FIREBASE_API_KEY in .env.local

#### **"Project not found"**

- **Cause:** Incorrect project ID
- **Fix:** Verify NEXT_PUBLIC_FIREBASE_PROJECT_ID matches your Firebase project

#### **"Network Error"**

- **Cause:** Firebase services not accessible
- **Fix:** Check internet connection and Firebase service status

## 🛠️ **Manual Fix Steps:**

### **Option 1: Restart Development Server**

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### **Option 2: Clear Browser Data**

1. Open Developer Tools (F12)
2. Application tab > Storage
3. Clear all data for localhost
4. Refresh page

### **Option 3: Force User Creation**

1. Go to `/debug` page
2. Click "Create/Update User" button
3. Check if user appears in Firestore console

### **Option 4: Check Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Check Authentication > Users (should see your Google account)
4. Check Firestore Database > Data (should see 'users' collection)

## 📊 **Expected Working Flow:**

### **1. Successful Authentication:**

```
Console logs should show:
✅ User authenticated: [user_id]
🔍 Firebase User details: {...}
📊 Fetching user data from Firestore...
✅ Firestore data loaded: {...}
```

### **2. Dashboard Access:**

- No "Authentication Error" screen
- User data displayed in header
- No console errors

### **3. Firestore Data:**

- User document created in `users` collection
- Document ID matches Firebase Auth UID
- Contains user profile information

## 🚑 **Emergency Fix:**

If nothing else works, try this complete reset:

1. **Clear all browser data** for localhost
2. **Restart development server**
3. **Sign in again** with Google
4. **Check `/debug` page** for detailed status
5. **Manually create user** if needed using debug page

## 📞 **Still Need Help?**

Check these logs in order:

1. Browser console for client-side errors
2. Terminal/command prompt for server-side errors
3. Firebase Console for service-specific issues
4. `/debug` page for comprehensive diagnostics

Most common issue is **Firestore security rules** - make sure they allow authenticated access!
