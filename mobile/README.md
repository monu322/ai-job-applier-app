# Astra Apply Mobile App

React Native mobile app built with Expo for AI-powered job applications.

## Features

- ✅ Multi-persona system (create multiple personas from different CVs)
- ✅ AI-powered job discovery with swipe/list views  
- ✅ Global job market with interactive zoomable map
- ✅ Application activity dashboard with stats
- ✅ Real-time job matching and scoring
- ✅ Dark theme with glass morphism UI
- ✅ Smooth animations and transitions

## Tech Stack

- React Native + Expo SDK 54
- TypeScript
- Expo Router (file-based navigation)
- NativeWind (TailwindCSS for React Native)
- React Native Reanimated (animations)
- Zustand (state management)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Then press:
# i - for iOS simulator
# a - for Android emulator  
# w - for web browser
```

## Project Structure

```
mobile/
├── app/              # Expo Router screens
│   ├── (tabs)/      # Tab navigation
│   ├── splash.tsx   # Splash screen
│   ├── onboarding.tsx
│   ├── persona.tsx  # Persona details
│   └── ...
├── components/       # Reusable components
├── lib/
│   ├── stores/      # Zustand state management
│   ├── types/       # TypeScript types
│   └── data/        # Mock data
└── constants/       # App constants
```

## App Flow

1. **Splash** (2.5s) → **Onboarding** (CV upload)
2. **CV Analysis** (4s animation) → **Persona Summary**
3. **Home** - Dashboard with persona selector & stats
4. **AI Agent** - Swipe/list job discovery
5. **Market** - Global job market map
6. **Profile** - Settings & account

## Troubleshooting

### If app doesn't start:
```bash
npx expo start --clear
```

### If styles don't work:
Check that `global.css` is imported in `app/_layout.tsx`

## Development Notes

- Uses `--legacy-peer-deps` for package installation
- Tailwind CSS v3 with NativeWind
- Dark mode enforced
- Safe area insets for iOS notch

Built with ❤️ using React Native & Expo
