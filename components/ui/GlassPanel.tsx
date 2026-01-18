import React from 'react';
import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassPanelProps extends ViewProps {
  intensity?: number;
  children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  intensity = 20,
  children,
  className,
  ...props
}) => {
  return (
    <View className={`overflow-hidden rounded-2xl ${className || ''}`} {...props}>
      <BlurView intensity={intensity} tint="dark" className="flex-1">
        <View className="bg-white/5 border border-white/10 flex-1">
          {children}
        </View>
      </BlurView>
    </View>
  );
};
