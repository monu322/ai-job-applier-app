import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../lib/stores/userStore';
import { apiClient } from '../lib/api/apiClient';
import type { UserProfile } from '../lib/types/user.types';

export default function PersonaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const personaId = params.id as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [expandedWorkItems, setExpandedWorkItems] = useState<Set<number>>(new Set());
  
  // Fallback to store if no ID provided (for backwards compatibility)
  const storeProfile = useUserStore((state) => state.getActivePersona());

  useEffect(() => {
    const fetchPersona = async () => {
      // If no ID, use store profile as fallback
      if (!personaId) {
        console.log('[Persona] No persona ID, using store profile');
        setProfile(storeProfile);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('[Persona] Fetching persona:', personaId);
        const data = await apiClient.getPersona(personaId);
        console.log('[Persona] Fetched data:', data);
        console.log('[Persona] Work history:', data.workHistory);
        console.log('[Persona] Work history length:', data.workHistory?.length);
        console.log('[Persona] Summary:', data.summary);
        console.log('[Persona] Education:', data.education);
        setProfile(data);
      } catch (err: any) {
        console.error('[Persona] Error fetching persona:', err);
        setError(err.message || 'Failed to load persona');
        // Fallback to store profile if API fails
        setProfile(storeProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchPersona();
  }, [personaId]);

  if (loading) {
    return (
      <View className="flex-1 bg-midnight items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-white mt-4">Loading persona...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-midnight items-center justify-center px-6">
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text className="text-white text-xl font-bold mt-4">Persona not found</Text>
        <Text className="text-slate-400 text-center mt-2">
          {error || 'Unable to load persona data'}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 bg-primary rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleWorkItem = (index: number) => {
    setExpandedWorkItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleFindJobs = () => {
    router.push('/(tabs)');
  };

  const handleJobMarket = () => {
    router.push('/(tabs)/market');
  };

  const handleImproveCV = () => {
    alert('CV improvement coming soon!');
  };

  const handleMenuOption = (option: string) => {
    setShowOptionsMenu(false);
    setTimeout(() => {
      alert(`${option} - Coming soon!`);
    }, 100);
  };

  return (
    <View className="flex-1 bg-midnight">
      <LinearGradient
        colors={['#0F172A', '#020617']}
        className="flex-1"
      >
        <SafeAreaView edges={['top']} className="flex-1">
          {/* Background decorations */}
          <View className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <View className="absolute top-1/2 -right-32 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={20} color="rgba(148, 163, 184, 1)" />
            </TouchableOpacity>
            <Text className="text-sm font-bold tracking-[0.2em] uppercase text-slate-300">
              Persona
            </Text>
            <TouchableOpacity
              onPress={() => setShowOptionsMenu(true)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center"
            >
              <Ionicons name="ellipsis-vertical" size={20} color="rgba(148, 163, 184, 1)" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Profile Card */}
            <View className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-4">
              <View className="flex-row items-center gap-5 mb-4">
                <View className="relative">
                  <View className="absolute -inset-1 bg-gradient-to-tr from-primary to-gold rounded-[22px] blur-sm opacity-30" />
                  <Image
                    source={{ uri: profile.avatar }}
                    className="relative w-20 h-20 rounded-[20px] border border-white/10"
                  />
                  <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0f1d] rounded-full" />
                </View>

                <View className="flex-1">
                  <Text className="text-2xl font-bold text-white mb-0.5">
                    {profile.name}
                  </Text>
                  <Text className="text-primary font-medium text-sm">{profile.title}</Text>
                  <View className="flex-row items-center gap-3 mt-3">
                    <View className="flex-row items-center">
                      <Ionicons name="location" size={14} color="rgba(148, 163, 184, 0.5)" />
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        {profile.location}
                      </Text>
                    </View>
                    <View className="h-3 w-[1px] bg-white/10" />
                    <View className="flex-row items-center">
                      <Ionicons name="briefcase" size={14} color="rgba(148, 163, 184, 0.5)" />
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        {profile.experience}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Stats Grid */}
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Salary Estimate
                </Text>
                <Text className="text-lg font-bold text-white tracking-tight">
                  ${profile.salaryRange.min / 1000}K - ${profile.salaryRange.max / 1000}K
                </Text>
                <View className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <View className="h-full w-3/4 bg-gold/40 rounded-full" />
                </View>
              </View>

              <View className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Market Demand
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-lg font-bold text-white tracking-tight capitalize">
                    {profile.marketDemand}
                  </Text>
                  <View className="flex-row gap-1 ml-auto">
                    <View className="w-1.5 h-3 bg-primary rounded-full" />
                    <View className="w-1.5 h-4 bg-primary rounded-full" />
                    <View className="w-1.5 h-5 bg-primary rounded-full" />
                    <View className="w-1.5 h-3 bg-white/10 rounded-full" />
                  </View>
                </View>
              </View>
            </View>

            {/* Professional Summary */}
            {profile.summary && (
              <View className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-4">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Professional Summary
                </Text>
                <Text className="text-sm text-slate-300 leading-relaxed">
                  {profile.summary}
                </Text>
              </View>
            )}

            {/* Core Skills */}
            <View className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Core Proficiencies
                </Text>
                <Text className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                  {profile.skills.length} Expert
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <View
                    key={index}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5"
                  >
                    <Text className="text-xs font-semibold text-slate-300">{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Education */}
            {profile.education && (
              <View className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-4">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Education
                </Text>
                <Text className="text-sm text-slate-200 font-medium">
                  {profile.education}
                </Text>
              </View>
            )}

            {/* Work History */}
            {profile.workHistory && profile.workHistory.length > 0 && (
              <View className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-4">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Work Experience
                </Text>
                <View className="space-y-3">
                  {profile.workHistory.map((work, index) => {
                    const isExpanded = expandedWorkItems.has(index);
                    const dateRange = work.start_date && work.end_date 
                      ? `${work.start_date} - ${work.end_date}`
                      : work.duration || '';
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleWorkItem(index)}
                        activeOpacity={0.7}
                        className="bg-white/5 border border-white/5 rounded-xl p-4"
                      >
                        <View className="flex-row justify-between items-start mb-2">
                          <View className="flex-1 pr-3">
                            <Text className="text-white font-bold text-sm mb-1">
                              {work.company}
                            </Text>
                            <Text className="text-primary font-medium text-xs">
                              {work.position}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-2">
                            <Ionicons 
                              name={isExpanded ? "chevron-up" : "chevron-down"} 
                              size={18} 
                              color="rgba(148, 163, 184, 0.6)" 
                            />
                          </View>
                        </View>
                        
                        {dateRange && (
                          <Text className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            {dateRange}
                          </Text>
                        )}
                        
                        {isExpanded && (
                          <View className="mt-4 pt-4 border-t border-white/5">
                            {work.achievements && work.achievements.length > 0 && (
                              <View className="mb-3">
                                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                  Key Achievements
                                </Text>
                                {work.achievements.map((achievement, achIndex) => (
                                  <View key={achIndex} className="flex-row gap-2 mb-1.5">
                                    <Text className="text-primary text-xs mt-0.5">•</Text>
                                    <Text className="flex-1 text-slate-300 text-xs leading-relaxed">
                                      {achievement}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            )}
                            
                            {work.skills && work.skills.length > 0 && (
                              <View>
                                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                  Technologies Used
                                </Text>
                                <View className="flex-row flex-wrap gap-1.5">
                                  {work.skills.map((skill, skillIndex) => (
                                    <View 
                                      key={skillIndex}
                                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/5"
                                    >
                                      <Text className="text-[10px] font-semibold text-slate-400">
                                        {skill}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* AI Intelligence Card */}
            <View className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-5 mb-4">
              <View className="flex-row items-center gap-3 mb-6">
                <View className="w-8 h-8 rounded-xl bg-primary/20 items-center justify-center">
                  <Ionicons name="sparkles" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text className="font-bold text-sm text-white">AI Global Intelligence</Text>
                  <Text className="text-[10px] text-slate-400 font-medium">
                    Real-time matching engine active
                  </Text>
                </View>
              </View>

              <View className="pb-4 border-b border-white/5 mb-4">
                <View className="flex-row items-end justify-between">
                  <View>
                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Global Matches
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-3xl font-bold text-gold tracking-tighter">
                        {profile.globalMatches.toLocaleString()}
                      </Text>
                      <Text className="text-gold/60 text-xs font-bold mb-1">+</Text>
                    </View>
                  </View>
                  <View className="text-right">
                    <Text className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Confidence
                    </Text>
                    <Text className="text-sm font-bold text-white">{profile.confidence}%</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center gap-3 py-3 px-4 bg-gold/10 rounded-2xl border border-gold/20">
                <View className="w-6 h-6 rounded-full bg-gold/20 items-center justify-center shrink-0">
                  <Ionicons name="globe" size={14} color="#F59E0B" />
                </View>
                <Text className="text-[11px] font-bold text-gold uppercase tracking-wider leading-tight">
                  Visa-friendly roles detected in 14 regions
                </Text>
              </View>
            </View>

            <View className="h-32" />
          </ScrollView>

          {/* Action Buttons - Fixed at bottom */}
          <View className="absolute bottom-0 left-0 right-0 px-6 pb-10">
            <LinearGradient
              colors={['transparent', '#020617', '#020617']}
              className="absolute inset-0 -top-20"
            />
            
            <View className="relative space-y-4">
              {/* Primary button */}
              <TouchableOpacity
                onPress={handleFindJobs}
                className="w-full h-16 bg-primary rounded-2xl overflow-hidden"
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-1 flex-row items-center justify-center gap-3"
                >
                  <Ionicons name="rocket" size={24} color="white" />
                  <Text className="text-white font-extrabold text-sm uppercase tracking-wide">
                    Find Jobs Now
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Secondary buttons */}
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={handleJobMarket}
                  className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl items-center justify-center"
                  activeOpacity={0.8}
                >
                  <Ionicons name="map" size={20} color="rgba(148, 163, 184, 0.8)" />
                  <Text className="text-slate-300 font-bold text-[11px] uppercase tracking-widest mt-1">
                    Job Market
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleImproveCV}
                  className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl items-center justify-center"
                  activeOpacity={0.8}
                >
                  <Ionicons name="create" size={20} color="rgba(148, 163, 184, 0.8)" />
                  <Text className="text-slate-300 font-bold text-[11px] uppercase tracking-widest mt-1">
                    Improve CV
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Options Menu Modal */}
      <Modal
        visible={showOptionsMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowOptionsMenu(false)}
          className="flex-1 bg-black/50"
          style={{ justifyContent: 'flex-start', paddingTop: 80, paddingRight: 20 }}
        >
          <View className="absolute top-20 right-6 bg-slate-800/95 border border-white/10 rounded-2xl overflow-hidden w-56">
            <TouchableOpacity
              onPress={() => handleMenuOption('Generate CV')}
              className="flex-row items-center gap-3 px-4 py-4 border-b border-white/5"
              activeOpacity={0.7}
            >
              <Ionicons name="document-text" size={20} color="#3B82F6" />
              <Text className="text-white font-semibold">Generate CV</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleMenuOption('View Improvements')}
              className="flex-row items-center gap-3 px-4 py-4 border-b border-white/5"
              activeOpacity={0.7}
            >
              <Ionicons name="trending-up" size={20} color="#10B981" />
              <Text className="text-white font-semibold">View Improvements</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleMenuOption('Things to Learn')}
              className="flex-row items-center gap-3 px-4 py-4"
              activeOpacity={0.7}
            >
              <Ionicons name="school" size={20} color="#F59E0B" />
              <Text className="text-white font-semibold">Things to Learn</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
