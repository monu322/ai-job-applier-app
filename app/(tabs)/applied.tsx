import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppliedScreen() {
  return (
    <View className="flex-1 bg-background-dark">
      <LinearGradient
        colors={['#1E293B', '#0F172A', '#020617']}
        className="flex-1 items-center justify-center"
      >
        <SafeAreaView className="flex-1 items-center justify-center">
          <Ionicons name="briefcase" size={64} color="#3B82F6" />
          <Text className="text-2xl font-bold text-white mt-4">
            Applied Jobs
          </Text>
          <Text className="text-slate-400 mt-2">No applications yet</Text>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
