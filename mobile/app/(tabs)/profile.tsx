import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore, initializeMockProfile } from '../../lib/stores/userStore';

export default function ProfileScreen() {
  const personas = useUserStore((state) => state.personas);
  const masterUser = useUserStore((state) => state.masterUser);

  // Initialize personas if not already done
  useEffect(() => {
    if (personas.length === 0) {
      initializeMockProfile();
    }
  }, [personas.length]);

  if (!masterUser) {
    return (
      <View className="flex-1 bg-midnight items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  // Calculate total stats across all personas
  const totalMatches = personas.reduce((sum, p) => sum + p.globalMatches, 0);
  const avgConfidence = personas.length > 0
    ? personas.reduce((sum, p) => sum + p.confidence, 0) / personas.length
    : 0;
  const totalSkills = new Set(personas.flatMap(p => p.skills)).size;

  const settingsItems = [
    { icon: 'person-outline', label: 'Edit Profile', color: '#3B82F6' },
    { icon: 'document-text-outline', label: 'My CV', color: '#10B981' },
    { icon: 'notifications-outline', label: 'Notifications', color: '#F59E0B' },
    { icon: 'lock-closed-outline', label: 'Privacy & Security', color: '#EF4444' },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#8B5CF6' },
    { icon: 'information-circle-outline', label: 'About', color: '#64748B' },
  ];

  return (
    <View className="flex-1 bg-midnight">
      <LinearGradient
        colors={['#1E293B', '#0F172A', '#020617']}
        className="flex-1"
      >
        <SafeAreaView edges={['top']} className="flex-1">
          {/* Background decorations */}
          <View className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

          {/* Header */}
          <View className="px-6 py-4">
            <Text className="text-2xl font-bold text-white mb-2">Profile</Text>
            <Text className="text-sm text-slate-400">Manage your account settings</Text>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* User Info Card */}
            <View className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
              <View className="flex-row items-center gap-4 mb-4">
                <View className="relative">
                  <Image
                    source={{ uri: masterUser.avatar }}
                    className="w-20 h-20 rounded-2xl border border-white/10"
                  />
                  <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-midnight rounded-full" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-white mb-1">{masterUser.name}</Text>
                  <Text className="text-sm text-primary mb-2">{masterUser.title}</Text>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="location" size={12} color="rgba(148, 163, 184, 0.6)" />
                    <Text className="text-xs text-slate-400">{masterUser.location}</Text>
                  </View>
                </View>
              </View>

              {/* Quick Stats */}
              <View className="flex-row justify-between pt-4 border-t border-white/5">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-white">
                    {totalMatches.toLocaleString()}
                  </Text>
                  <Text className="text-xs text-slate-400">Total Matches</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-gold">
                    {avgConfidence.toFixed(1)}%
                  </Text>
                  <Text className="text-xs text-slate-400">Avg Confidence</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary">
                    {personas.length}
                  </Text>
                  <Text className="text-xs text-slate-400">Personas</Text>
                </View>
              </View>
            </View>

            {/* Settings Items */}
            <View className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mb-6">
              {settingsItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center gap-4 px-4 py-4 ${
                    index < settingsItems.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                  activeOpacity={0.7}
                  onPress={() => alert(`${item.label} - Coming soon!`)}
                >
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <Text className="flex-1 text-white font-medium">{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color="rgba(148, 163, 184, 0.5)" />
                </TouchableOpacity>
              ))}
            </View>

            {/* App Info */}
            <View className="items-center mb-8">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-8 h-8 bg-primary/20 rounded-lg items-center justify-center">
                  <Ionicons name="sparkles" size={16} color="#3B82F6" />
                </View>
                <Text className="text-sm font-bold text-white">Astra Apply</Text>
              </View>
              <Text className="text-xs text-slate-500">Version 1.0.0</Text>
              <Text className="text-[10px] text-slate-600 mt-1">Premium Career Intelligence</Text>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              className="bg-red-500/10 border border-red-500/20 rounded-2xl py-4 mb-8"
              activeOpacity={0.8}
              onPress={() => alert('Logout - Coming soon!')}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text className="text-red-400 font-bold">Sign Out</Text>
              </View>
            </TouchableOpacity>

            <View className="h-32" />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
