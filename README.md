# Astra Apply - AI Job Application Platform

A comprehensive job application platform powered by AI, featuring a React Native mobile app, web application, and backend API.

## Project Structure

```
job-applier-app/
├── mobile/          # React Native mobile app (Expo)
├── backend/         # Backend API (Coming soon)
├── web/             # Web application (Coming soon)
└── design-reference/  # UI/UX design references
```

## 📱 Mobile App (React Native + Expo)

**Location:** `/mobile`

A React Native mobile app built with Expo that helps users apply to jobs worldwide with an AI-powered agent.

### Features:
- Multi-persona system (create personas from different CVs)
- AI-powered job discovery with swipe/list views
- Global job market with interactive map
- Application activity dashboard
- Real-time job matching
- Dark theme with glass morphism UI

### Tech Stack:
- React Native + Expo SDK 54
- TypeScript
- Expo Router (file-based navigation)
- NativeWind (TailwindCSS)
- React Native Reanimated
- Zustand (state management)

### Getting Started:
```bash
cd mobile
npm install
npx expo start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

## 🌐 Web App (Coming Soon)

**Location:** `/web`

Web version of the Astra Apply platform.

## ⚙️ Backend API (Coming Soon)

**Location:** `/backend`

Backend API for the Astra Apply platform.

## 🎨 Design References

**Location:** `/design-reference`

Contains HTML mockups and screenshots of all UI screens for reference.

## Development

### Prerequisites:
- Node.js 16+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Mobile App Flow:
1. Splash Screen → Onboarding → CV Analysis → Persona Summary
2. Home Dashboard (with persona selector)
3. AI Agent (Swipe/List job discovery)
4. Global Job Market (with zoomable map)
5. Profile & Settings

## License

This is a portfolio/demo project.

---

Built with ❤️ using React Native, Expo & AI
