import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to splash screen
    const timer = setTimeout(() => {
      router.replace('/splash');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-background-dark items-center justify-center">
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}
