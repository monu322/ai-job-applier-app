import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
      router.replace('/persona');
    } catch (err) {
      // Error already shown by AuthContext
    }
  };

  return (
    <View className="flex-1 bg-midnight">
      <LinearGradient
        colors={['#1E293B', '#0F172A', '#020617']}
        className="flex-1"
      >
        <SafeAreaView edges={['top']} className="flex-1 px-6">
          <View className="flex-1 justify-center">
            <Text className="text-3xl font-bold text-white mb-2 text-center">
              Welcome Back
            </Text>
            <Text className="text-slate-400 text-center mb-8">
              Login to continue your job search
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm text-slate-400 mb-2">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(148, 163, 184, 0.5)"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white"
                />
              </View>

              <View>
                <Text className="text-sm text-slate-400 mb-2">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(148, 163, 184, 0.5)"
                  secureTextEntry
                  className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white"
                />
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className="bg-primary py-4 rounded-2xl mt-4"
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-center">Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/onboarding')}>
                <Text className="text-slate-400 text-center mt-4">
                  Don't have an account?{' '}
                  <Text className="text-primary font-semibold">Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
