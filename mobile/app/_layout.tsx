import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../lib/contexts/AuthContext';

export default function RootLayout() {
  useEffect(() => {
    // Fix dark mode for NativeWind
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#020617' },
          animation: 'fade',
        }}
      >
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="login" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="cv-analysis" />
          <Stack.Screen name="persona" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="job-details/[id]" />
          <Stack.Screen name="ai-agent" />
          <Stack.Screen name="verification" />
          <Stack.Screen name="success" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
