import { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { initializeMockProfile } from '../lib/stores/userStore';

export default function CVAnalysisScreen() {
  const router = useRouter();
  const floatAnim = useSharedValue(0);
  const scanAnim = useSharedValue(0);

  useEffect(() => {
    // Float animation for the CV
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Scanning animation
    scanAnim.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );

    // Initialize profile and navigate after analysis
    const timer = setTimeout(() => {
      initializeMockProfile();
      router.replace('/persona');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const scanStyle = useAnimatedStyle(() => ({
    top: `${scanAnim.value * 100}%`,
  }));

  return (
    <View className="flex-1 bg-background-dark">
      <LinearGradient
        colors={['#1E293B', '#0F172A', '#020617']}
        className="flex-1"
      >
        <SafeAreaView edges={['top']} className="flex-1">
          {/* Background decorations */}
          <View className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <View className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center">
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            
            <Text className="text-lg font-bold tracking-tight text-white">
              ASTRA APPLY
            </Text>
            
            <View className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center">
              <Ionicons name="sparkles" size={20} color="#3B82F6" className="animate-pulse" />
            </View>
          </View>

          {/* Title */}
          <View className="px-6 mt-4 mb-8">
            <Text className="text-2xl font-bold text-white mb-2">
              Analyzing your profile
            </Text>
            <Text className="text-sm text-slate-400">
              Our AI is extracting your expertise to match international opportunities.
            </Text>
          </View>

          {/* CV Document Animation */}
          <View className="flex-1 items-center justify-center px-6">
            <Animated.View style={floatStyle} className="relative">
              {/* Scanning effect */}
              <View className="w-48 h-64 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 backdrop-blur-xl overflow-hidden">
                {/* Document lines */}
                <View className="w-12 h-2 bg-primary/40 rounded-full mb-4" />
                <View className="space-y-3">
                  <View className="w-full h-1.5 bg-slate-300/20 rounded-full" />
                  <View className="w-5/6 h-1.5 bg-slate-300/20 rounded-full" />
                  <View className="w-4/6 h-1.5 bg-slate-300/20 rounded-full" />
                  <View className="pt-4 space-y-2">
                    <View className="w-full h-1.5 bg-primary/20 rounded-full" />
                    <View className="w-full h-1.5 bg-primary/20 rounded-full" />
                  </View>
                  <View className="pt-4 flex-row gap-2">
                    <View className="w-8 h-8 rounded-lg bg-slate-300/10" />
                    <View className="w-8 h-8 rounded-lg bg-slate-300/10" />
                  </View>
                </View>

                {/* Scan line */}
                <Animated.View
                  style={scanStyle}
                  className="absolute w-full h-1 bg-primary/60 shadow-lg shadow-primary"
                />
                
                {/* Gradient overlay */}
                <LinearGradient
                  colors={['rgba(59, 130, 246, 0.05)', 'rgba(59, 130, 246, 0.2)', 'transparent']}
                  className="absolute inset-0 opacity-30"
                />
              </View>

              {/* Pulse rings */}
              <View className="absolute -inset-10 border border-primary/20 rounded-full animate-ping opacity-20" />
              <View className="absolute -inset-20 border border-primary/10 rounded-full animate-pulse opacity-10" />
            </Animated.View>
          </View>

          {/* Progress Steps */}
          <View className="px-6 pb-10 space-y-6">
            {/* Step 1 - Complete */}
            <View className="flex-row items-center gap-4">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-white">Reading CV</Text>
                <Text className="text-xs text-slate-500">Extraction complete</Text>
              </View>
            </View>

            {/* Step 2 - Complete */}
            <View className="flex-row items-center gap-4">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-white">Building Persona</Text>
                <Text className="text-xs text-slate-500">Skills & experience mapped</Text>
              </View>
            </View>

            {/* Step 3 - In Progress */}
            <View className="flex-row items-center gap-4">
              <View className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary items-center justify-center relative">
                <Ionicons name="sync" size={16} color="#3B82F6" className="animate-spin" />
                <View className="absolute -inset-1 border border-primary/50 rounded-full animate-pulse" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-primary">Optimizing Profile</Text>
                <Text className="text-xs text-primary/70">Generating ATS-ready tags...</Text>
              </View>
            </View>

            {/* Step 4 - Pending */}
            <View className="flex-row items-center gap-4 opacity-40">
              <View className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 items-center justify-center">
                <View className="w-2 h-2 bg-slate-400 rounded-full" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-white">Mapping Job Market</Text>
                <Text className="text-xs text-slate-500">Finding matches in 40+ countries</Text>
              </View>
            </View>

            {/* Disabled button */}
            <View className="mt-8">
              <View className="w-full py-4 rounded-2xl bg-slate-800 items-center justify-center">
                <Text className="text-sm text-slate-500 font-bold">
                  Preparing Results...
                </Text>
              </View>
              <Text className="text-center text-[10px] mt-4 uppercase tracking-widest opacity-30 font-bold text-slate-500">
                Encrypted & Secure Session
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
