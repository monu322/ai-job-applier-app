# Astra Apply - AI Job Application Mobile App

A React Native mobile app built with Expo that helps users apply to jobs worldwide with an AI-powered agent.

## Features Implemented

### ✅ Core Screens
- **Splash Screen** - Animated intro with floating logo and pulse effects
- **Onboarding** - CV upload and LinkedIn import options
- **CV Analysis** - AI processing animation with scanning effects
- **Profile Summary** - User persona with AI insights and action buttons
- **Job Discovery Feed** - List view of job opportunities with match scores
- **Job Details** - Comprehensive job information with AI match analysis
- **Tab Navigation** - 5-tab bottom navigation (Home, Market, AI Agent, Applied, Profile)

### 🎨 Design Features
- Dark theme with glass morphism effects
- Smooth animations using React Native Reanimated
- Gradient backgrounds and glow effects
- Match percentage badges
- Visa sponsorship indicators
- Professional UI matching design references

### 📦 Tech Stack
- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **NativeWind** (TailwindCSS for React Native)
- **React Native Reanimated** for animations
- **Zustand** for state management
- **Expo Linear Gradient** for gradients
- **Expo Blur** for glass morphism

## Project Structure

```
app/
├── (tabs)/              # Tab navigation
│   ├── index.tsx       # Home/Discovery Feed
│   ├── market.tsx      # Global Job Market (placeholder)
│   ├── ai-agent.tsx    # AI Agent (placeholder)
│   ├── applied.tsx     # Applied Jobs (placeholder)
│   └── profile.tsx     # Profile (placeholder)
├── job-details/[id].tsx # Dynamic job details
├── splash.tsx          # Animated splash screen
├── onboarding.tsx      # CV upload/LinkedIn
├── cv-analysis.tsx     # AI analysis animation
├── profile-summary.tsx # User persona summary
└── _layout.tsx         # Root layout

lib/
├── stores/             # Zustand stores
│   ├── userStore.ts   # User profile state
│   └── jobStore.ts    # Jobs and applications state
├── types/              # TypeScript types
│   ├── job.types.ts
│   └── user.types.ts
└── data/               # Mock data
    ├── mockJobs.ts
    └── mockProfile.ts

components/
└── ui/
    └── GlassPanel.tsx  # Reusable glass effect component
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Navigate to project directory:
```bash
cd /Users/monujohn/Documents/projects/job-applier-app
```

2. Install dependencies (already done):
```bash
npm install
```

### Running the App

Start the Expo development server:
```bash
npx expo start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## App Flow

1. **Splash Screen** (2.5s) → Auto-navigates to Onboarding
2. **Onboarding** → Choose "Upload CV" or "Import from LinkedIn"
3. **CV Analysis** (4s animation) → Shows AI processing with scanning effects
4. **Profile Summary** → Displays user persona with 3 action buttons:
   - **Find Jobs Now** → Navigates to job discovery feed
   - **Job Market** → Navigates to market tab
   - **Improve CV** → Shows "coming soon" alert
5. **Job Discovery Feed** → List of jobs with match scores
6. **Job Details** → Tap any job to see full details
7. **Tab Navigation** → Switch between Home, Market, AI Agent, Applied, Profile

## Mock Data

The app uses mock data for demonstration:
- 8 sample jobs (Microsoft, Google, Netflix, Stripe, Amazon, Apple, Airbnb, Meta)
- Sample user profile (Jason Mitchell - Product Manager)
- Match scores range from 85-98%
- Salary ranges $110K-$220K

## What's Next

To complete the full app experience as per the design reference:

### Priority Features
1. **Swipe View** - Tinder-style card swipe interface for jobs
2. **AI Agent Active Screen** - Real-time application submission with progress
3. **Human Verification Screen** - CAPTCHA/verification prompt
4. **Application Success Screen** - Success dashboard with statistics
5. **Global Job Market Map** - Interactive map visualization

### Additional Screens
6. Market screen implementation
7. Applied jobs dashboard
8. Profile settings
9. CV improvement suggestions

### Enhancements
- Gesture-based swipe cards with React Native Gesture Handler
- More complex animations
- API integration (when backend is ready)
- Document picker for actual CV uploads
- LinkedIn OAuth integration

## Known Limitations

- Mock data only (no real API integration)
- Some screens are placeholders
- Swipe view not yet implemented
- No actual CV parsing
- No LinkedIn integration (UI only)
- Apply button shows alert (not functional)

## Development Notes

- Uses `--legacy-peer-deps` due to React Native and Tailwind peer dependency conflicts
- NativeWind configured with custom dark theme colors
- All animations use React Native Reanimated for 60fps performance
- Safe area insets handled properly for iOS notch

## Troubleshooting

### If app doesn't start:
```bash
# Clear cache and restart
npx expo start --clear
```

### If styles don't work:
Make sure `global.css` is imported in `app/_layout.tsx`

### If icons don't show:
@expo/vector-icons should be installed automatically with Expo

## License

This is a portfolio/demo project.

---

Built with ❤️ using React Native & Expo
