import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJobStore } from '../../lib/stores/jobStore';
import { useUserStore, initializeMockProfile } from '../../lib/stores/userStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const jobs = useJobStore((state) => state.jobs);
  const personas = useUserStore((state) => state.personas);
  const activePersonaId = useUserStore((state) => state.activePersonaId);
  const setActivePersona = useUserStore((state) => state.setActivePersona);
  const profile = useUserStore((state) => state.getActivePersona());
  const router = useRouter();
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);

  // Initialize personas if not already done
  useEffect(() => {
    if (personas.length === 0) {
      initializeMockProfile();
    }
  }, [personas.length]);

  // Mock application stats (will be from store later)
  const applicationStats = {
    totalApplied: 18,
    interviewsSet: 5,
    inReview: 8,
    weeklyData: [
      { day: 'MON', count: 2 },
      { day: 'TUE', count: 3 },
      { day: 'WED', count: 5 },
      { day: 'THU', count: 3 },
      { day: 'FRI', count: 2 },
      { day: 'SAT', count: 1 },
      { day: 'SUN', count: 2 },
    ],
  };

  const maxCount = Math.max(...applicationStats.weeklyData.map(d => d.count));

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
              <View className="flex-row items-center gap-2">
                <Text className="text-xs font-bold tracking-widest text-primary uppercase">
                  ASTRA APPLY
                </Text>
              </View>
              <View className="flex-row items-center gap-4">
                <Ionicons name="notifications-outline" size={24} color="rgba(255,255,255,0.7)" />
                {profile && (
                  <TouchableOpacity onPress={() => router.push('/persona')}>
                    <Image
                      source={{ uri: profile.avatar }}
                      className="w-8 h-8 rounded-full border border-primary"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <Text className="text-2xl font-bold text-white mb-2">Home</Text>
            <Text className="text-sm text-slate-400">Your personalized job search dashboard</Text>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Active Persona Card */}
            {profile && (
              <TouchableOpacity
                onPress={() => setShowPersonaSelector(true)}
                className="mb-4 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-4"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-4">
                  <Image
                    source={{ uri: profile.avatar }}
                    className="w-16 h-16 rounded-2xl border border-white/10"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-xs text-primary font-bold uppercase tracking-wider">Active Persona</Text>
                      <Ionicons name="chevron-down" size={14} color="#3B82F6" />
                    </View>
                    <Text className="text-lg font-bold text-white">{profile.name}</Text>
                    <Text className="text-sm text-slate-300">{profile.title}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <Ionicons name="sparkles" size={12} color="#F59E0B" />
                      <Text className="text-xs text-gold font-bold">
                        {profile.globalMatches.toLocaleString()} Matches
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push('/persona');
                    }}
                    className="bg-primary/20 w-9 h-9 rounded-full items-center justify-center"
                  >
                    <Ionicons name="arrow-forward" size={18} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}

            {/* Quick Actions */}
            <View className="mb-4">
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/ai-agent')}
                  className="flex-1 bg-primary/10 border border-primary/30 rounded-2xl p-3 flex-row items-center gap-3"
                  activeOpacity={0.8}
                >
                  <Ionicons name="rocket" size={22} color="#3B82F6" />
                  <View className="flex-1">
                    <Text className="text-white font-bold text-sm">Find Jobs</Text>
                    <Text className="text-xs text-slate-400">Swipe & Match</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/market')}
                  className="flex-1 bg-gold/10 border border-gold/30 rounded-2xl p-3 flex-row items-center gap-3"
                  activeOpacity={0.8}
                >
                  <Ionicons name="globe" size={22} color="#F59E0B" />
                  <View className="flex-1">
                    <Text className="text-white font-bold text-sm">Job Market</Text>
                    <Text className="text-xs text-slate-400">Insights</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Application Stats */}
            <Text className="text-lg font-bold text-white mb-3">Application Activity</Text>

            {/* Stats Cards */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4">
                <Text className="text-3xl font-bold text-white">{applicationStats.totalApplied}</Text>
                <Text className="text-xs text-slate-400 uppercase tracking-wider">Applied Today</Text>
              </View>
              <View className="flex-1 bg-white/5 border border-blue-500/30 rounded-2xl p-4">
                <Text className="text-3xl font-bold text-blue-400">{applicationStats.interviewsSet}</Text>
                <Text className="text-xs text-slate-400 uppercase tracking-wider">Interviews Set</Text>
              </View>
            </View>

            {/* Interview Probability */}
            <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
              <View className="flex-row justify-between items-end mb-3">
                <View>
                  <Text className="text-sm font-semibold text-white">Interview Probability</Text>
                  <Text className="text-xs text-slate-400">Based on profile matches</Text>
                </View>
                <Text className="text-2xl font-bold text-emerald-400">82%</Text>
              </View>
              <View className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                <LinearGradient
                  colors={['#3B82F6', '#10B981']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-full rounded-full"
                  style={{ width: '82%' }}
                />
              </View>
            </View>

            {/* Weekly Application Chart */}
            <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
              <Text className="text-sm font-semibold text-white mb-4">This Week's Activity</Text>
              <View className="flex-row items-end justify-between gap-2" style={{ height: 96 }}>
                {applicationStats.weeklyData.map((item, index) => {
                  const heightPercent = (item.count / maxCount) * 100;
                  const heightPx = (item.count / maxCount) * 80;
                  const isToday = item.day === 'WED';
                  return (
                    <View key={index} className="flex-1 items-center" style={{ height: '100%', justifyContent: 'flex-end' }}>
                      <View style={{ height: heightPx, width: '100%' }} className={`rounded-t ${isToday ? 'bg-primary' : 'bg-slate-700'}`} />
                      <Text className={`text-[10px] ${isToday ? 'text-primary' : 'text-slate-500'} font-medium mt-2`}>
                        {item.day}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Recent Activity */}
            <Text className="text-lg font-bold text-white mb-3">Recent Activity</Text>
            <View className="space-y-3 mb-4">
              <View className="bg-white/5 border border-white/10 rounded-xl p-3 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg bg-white/5 items-center justify-center">
                  <Text className="text-xl">🚀</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-white">Product Manager</Text>
                  <Text className="text-xs text-slate-400">Microsoft • Applied 2h ago</Text>
                </View>
                <View className="px-2 py-1 rounded bg-blue-500/20">
                  <Text className="text-[10px] font-bold text-blue-400 uppercase">Applied</Text>
                </View>
              </View>

              <View className="bg-white/5 border border-emerald-500/20 rounded-xl p-3 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg bg-white/5 items-center justify-center">
                  <Text className="text-xl">💼</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-white">Lead Designer</Text>
                  <Text className="text-xs text-slate-400">Google • Interview Set</Text>
                </View>
                <View className="px-2 py-1 rounded bg-emerald-500/20">
                  <Text className="text-[10px] font-bold text-emerald-400 uppercase">Interview</Text>
                </View>
              </View>

              <View className="bg-white/5 border border-white/10 rounded-xl p-3 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg bg-white/5 items-center justify-center">
                  <Text className="text-xl">⚙️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-white">Operations Lead</Text>
                  <Text className="text-xs text-slate-400">Amazon • In Review</Text>
                </View>
                <View className="px-2 py-1 rounded bg-amber-500/20">
                  <Text className="text-[10px] font-bold text-amber-400 uppercase">Review</Text>
                </View>
              </View>
            </View>

            <View className="h-32" />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* Persona Selector Modal */}
      <Modal
        visible={showPersonaSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPersonaSelector(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowPersonaSelector(false)}
          className="flex-1 bg-black/60"
          style={{ justifyContent: 'flex-end' }}
        >
          <TouchableOpacity activeOpacity={1} className="bg-midnight border-t border-white/10 rounded-t-3xl p-6" style={{ maxHeight: '70%' }}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-white">Select Persona</Text>
              <TouchableOpacity onPress={() => setShowPersonaSelector(false)}>
                <Ionicons name="close" size={24} color="rgba(148, 163, 184, 0.8)" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {personas.map((persona) => (
                <TouchableOpacity
                  key={persona.id}
                  onPress={() => {
                    setActivePersona(persona.id);
                    setShowPersonaSelector(false);
                  }}
                  className={`mb-3 rounded-2xl p-4 border ${
                    persona.id === activePersonaId
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-4">
                    <Image
                      source={{ uri: persona.avatar }}
                      className="w-14 h-14 rounded-2xl border border-white/10"
                    />
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-white">{persona.name}</Text>
                      <Text className="text-sm text-slate-300">{persona.title}</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Text className="text-xs text-gold font-bold">
                          {persona.globalMatches.toLocaleString()} Matches
                        </Text>
                        <Text className="text-xs text-slate-400">•</Text>
                        <Text className="text-xs text-slate-400">{persona.confidence}% Confidence</Text>
                      </View>
                    </View>
                    {persona.id === activePersonaId && (
                      <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {/* Add New Persona Button */}
              <TouchableOpacity
                onPress={() => {
                  setShowPersonaSelector(false);
                  router.push('/onboarding');
                }}
                className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-4 items-center"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                    <Ionicons name="add" size={24} color="#3B82F6" />
                  </View>
                  <Text className="text-white font-semibold">Create New Persona</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
