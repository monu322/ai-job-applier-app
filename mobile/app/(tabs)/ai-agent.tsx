import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJobStore } from '../../lib/stores/jobStore';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function AIAgentScreen() {
  const jobs = useJobStore((state) => state.jobs);
  const viewMode = useJobStore((state) => state.viewMode);
  const setViewMode = useJobStore((state) => state.setViewMode);
  const currentJobIndex = useJobStore((state) => state.currentJobIndex);
  const nextJob = useJobStore((state) => state.nextJob);
  const router = useRouter();

  const currentJob = jobs[currentJobIndex];
  const nextCardOpacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const handleLike = (jobId: string) => {
    translateX.value = 0;
    rotateZ.value = 0;
    nextCardOpacity.value = 0;
    nextJob();
  };

  const handleSkip = (jobId: string) => {
    translateX.value = 0;
    rotateZ.value = 0;
    nextCardOpacity.value = 0;
    nextJob();
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      nextCardOpacity.value = 0;
    })
    .onChange((event) => {
      translateX.value = event.translationX;
      rotateZ.value = event.translationX / 20;
      // Fade in next card as current card is swiped
      nextCardOpacity.value = Math.abs(event.translationX) / SWIPE_THRESHOLD;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe Right - Like
        translateX.value = withTiming(SCREEN_WIDTH);
        nextCardOpacity.value = withTiming(1);
        runOnJS(handleLike)(currentJob?.id || '');
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe Left - Skip
        translateX.value = withTiming(-SCREEN_WIDTH);
        nextCardOpacity.value = withTiming(1);
        runOnJS(handleSkip)(currentJob?.id || '');
      } else {
        // Return to center
        translateX.value = withSpring(0);
        rotateZ.value = withSpring(0);
        nextCardOpacity.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    opacity: nextCardOpacity.value,
  }));

  if (!currentJob && viewMode === 'swipe') {
    return (
      <View className="flex-1 bg-background-dark items-center justify-center">
        <LinearGradient
          colors={['#1E293B', '#0F172A', '#020617']}
          className="flex-1 w-full items-center justify-center"
        >
          <Ionicons name="checkmark-circle" size={64} color="#10B981" />
          <Text className="text-2xl font-bold text-white mt-4">All Caught Up!</Text>
          <Text className="text-slate-400 mt-2">No more jobs to review</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-dark">
      <LinearGradient
        colors={['#1E293B', '#0F172A', '#020617']}
        className="flex-1"
      >
        <SafeAreaView edges={['top']} className="flex-1">
          {/* Header */}
          <View className="px-6 py-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xs font-bold tracking-widest text-primary uppercase">
                ASTRA APPLY
              </Text>
              <View className="flex-row items-center gap-4">
                <Ionicons name="notifications-outline" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-white mb-1">Discovery Feed</Text>
                <Text className="text-sm text-slate-400">AI finding your best matches...</Text>
              </View>
              
              {/* View Toggle - moved here */}
              <View className="flex-row bg-white/5 rounded-full p-1">
              <TouchableOpacity
                onPress={() => setViewMode('swipe')}
                className={`px-4 py-2 rounded-full ${
                  viewMode === 'swipe' ? 'bg-primary' : ''
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    viewMode === 'swipe' ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  SWIPE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode('list')}
                className={`px-4 py-2 rounded-full ${
                  viewMode === 'list' ? 'bg-primary' : ''
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    viewMode === 'list' ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  LIST
                </Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>

          {/* Swipe View */}
          {viewMode === 'swipe' && currentJob && (
            <View className="flex-1 px-6 justify-start pt-4 pb-32">
              <View className="relative w-full" style={{ height: 480 }}>
                {/* Next card behind (scaled down) */}
                {jobs[currentJobIndex + 1] && (
                  <Animated.View
                    style={[
                      nextCardStyle,
                      {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        transform: [{ scale: 0.95 }],
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 32,
                      },
                    ]}
                  />
                )}
                
                {/* Main card */}
                <GestureDetector gesture={gesture}>
                  <Animated.View
                    style={[
                      animatedStyle,
                      {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 32,
                        overflow: 'hidden',
                      },
                    ]}
                  >
                      {/* Match Badge - moved to top right */}
                      <View className="absolute top-6 right-6 z-10 bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full flex-row items-center gap-1">
                        <View className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <Text className="text-xs font-bold text-primary">{currentJob.matchScore}% Match</Text>
                      </View>

                      {/* Company Info */}
                      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24, justifyContent: 'flex-start' }}>
                        <LinearGradient
                          colors={['transparent', 'rgba(2, 6, 23, 0.9)']}
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                        <View style={{ position: 'relative' }}>
                        <View style={{ width: 64, height: 64, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 16, marginBottom: 12, alignItems: 'center', justifyContent: 'center' }}>
                          <Image
                            source={{ uri: currentJob.logo }}
                            style={{ width: 48, height: 48, resizeMode: 'contain' }}
                          />
                        </View>
                        <Text className="text-2xl font-bold text-white leading-tight mb-1">
                          {currentJob.title}
                        </Text>
                        <Text className="text-slate-300 font-medium mb-4">{currentJob.company}</Text>

                        <View className="flex-row items-center gap-4 mb-3">
                          <View>
                            <Text className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                              Location
                            </Text>
                            <Text className="text-sm font-medium text-white">
                              {currentJob.location} {currentJob.remote && '(Remote)'}
                            </Text>
                          </View>
                          <View className="h-8 w-[1px] bg-white/10" />
                          <View>
                            <Text className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                              Base Salary
                            </Text>
                            <Text className="text-sm font-medium text-emerald-400">
                              ${currentJob.salary.min / 1000}k - ${currentJob.salary.max / 1000}k
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row flex-wrap gap-2 mb-3">
                          {currentJob.visaSponsored && (
                            <View className="bg-gold/20 border border-gold/30 px-3 py-1 rounded-full flex-row items-center gap-1">
                              <Ionicons name="globe" size={12} color="#F59E0B" />
                              <Text className="text-[11px] font-bold text-gold uppercase">Visa Sponsored</Text>
                            </View>
                          )}
                          {currentJob.tags.slice(0, 2).map((tag, index) => (
                            <View key={index} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                              <Text className="text-[11px] font-medium text-slate-300">{tag}</Text>
                            </View>
                          ))}
                        </View>

                        <Text className="text-xs text-slate-400 leading-relaxed" numberOfLines={3}>
                          {currentJob.description}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                </GestureDetector>
              </View>

              {/* Action Buttons */}
              <View className="flex-row items-center justify-between px-10 mt-8 mb-8">
                <TouchableOpacity
                  onPress={() => handleSkip(currentJob.id)}
                  className="w-16 h-16 rounded-full bg-white/5 border border-red-500/30 items-center justify-center"
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={32} color="#EF4444" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push(`/job-details/${currentJob.id}`)}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center"
                  activeOpacity={0.8}
                >
                  <Ionicons name="information" size={22} color="rgba(148, 163, 184, 0.8)" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleLike(currentJob.id)}
                  className="w-16 h-16 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/40"
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark" size={32} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
              {jobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  onPress={() => router.push(`/job-details/${job.id}`)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3"
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-start gap-4">
                    <Image
                      source={{ uri: job.logo }}
                      className="w-12 h-12 rounded-xl bg-white p-1"
                      style={{ resizeMode: 'contain' }}
                    />
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-1">
                          <Text className="text-base font-bold text-white mb-1">
                            {job.title}
                          </Text>
                          <Text className="text-sm text-slate-400">
                            {job.company} • {job.location}
                          </Text>
                        </View>
                        <View className="bg-primary/20 px-2 py-1 rounded-full">
                          <Text className="text-xs font-bold text-primary">
                            {job.matchScore}%
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row flex-wrap gap-2 mb-2">
                        {job.visaSponsored && (
                          <View className="bg-gold/20 border border-gold/30 px-2 py-1 rounded-full flex-row items-center gap-1">
                            <Ionicons name="globe" size={10} color="#F59E0B" />
                            <Text className="text-[10px] font-bold text-gold">VISA</Text>
                          </View>
                        )}
                        {job.tags.slice(0, 2).map((tag, index) => (
                          <View
                            key={index}
                            className="bg-white/5 border border-white/10 px-2 py-1 rounded-full"
                          >
                            <Text className="text-[10px] font-medium text-slate-300">
                              {tag}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <Text className="text-sm font-semibold text-emerald-400">
                        ${job.salary.min / 1000}k - ${job.salary.max / 1000}k
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <View className="h-32" />
            </ScrollView>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
