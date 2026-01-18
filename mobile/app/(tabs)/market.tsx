import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function MarketScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('Worldwide');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const pulse1 = useSharedValue(1);
  const mapScale = useSharedValue(1);
  const mapX = useSharedValue(0);
  const mapY = useSharedValue(0);

  const locations = ['Worldwide', 'USA', 'UK', 'Germany', 'UAE', 'India', 'Australia'];

  // Map zoom coordinates for each region
  const regionCoords: Record<string, { scale: number; x: number; y: number }> = {
    'Worldwide': { scale: 1, x: 0, y: 0 },
    'USA': { scale: 2, x: 100, y: -50 },
    'UK': { scale: 2.5, x: -100, y: -30 },
    'Germany': { scale: 2.5, x: -120, y: -40 },
    'UAE': { scale: 2.5, x: -180, y: -60 },
    'India': { scale: 2.5, x: -220, y: -70 },
    'Australia': { scale: 2.5, x: -280, y: -150 },
  };

  // Pulse animation
  pulse1.value = withRepeat(
    withSequence(
      withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
    ),
    -1,
    false
  );

  const pulseStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse1.value }],
  }));

  const mapStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: mapScale.value },
      { translateX: mapX.value },
      { translateY: mapY.value },
    ],
  }));

  const handleLocationSelect = (location: string) => {
    const coords = regionCoords[location];
    mapScale.value = withTiming(coords.scale, { duration: 500 });
    mapX.value = withTiming(coords.x, { duration: 500 });
    mapY.value = withTiming(coords.y, { duration: 500 });
    setSelectedLocation(location);
    setShowLocationPicker(false);
  };

  return (
    <View className="flex-1 bg-midnight">
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
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            <View className="items-center">
              <Text className="text-xl font-bold text-white">Global Job Market</Text>
              <Text className="text-[10px] uppercase tracking-widest text-primary font-bold">
                Astra Apply Live Insight
              </Text>
            </View>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center">
              <Ionicons name="share-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Location Selector */}
          <View className="px-6 mb-4">
            <TouchableOpacity
              onPress={() => setShowLocationPicker(true)}
              className="bg-white/5 border border-white/10 rounded-full px-4 py-3 flex-row items-center justify-between"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="globe" size={18} color="#3B82F6" />
                <Text className="text-white font-semibold">{selectedLocation}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="rgba(148, 163, 184, 0.6)" />
            </TouchableOpacity>
          </View>

          {/* Map visualization */}
          <View className="flex-1 relative px-6">
            <View className="flex-1 bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden relative mb-4">
              {/* World Map Image with zoom */}
              <Animated.View style={[mapStyle, { width: '100%', height: '100%' }]}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1200px-Equirectangular_projection_SW.jpg' }}
                  style={{ width: '100%', height: '100%', opacity: 0.2 }}
                  resizeMode="cover"
                />
                
                {/* Map pins */}
                <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                  <Animated.View style={[pulseStyle1, { position: 'absolute', top: '35%', left: '20%' }]}>
                    <Ionicons name="location" size={24} color="#F59E0B" />
                  </Animated.View>
                  
                  <View style={{ position: 'absolute', top: '30%', left: '48%' }}>
                    <Ionicons name="location" size={20} color="#F59E0B" />
                  </View>
                  
                  <View style={{ position: 'absolute', top: '32%', left: '52%' }}>
                    <Ionicons name="location" size={18} color="#F59E0B" />
                  </View>
                  
                  <View style={{ position: 'absolute', top: '42%', left: '58%' }}>
                    <Ionicons name="location" size={16} color="#3B82F6" />
                  </View>
                  
                  <View style={{ position: 'absolute', top: '45%', left: '68%' }}>
                    <Ionicons name="location" size={14} color="#3B82F6" />
                  </View>
                  
                  <View style={{ position: 'absolute', top: '70%', left: '82%' }}>
                    <Ionicons name="location" size={12} color="#3B82F6" />
                  </View>
                </View>
              </Animated.View>

              {/* Legend */}
              <View className="absolute top-4 right-4 space-y-2">
                <View className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-full flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full bg-gold" />
                  <Text className="text-[9px] text-white uppercase font-semibold">Visa</Text>
                </View>
                <View className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-full flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full bg-primary" />
                  <Text className="text-[9px] text-white uppercase font-semibold">Standard</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Cards */}
          <View className="px-6 pb-28 space-y-4">
            <View className="flex-row gap-3">
              <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Top Markets
                  </Text>
                  <Ionicons name="trending-up" size={14} color="#3B82F6" />
                </View>
                <View className="space-y-2.5">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[10px] text-white font-medium w-8">USA</Text>
                    <View className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <View className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[10px] text-white font-medium w-8">GER</Text>
                    <View className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <View className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[10px] text-white font-medium w-8">UAE</Text>
                    <View className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <View className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
                    </View>
                  </View>
                </View>
              </View>

              <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center justify-center">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Remote Score
                </Text>
                <Text className="text-xl font-bold text-white">8.4</Text>
                <Text className="text-[9px] text-gold font-bold uppercase mt-1">Peak Flex</Text>
              </View>
            </View>

            {/* Salary Distribution */}
            <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Salary Distribution
                </Text>
                <View className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md">
                  <Text className="text-[10px] text-primary font-bold">AVG $125K</Text>
                </View>
              </View>
              <View className="flex-row items-end justify-between gap-1.5 px-1" style={{ height: 56 }}>
                <View style={{ flex: 1, height: '20%' }} className="bg-white/5 rounded-t-sm" />
                <View style={{ flex: 1, height: '35%' }} className="bg-white/10 rounded-t-sm" />
                <View style={{ flex: 1, height: '55%' }} className="bg-white/20 rounded-t-sm" />
                <View style={{ flex: 1, height: '90%' }} className="bg-primary/80 rounded-t-sm" />
                <View style={{ flex: 1, height: '75%' }} className="bg-primary/60 rounded-t-sm" />
                <View style={{ flex: 1, height: '40%' }} className="bg-white/15 rounded-t-sm" />
                <View style={{ flex: 1, height: '15%' }} className="bg-white/5 rounded-t-sm" />
              </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/ai-agent')}
              className="w-full py-4 rounded-2xl mt-2"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#1D4ED8', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 rounded-2xl"
              >
                <View className="flex-row items-center justify-center gap-3">
                  <Text className="text-base text-white font-bold">View Matching Jobs</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowLocationPicker(false)}
          className="flex-1 bg-black/60"
          style={{ justifyContent: 'flex-end' }}
        >
          <TouchableOpacity activeOpacity={1} className="bg-midnight border-t border-white/10 rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-white">Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                <Ionicons name="close" size={24} color="rgba(148, 163, 184, 0.8)" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {locations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleLocationSelect(location)}
                  className={`mb-3 rounded-2xl p-4 border flex-row items-center justify-between ${
                    location === selectedLocation
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="location" size={20} color={location === selectedLocation ? '#3B82F6' : '#94A3B8'} />
                    <Text className="text-white font-semibold">{location}</Text>
                  </View>
                  {location === selectedLocation && (
                    <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
