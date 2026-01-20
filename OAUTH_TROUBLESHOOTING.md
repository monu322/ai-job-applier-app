# OAuth Troubleshooting: "Unable to exchange external code"

## ❌ Error You're Seeing:
```
error=server_error
error_code=unexpected_failure  
error_description=Unable+to+exchange+external+code
```

This means Supabase cannot verify the Google authentication code.

## ✅ EXACT Fix Steps:

### 1. Google API Must Be Enabled

**Go to Google Cloud Console:**
- https://console.cloud.google.com
- Select your project
- **APIs & Services** → **Library**
- Search for: **"Google OAuth2 API"** or **"Google People API"**
- Click and ensure it's **ENABLED**

### 2. Verify OAuth Consent Screen Status

**Go to:** APIs & Services → OAuth consent screen

**Status must be:** "Testing" or "In Production"
**NOT:** "Needs Configuration"

### 3. Re-create OAuth Credentials (Nuclear Option)

If still failing:
1. Go to **Credentials**
2. **DELETE** the existing OAuth 2.0 Client ID
3. Create a **NEW** one:
   - Type: Web application
   - Authorized JavaScript origins: `https://pqxcncwkjsvoixaqrnhc.supabase.co`
   - Authorized redirect URIs: `https://pqxcncwkjsvoixaqrnhc.supabase.co/auth/v1/callback`
4. Copy the NEW Client ID and Secret
5. Update in Supabase (delete old, paste new)
6. Click SAVE in Supabase

### 4. Alternative: Use Email Auth Only

Google OAuth is complex. For MVP, you can:
- Remove Google button temporarily
- Use email/password authentication (which works)
- Add OAuth later after app is stable

## 🔍 Check These Specific Things:

**In Supabase Dashboard:**
- Site URL is set correctly in Project Settings
- Redirect URLs include your app URL

**In Google Console:**
- OAuth consent screen is published (not draft)
- App is verified if needed
- No pending actions/warnings

**Common Issue:**
Sometimes Google OAuth just needs 5-10 minutes to propagate after setup. Try waiting and test again.

---

**RECOMMENDATION:** Focus on email auth for now. OAuth can be added after the core app works.
