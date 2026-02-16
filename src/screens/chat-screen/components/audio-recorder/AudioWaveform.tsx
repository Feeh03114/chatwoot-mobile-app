import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { tailwind } from '@/theme';

const BAR_WIDTH = 3;
const BAR_GAP = 2;
const BAR_STEP = BAR_WIDTH + BAR_GAP;
const MAX_BAR_HEIGHT = 24;
const MIN_BAR_HEIGHT = 3;

export const normalizeMetering = (dB: number | undefined): number => {
  if (dB === undefined || dB === null) return 0;
  return Math.min(1, Math.max(0, (dB + 60) / 60));
};

const WaveformBar = React.memo(({ amplitude }: { amplitude: number }) => {
  const height = MIN_BAR_HEIGHT + amplitude * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(height, {
        damping: 15,
        stiffness: 300,
        mass: 0.5,
      }),
    };
  }, [height]);

  return (
    <Animated.View
      style={[
        tailwind.style('rounded-full bg-whiteA-A11'),
        { width: BAR_WIDTH },
        animatedStyle,
      ]}
    />
  );
});

type AudioWaveformProps = {
  amplitudes: number[];
};

export const AudioWaveform = React.memo(({ amplitudes }: AudioWaveformProps) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const maxBars = useMemo(() => {
    if (containerWidth === 0) return 0;
    return Math.floor(containerWidth / BAR_STEP);
  }, [containerWidth]);

  const visibleAmplitudes = useMemo(() => {
    if (maxBars === 0) return [];
    const start = Math.max(0, amplitudes.length - maxBars);
    return amplitudes.slice(start);
  }, [amplitudes, maxBars]);

  return (
    <View
      onLayout={onLayout}
      style={tailwind.style('flex-1 flex-row items-center justify-end mx-2 overflow-hidden')}>
      <View style={tailwind.style('flex-row items-center gap-[2px]')}>
        {visibleAmplitudes.map((amp, index) => (
          <WaveformBar key={index} amplitude={amp} />
        ))}
      </View>
    </View>
  );
});
