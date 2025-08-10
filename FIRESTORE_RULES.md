# Firestore Security Rules Setup

⚠️ **IMPORTANT**: You need to set up Firestore security rules for your Firebase project to allow read/write operations.

## How to set up Firestore Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **findit-app-b96d9**
3. Go to **Firestore Database** from the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all items for browsing
    match /lostFoundItems/{document} {
      allow read: if true;
      // Allow write access only to authenticated users
      allow write: if request.auth != null;
    }
  }
}
```

6. Click **Publish** to save the rules

## What these rules do:

- **Read access**: Anyone can browse and search items (public access)
- **Write access**: Only authenticated users can create/update/delete items
- **Security**: Prevents unauthorized modifications while allowing public browsing

## Current Status:

- ✅ Firebase configuration is properly set
- ✅ Real-time listeners are active
- ⚠️ **Security rules need to be configured** (do this now!)

Once you set up these rules, the form submission will work perfectly!
