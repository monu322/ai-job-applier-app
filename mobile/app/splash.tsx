import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const router = useRouter();
  const floatAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    // Float animation
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Glow pulse
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 })
      ),
      -1,
      false
    );

    // Progress bar
    progressAnim.value = withTiming(1, {
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
    });

    // Navigate after delay
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#0F172A', '#020617', '#000000']}
        style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Animated background orbs */}
        <Animated.View
          style={glowStyle}
          className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"
        />
        <Animated.View
          style={glowStyle}
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-900/20 rounded-full blur-3xl"
        />

        {/* Logo container */}
        <Animated.View style={[floatStyle, { alignItems: 'center', width: '100%' }]}>
          {/* Rotating border */}
          <View className="w-24 h-24 mb-6 items-center justify-center">
            <View className="absolute inset-0 border border-white/10 rounded-[2rem] rotate-45" />
            <View className="w-full h-full bg-gradient-to-br from-white to-blue-200 rounded-3xl items-center justify-center shadow-lg shadow-primary/50">
              <Ionicons name="sparkles" size={48} color="#020617" />
            </View>
          </View>

          {/* App name */}
          <Text className="text-4xl font-bold text-white tracking-tight mb-2">
            Astra Apply
          </Text>

          <Text className="text-lg text-blue-200/60 font-light tracking-widest uppercase">
            Your AI Job Agent
          </Text>
        </Animated.View>

        {/* Progress bar */}
        <View className="absolute bottom-24 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden" style={{ alignSelf: 'center', left: '50%', marginLeft: -96 }}>
          <Animated.View
            style={progressStyle}
            className="h-full bg-primary shadow-lg shadow-primary"
          />
        </View>

        {/* Security badge */}
        <View className="absolute bottom-12 items-center w-full">
          <Text className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-2">
            Premium Career Intelligence
          </Text>
          <View className="flex-row items-center space-x-2">
            <Ionicons name="lock-closed" size={12} color="rgba(255,255,255,0.2)" />
            <Text className="text-xs text-white/20 tracking-wider">
              Secure & Encrypted
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
