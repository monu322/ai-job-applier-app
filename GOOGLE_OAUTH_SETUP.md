# Google OAuth Setup for Astra Apply

Complete guide to enable Google Sign-in with Supabase.

---

## 📋 Prerequisites

- Supabase project created
- Google account for creating OAuth credentials

---

## Part 1: Create Google OAuth Credentials

### Step 1: Go to Google Cloud Console

1. Visit https://console.cloud.google.com
2. Sign in with your Google account

### Step 2: Create a New Project (or select existing)

1. Click the project dropdown at the top
2. Click "New Project"
3. Name it: `Astra Apply`
4. Click "Create"

### Step 3: Enable Google+ API

1. In the left sidebar, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 4: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (for public users)
3. Click "Create"
4. Fill in the required information:
   - **App name:** Astra Apply
   - **User support email:** your-email@example.com
   - **Developer contact:** your-email@example.com
5. Click "Save and Continue"
6. **Scopes:** Click "Add or Remove Scopes"
   - Add: `email`, `profile`, `openid`
7. Click "Save and Continue"
8. **Test users** (optional during development): Add your email
9. Click "Save and Continue"
10. Review and click "Back to Dashboard"

### Step 5: Create OAuth Client ID

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Application type: **Web application**
4. Name: `Astra Apply Web Client`
5. **Authorized JavaScript origins:**
   - Add: `https://your-project.supabase.co`
   - Add: `http://localhost:8081` (for dev)
6. **Authorized redirect URIs:**
   - Add: `https://your-project.supabase.co/auth/v1/callback`
7. Click "Create"
8. **Save these credentials:**
   - Client ID: `727249825057-18rbgglfqhm0509gurk0uu4urv3pksnc.apps.googleusercontent.com`
   - Client Secret: `GGOCSPX-1ipVCONw23g15y3wNNGN9Js0oZvC`

---

## Part 2: Configure Supabase

### Step 1: Add Google Provider in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list
4. Toggle "Enable Sign in with Google"
5. Enter your credentials:
   - **Client ID:** (from Google Cloud Console)
   - **Client Secret:** (from Google Cloud Console)
6. Click "Save"

### Step 2: Get Supabase Callback URL

The callback URL should be:
```
https://pqxcncwkjsvoixaqrnhc.supabase.co/auth/v1/callback
```

Make sure this is added to Google Cloud Console Authorized redirect URIs.

---

## Part 3: Update Mobile App Code

### Step 1: Add Google Sign-in Method to Auth Context

Update `mobile/lib/contexts/AuthContext.tsx`:

```typescript
import { supabase } from '../supabaseClient';

// Add to AuthContextType
signInWithGoogle: () => Promise<void>;

// Add method to AuthProvider
const signInWithGoogle = async () => {
  try {
    setError(null);
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'astraapply://auth/callback',
      },
    });
    
    if (error) throw error;
    
  } catch (err: any) {
    const errorMessage = err.message || 'Google sign-in failed';
    setError(errorMessage);
    Alert.alert('Google Sign-in Error', errorMessage);
    throw err;
  } finally {
    setIsLoading(false);
  }
};

// Add to context value
signInWithGoogle,
```

### Step 2: Update Login Screen

```typescript
const { login, signInWithGoogle } = useAuth();

<TouchableOpacity
  onPress={signInWithGoogle}
  className="bg-white/5 border border-white/10 py-4 rounded-2xl mb-4"
  activeOpacity={0.8}
>
  <View className="flex-row items-center justify-center gap-3">
    <Ionicons name="logo-google" size={20} color="#DB4437" />
    <Text className="text-white font-semibold">Continue with Google</Text>
  </View>
</TouchableOpacity>
```

### Step 3: Add URL Scheme to app.json

Add this to `mobile/app.json`:

```json
{
  "expo": {
    "scheme": "astraapply",
    ...
  }
}
```

---

## Part 4: Testing

### For Web (Expo Web):

Google OAuth works automatically in browser

### For Mobile (iOS/Android):

1. Build development client:
   ```bash
   npx expo prebuild
   ```

2. Test on device/simulator:
   ```bash
   npx expo run:ios  # or run:android
   ```

---

## 🔒 Security Notes

- **Never commit** Google Client Secret to git
- Store in environment variables
- Use different credentials for production
- Enable only required scopes
- Regularly rotate secrets

---

## 📱 Production Checklist

- [ ] Move OAuth consent screen to "Production"
- [ ] Add production redirect URIs
- [ ] Use production Supabase URL
- [ ] Store secrets in secure environment
- [ ] Test on real devices

---

## 🐛 Troubleshooting

**Error: redirect_uri_mismatch**
- Check authorized redirect URIs in Google Console
- Ensure Supabase callback URL is exact match

**Error: invalid_client**
- Check Client ID and Secret are correct
- Ensure OAuth consent screen is published

**Error: access_denied**
- User cancelled the flow
- Check app verification status

---

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)

---

**Once configured, users can sign in with Google in one click!**
