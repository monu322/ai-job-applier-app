import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJobStore } from '../../lib/stores/jobStore';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const jobs = useJobStore((state) => state.jobs);
  
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <View className="flex-1 bg-background-dark items-center justify-center">
        <Text className="text-white">Job not found</Text>
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
          <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">Job Details</Text>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center">
              <Ionicons name="bookmark-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Company & Title */}
            <View className="items-center py-4 mb-6">
              <Image
                source={{ uri: job.logo }}
                className="w-20 h-20 rounded-2xl bg-white mb-4"
              />
              <Text className="text-2xl font-bold text-white text-center mb-2">
                {job.title}
              </Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="business" size={14} color="rgba(148, 163, 184, 0.6)" />
                <Text className="text-slate-400">
                  {job.company} • {job.location}
                </Text>
              </View>

              <View className="flex-row gap-2 mt-4">
                {job.visaSponsored && (
                  <View className="bg-gold/20 border border-gold/30 px-3 py-1 rounded-full flex-row items-center gap-1">
                    <Ionicons name="globe" size={12} color="#F59E0B" />
                    <Text className="text-[10px] font-bold text-gold uppercase">
                      VISA SPONSORED
                    </Text>
                  </View>
                )}
                <View className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-blue-400 uppercase">
                    {job.remote ? 'REMOTE' : 'ON-SITE'}
                  </Text>
                </View>
              </View>
            </View>

            {/* AI Match */}
            <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="sparkles" size={20} color="#3B82F6" />
                <Text className="font-bold text-white">AI Match Analysis</Text>
              </View>
              <Text className="text-sm text-slate-300 leading-relaxed mb-4">
                Your background matches this role perfectly. Strong alignment in technical skills and experience level.
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between text-xs font-bold text-slate-400 mb-1">
                  <Text className="text-slate-400 text-xs">Interview Probability</Text>
                  <Text className="text-blue-400 text-xs">High - {job.matchScore}%</Text>
                </View>
                <View className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${job.matchScore}%` }}
                  />
                </View>
              </View>
            </View>

            {/* Salary */}
            <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Salary & Benefits
              </Text>
              <Text className="text-3xl font-bold text-white mb-4">
                ${job.salary.min / 1000}K - ${job.salary.max / 1000}K
              </Text>
              <View className="space-y-3">
                {job.benefits.map((benefit, index) => (
                  <View key={index} className="flex-row items-center gap-3">
                    <Ionicons name="checkmark-circle" size={18} color="#F59E0B" />
                    <Text className="text-slate-300 text-sm flex-1">{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Description */}
            <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
              <Text className="text-lg font-bold text-white mb-3">Role Overview</Text>
              <Text className="text-sm text-slate-300 leading-relaxed">
                {job.description}
              </Text>
            </View>

            {/* Requirements */}
            <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
              <Text className="text-lg font-bold text-white mb-3">Requirements</Text>
              <View className="space-y-2">
                {job.requirements.map((req, index) => (
                  <View key={index} className="flex-row items-start gap-3">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <Text className="text-sm text-slate-300 flex-1">{req}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tags */}
            <View className="flex-row flex-wrap gap-2 mb-32">
              {job.tags.map((tag, index) => (
                <View
                  key={index}
                  className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl"
                >
                  <Text className="text-xs font-semibold text-slate-300">{tag}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View className="absolute bottom-0 left-0 right-0 px-6 pb-10">
            <LinearGradient
              colors={['transparent', '#020617', '#020617']}
              className="absolute inset-0 -top-20"
            />
            <TouchableOpacity
              onPress={() => alert('Apply feature coming soon!')}
              className="w-full bg-primary py-4 rounded-2xl"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center gap-3">
                <Ionicons name="flash" size={24} color="white" />
                <Text className="text-white font-bold text-base uppercase">
                  APPLY WITH AI AGENT
                </Text>
              </View>
            </TouchableOpacity>
            <Text className="text-center text-[10px] text-slate-500 mt-4">
              Astra AI will tailor your CV and submit the application for you.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
