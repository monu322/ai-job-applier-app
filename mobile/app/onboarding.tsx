import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../lib/stores/userStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const personas = useUserStore((state) => state.personas);
  const hasPersonas = personas.length > 0;
  const floatAnim = useSharedValue(0);

  // Float animation
  floatAnim.value = withRepeat(
    withSequence(
      withTiming(-10, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
    ),
    -1,
    false
  );

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const handleCVUpload = () => {
    // Navigate to CV analysis
    router.push('/cv-analysis');
  };

  const handleLinkedIn = () => {
    // Navigate to CV analysis (for demo)
    router.push('/cv-analysis');
  };

  return (
    <View className="flex-1 bg-midnight">
      <LinearGradient
        colors={['#1E293B', '#0F172A', '#020617']}
        className="flex-1"
      >
        {/* Status bar */}
        <SafeAreaView edges={['top']} className="flex-1">
          {/* Background decorations */}
          <View className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <View className="absolute top-1/2 -right-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 mt-4 mb-4">
            {hasPersonas ? (
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center"
              >
                <Ionicons name="chevron-back" size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <View className="w-10 h-10" />
            )}
            
            <View className="flex-row items-center gap-2">
              <View className="w-10 h-10 bg-gradient-to-tr from-primary to-blue-400 rounded-xl items-center justify-center">
                <Ionicons name="sparkles" size={24} color="white" />
              </View>
              <Text className="text-2xl font-bold text-white">
                Astra<Text className="text-primary">Apply</Text>
              </Text>
            </View>

            <View className="w-10 h-10" />
          </View>

          {/* Main content */}
          <View className="flex-1 items-center justify-center px-8">
            {/* Animated illustration */}
            <Animated.View style={floatStyle} className="w-64 h-64 mb-12 items-center justify-center">
              {/* Orbiting circles */}
              <View className="absolute inset-0 border border-primary/20 rounded-full" />
              <View className="absolute inset-4 border border-blue-400/20 rounded-full" />
              
              {/* Center circle */}
              <View className="w-40 h-40 bg-white/5 border border-white/10 rounded-full items-center justify-center backdrop-blur-xl">
                <View className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
                <Ionicons name="briefcase" size={60} color="#3B82F6" />
                <View className="flex-row gap-2 mt-2">
                  <Ionicons name="globe" size={20} color="#60A5FA" />
                  <Ionicons name="business" size={20} color="#60A5FA" />
                </View>
              </View>

              {/* Badges */}
              <View className="absolute -top-2 right-4 bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-full border border-primary/30">
                <View className="flex-row items-center gap-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <Text className="text-[10px] font-bold text-blue-400">MATCHING</Text>
                </View>
              </View>
              
              <View className="absolute bottom-6 -left-4 bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-full border border-primary/30">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="rocket" size={12} color="white" />
                  <Text className="text-[10px] font-bold text-white">AUTO-APPLY</Text>
                </View>
              </View>
            </Animated.View>

            {/* Title and description */}
            <Text className="text-3xl font-bold text-center text-white leading-tight mb-4">
              Apply to jobs worldwide{'\n'}with your personal{' '}
              <Text className="text-primary">AI agent</Text>
            </Text>
            
            <Text className="text-sm text-slate-400 text-center max-w-[280px] mb-8">
              Upload your CV. We analyze, match, and apply for you while you sleep.
            </Text>
          </View>

          {/* Action buttons */}
          <View className="px-8 pb-8">
            <TouchableOpacity
              onPress={handleCVUpload}
              className="w-full bg-gradient-to-r from-blue-700 to-primary py-5 rounded-2xl mb-4"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center gap-3">
                <Ionicons name="cloud-upload" size={24} color="white" />
                <Text className="text-white font-bold text-base">Upload Your CV</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLinkedIn}
              className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl mb-8"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center gap-3">
                <Ionicons name="logo-linkedin" size={20} color="#0A66C2" />
                <Text className="text-slate-200 font-semibold">Import from LinkedIn</Text>
              </View>
            </TouchableOpacity>

            {/* Security badges */}
            <View className="flex-row items-center justify-center gap-4">
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="lock-closed" size={14} color="#64748B" />
                <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  SECURE
                </Text>
              </View>
              <View className="w-1 h-1 rounded-full bg-slate-700" />
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="shield-checkmark" size={14} color="#64748B" />
                <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  PRIVATE
                </Text>
              </View>
              <View className="w-1 h-1 rounded-full bg-slate-700" />
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="flash" size={14} color="#3B82F6" />
                <Text className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  AI-POWERED
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
