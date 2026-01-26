import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { apiClient } from '../lib/api/apiClient';

type AnalysisStep = {
  id: number;
  title: string;
  subtitle: string;
  status: 'pending' | 'in-progress' | 'complete' | 'error';
};

export default function CVAnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const floatAnim = useSharedValue(0);
  const scanAnim = useSharedValue(0);
  
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: 1, title: 'Uploading CV', subtitle: 'Sending file to server', status: 'pending' },
    { id: 2, title: 'Building Persona', subtitle: 'Skills & experience mapped', status: 'pending' },
    { id: 3, title: 'Optimizing Profile', subtitle: 'Generating ATS-ready tags', status: 'pending' },
    { id: 4, title: 'Mapping Job Market', subtitle: 'Finding matches in 40+ countries', status: 'pending' },
  ]);
  
  const [error, setError] = useState<string | null>(null);

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

    // Start the upload and analysis process
    if (params.fileUri) {
      processCV();
    } else {
      // No file, use mock data for demo
      processMockCV();
    }
  }, []);

  const updateStep = (stepId: number, status: AnalysisStep['status'], subtitle?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, ...(subtitle && { subtitle }) } : step
    ));
  };

  const processMockCV = async () => {
    // Simulate step-by-step progress
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStep(1, 'in-progress');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStep(1, 'complete');
    updateStep(2, 'in-progress');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStep(2, 'complete');
    updateStep(3, 'in-progress');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStep(3, 'complete');
    updateStep(4, 'in-progress');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStep(4, 'complete');
    
    // Initialize profile and navigate
    await new Promise(resolve => setTimeout(resolve, 500));
    initializeMockProfile();
    router.replace('/persona');
  };

  const processCV = async () => {
    try {
      // Step 1: Uploading CV
      updateStep(1, 'in-progress');
      
      try {
        // Prepare file for upload using blob
        const response = await fetch(params.fileUri as string);
        const blob = await response.blob();
        
        const file = new File([blob], params.fileName as string, {
          type: params.fileType as string || 'application/pdf',
        });
        
        // Upload CV - this now handles parsing AND persona creation
        const persona = await apiClient.uploadCv(file);
        
        // Update step 1 subtitle to show upload complete
        setSteps(prev => prev.map(step => 
          step.id === 1 ? { ...step, status: 'complete', subtitle: 'Upload complete' } : step
        ));
        
        updateStep(2, 'in-progress');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Step 2: Building Persona (already done by backend)
        updateStep(2, 'complete');
        updateStep(3, 'in-progress');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Step 3: Optimizing Profile (already done by backend)
        updateStep(3, 'complete');
        updateStep(4, 'in-progress');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Step 4: Complete
        updateStep(4, 'complete');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navigate to the newly created persona page with the ID
        console.log('[CV Analysis] Created persona:', persona);
        router.replace(`/persona?id=${persona.id}`);
        
      } catch (apiError: any) {
        console.error('API Error:', apiError);
        const errorMessage = apiError.message || 'Failed to process CV';
        setError(errorMessage);
        
        // Find the current step (first in-progress) and mark it as error
        const currentStep = steps.find(s => s.status === 'in-progress');
        if (currentStep) {
          updateStep(currentStep.id, 'error', errorMessage);
        }
        
        // Wait a bit to show the error
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fall back to mock profile for demo
        Alert.alert(
          'Demo Mode',
          'CV parsing is not available. Using demo profile instead.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset steps before starting mock CV
                setSteps([
                  { id: 1, title: 'Uploading CV', subtitle: 'Sending file to server', status: 'pending' },
                  { id: 2, title: 'Building Persona', subtitle: 'Skills & experience mapped', status: 'pending' },
                  { id: 3, title: 'Optimizing Profile', subtitle: 'Generating ATS-ready tags', status: 'pending' },
                  { id: 4, title: 'Mapping Job Market', subtitle: 'Finding matches in 40+ countries', status: 'pending' },
                ]);
                setError(null);
                processMockCV();
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Error processing CV:', error);
      const errorMessage = error.message || 'Failed to process CV';
      setError(errorMessage);
      
      // Find the current step (first in-progress) and mark it as error
      const currentStep = steps.find(s => s.status === 'in-progress');
      if (currentStep) {
        updateStep(currentStep.id, 'error', errorMessage);
      }
      
      // Wait a bit to show the error
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Error',
        'Failed to process your CV. Would you like to try demo mode?',
        [
          {
            text: 'Cancel',
            onPress: () => router.back(),
            style: 'cancel',
          },
          {
            text: 'Demo Mode',
            onPress: () => {
              // Reset steps before starting mock CV
              setSteps([
                { id: 1, title: 'Uploading CV', subtitle: 'Sending file to server', status: 'pending' },
                { id: 2, title: 'Building Persona', subtitle: 'Skills & experience mapped', status: 'pending' },
                { id: 3, title: 'Optimizing Profile', subtitle: 'Generating ATS-ready tags', status: 'pending' },
                { id: 4, title: 'Mapping Job Market', subtitle: 'Finding matches in 40+ countries', status: 'pending' },
              ]);
              setError(null);
              processMockCV();
            },
          },
        ]
      );
    }
  };

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const scanStyle = useAnimatedStyle(() => ({
    top: `${scanAnim.value * 100}%`,
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${scanAnim.value * 360}deg` }],
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
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center"
            >
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
            {steps.map((step) => (
              <View key={step.id} className={`flex-row items-center gap-4 ${step.status === 'pending' ? 'opacity-40' : ''}`}>
                {step.status === 'complete' ? (
                  <View className="w-8 h-8 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30">
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                ) : step.status === 'error' ? (
                  <View className="w-8 h-8 rounded-full bg-red-500/20 border-2 border-red-500 items-center justify-center shadow-lg shadow-red-500/30">
                    <Ionicons name="close" size={16} color="#EF4444" />
                  </View>
                ) : step.status === 'in-progress' ? (
                  <View className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary items-center justify-center relative">
                    <Animated.View style={rotateStyle}>
                      <Ionicons name="sync" size={16} color="#3B82F6" />
                    </Animated.View>
                    <View className="absolute -inset-1 border border-primary/50 rounded-full animate-pulse" />
                  </View>
                ) : (
                  <View className="w-8 h-8 rounded-full bg-slate-800 items-center justify-center">
                    <View className="w-2 h-2 bg-slate-400 rounded-full" />
                  </View>
                )}
                <View className="flex-1">
                  <Text className={`text-sm font-semibold ${
                    step.status === 'error' ? 'text-red-500' : 
                    step.status === 'in-progress' ? 'text-primary' : 
                    'text-white'
                  }`}>
                    {step.title}
                  </Text>
                  <Text className={`text-xs ${
                    step.status === 'error' ? 'text-red-400' : 
                    step.status === 'in-progress' ? 'text-primary/70' : 
                    'text-slate-500'
                  }`}>
                    {step.status === 'in-progress' ? `${step.subtitle}...` : step.subtitle}
                  </Text>
                </View>
              </View>
            ))}

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
