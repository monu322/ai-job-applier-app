# Google OAuth Branding - Show App Name Instead of Supabase URL

## Issue
Google consent screen shows "your-project.supabase.co" instead of "Astra Apply"

## Solution

### Step 1: Update OAuth Consent Screen

1. Go to **Google Cloud Console** → https://console.cloud.google.com
2. Select your project (Astra Apply)
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Click **EDIT APP**

### Step 2: Configure App Information

**Application name:**
- Change to: `Astra Apply`

**Application logo (optional):**
- Upload your app icon (512x512 px recommended)

**Application home page:**
- Enter: `https://astraapply.com` (or your website)

**Authorized domains:**
- Add: `supabase.co` (to allow redirect)
- Add: `astraapply.com` (your domain)

**Developer contact information:**
- Your email address

### Step 3: Save Changes

1. Click "SAVE AND CONTINUE"
2. Review all sections
3. Click "BACK TO DASHBOARD"

### Step 4: Verify Changes

1. Test Google sign-in
2. You should now see "Astra Apply" in the consent screen
3. Your logo will appear if uploaded

---

## Quick Tips

**App Name Display:**
- The "Application name" field controls what users see
- Must be set in OAuth consent screen, not in credentials

**Logo Requirements:**
- 512x512 px
- PNG or JPG
- Square aspect ratio
- Under 1MB

**For Production:**
- Publish the OAuth consent screen
- Add verified domains
- Complete app verification if needed

---

**After these changes, Google will display "Astra Apply" instead of the Supabase URL!**
