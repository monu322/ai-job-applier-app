import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/contexts/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await register(email, password, name);
      router.replace('/onboarding');
    } catch (err) {
      // Error already shown by AuthContext
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert('Coming Soon', 'Google Sign-in will be available soon!');
  };

  return (
    <View className="flex-1 bg-midnight">
      <LinearGradient
        colors={['#1E293B', '#0F172A', '#020617']}
        className="flex-1"
      >
        <SafeAreaView edges={['top']} className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-1 justify-center px-8 py-8">
              {/* Header */}
              <View className="flex-row items-center mb-8">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center mr-4"
                >
                  <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>
                <View>
                  <Text className="text-3xl font-bold text-white">Create Account</Text>
                  <Text className="text-slate-400 mt-1">Start your AI-powered job search</Text>
                </View>
              </View>

              <View className="space-y-4">
                {/* Name Field */}
                <View>
                  <Text className="text-sm text-slate-400 mb-2">Full Name</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="John Doe"
                    placeholderTextColor="rgba(148, 163, 184, 0.5)"
                    className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white"
                  />
                </View>

                {/* Email Field */}
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

                {/* Password Field */}
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
                  <Text className="text-xs text-slate-500 mt-1">Minimum 6 characters</Text>
                </View>

                {/* Confirm Password Field */}
                <View>
                  <Text className="text-sm text-slate-400 mb-2">Confirm Password</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(148, 163, 184, 0.5)"
                    secureTextEntry
                    className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white"
                  />
                </View>

                {/* Email Signup Button */}
                <TouchableOpacity
                  onPress={handleEmailSignup}
                  disabled={isLoading}
                  className="bg-primary py-4 rounded-2xl mt-6"
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <View className="flex-row items-center justify-center gap-2">
                      <Ionicons name="mail" size={20} color="white" />
                      <Text className="text-white font-bold text-center">Sign Up with Email</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px] bg-white/10" />
                  <Text className="text-slate-500 px-4 text-sm">OR</Text>
                  <View className="flex-1 h-[1px] bg-white/10" />
                </View>

                {/* Google Signup Button */}
                <TouchableOpacity
                  onPress={handleGoogleSignup}
                  className="bg-white/5 border border-white/10 py-4 rounded-2xl"
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center justify-center gap-3">
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text className="text-white font-semibold">Continue with Google</Text>
                  </View>
                </TouchableOpacity>

                {/* Login Link */}
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text className="text-slate-400 text-center mt-6">
                    Already have an account?{' '}
                    <Text className="text-primary font-semibold">Login</Text>
                  </Text>
                </TouchableOpacity>

                {/* Terms */}
                <Text className="text-xs text-slate-500 text-center mt-6">
                  By signing up, you agree to our{' '}
                  <Text className="text-primary">Terms of Service</Text> and{' '}
                  <Text className="text-primary">Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
