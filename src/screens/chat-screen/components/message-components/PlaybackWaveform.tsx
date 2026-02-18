import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, useColorScheme, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { tailwind } from '@/theme';
import { MESSAGE_VARIANTS } from '@/constants';

const BAR_WIDTH = 3;
const BAR_GAP = 2;
const BAR_STEP = BAR_WIDTH + BAR_GAP;
const MAX_BAR_HEIGHT = 24;
const MIN_BAR_HEIGHT = 3;

/**
 * Simple deterministic hash that produces consistent pseudo-random bar heights
 * from an audio ID string. Same input always yields the same output.
 */
const generateBars = (id: string, count: number): number[] => {
  if (count <= 0) return [];

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }

  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    // xorshift-like step for each bar
    hash ^= hash << 13;
    hash ^= hash >> 17;
    hash ^= hash << 5;
    const value = ((hash >>> 0) % 100) / 100;
    // Bias towards middle values for a natural look
    bars.push(0.2 + value * 0.8);
  }
  return bars;
};

type PlaybackWaveformProps = {
  audioId: string;
  currentPosition: SharedValue<number>;
  totalDuration: SharedValue<number>;
  manualSeekTo: (ms: number) => void;
  pauseAudio: () => void;
  variant: string;
};

const WaveformBar = React.memo(
  ({
    height,
    index,
    progressIndex,
    filledColor,
    unfilledColor,
  }: {
    height: number;
    index: number;
    progressIndex: SharedValue<number>;
    filledColor: string;
    unfilledColor: string;
  }) => {
    const barHeight = MIN_BAR_HEIGHT + height * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);

    const animatedStyle = useAnimatedStyle(() => ({
      backgroundColor: index <= progressIndex.value ? filledColor : unfilledColor,
    }));

    return (
      <Animated.View
        style={[
          {
            width: BAR_WIDTH,
            height: barHeight,
            borderRadius: BAR_WIDTH / 2,
          },
          animatedStyle,
        ]}
      />
    );
  },
);

export const PlaybackWaveform = React.memo((props: PlaybackWaveformProps) => {
  const { audioId, currentPosition, totalDuration, manualSeekTo, pauseAudio, variant } = props;
  const colorScheme = useColorScheme();

  const [containerWidth, setContainerWidth] = useState(0);
  const progressIndex = useSharedValue(-1);
  const waveformWidth = useSharedValue(0);

  const isUser = variant === MESSAGE_VARIANTS.USER;
  const filledColor = isUser ? '#ffffff' : (tailwind.color('brand-primary') ?? '#1F93FF');
  const unfilledColor = isUser
    ? 'rgba(255,255,255,0.35)'
    : colorScheme === 'dark'
      ? (tailwind.color('grayDark-600') ?? '#3a3a3a')
      : (tailwind.color('gray-400') ?? '#a1a1aa');

  const maxBars = useMemo(() => {
    if (containerWidth === 0) return 0;
    return Math.floor(containerWidth / BAR_STEP);
  }, [containerWidth]);

  const bars = useMemo(() => generateBars(audioId, maxBars), [audioId, maxBars]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      setContainerWidth(w);
      waveformWidth.value = w;
    },
    [waveformWidth],
  );

  useAnimatedReaction(
    () => ({ pos: currentPosition.value, dur: totalDuration.value }),
    ({ pos, dur }) => {
      if (dur <= 0 || bars.length === 0) {
        progressIndex.value = -1;
        return;
      }
      const ratio = Math.min(pos / dur, 1);
      progressIndex.value = Math.floor(ratio * (bars.length - 1));
    },
    [bars.length],
  );

  const tapGesture = Gesture.Tap().onEnd(e => {
    'worklet';
    const ratio = Math.min(Math.max(e.x / waveformWidth.value, 0), 1);
    const seekMs = interpolate(ratio, [0, 1], [0, totalDuration.value], Extrapolation.CLAMP);
    runOnJS(pauseAudio)();
    runOnJS(manualSeekTo)(seekMs);
  });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      runOnJS(pauseAudio)();
    })
    .onUpdate(e => {
      'worklet';
      const ratio = Math.min(Math.max(e.x / waveformWidth.value, 0), 1);
      progressIndex.value = Math.floor(ratio * (bars.length - 1));
    })
    .onEnd(e => {
      'worklet';
      const ratio = Math.min(Math.max(e.x / waveformWidth.value, 0), 1);
      const seekMs = interpolate(ratio, [0, 1], [0, totalDuration.value], Extrapolation.CLAMP);
      runOnJS(manualSeekTo)(seekMs);
    });

  const gesture = Gesture.Exclusive(panGesture, tapGesture);

  return (
    <GestureDetector gesture={gesture}>
      <View
        onLayout={onLayout}
        style={tailwind.style('flex-1 flex-row items-center mx-1.5 h-8 overflow-hidden')}>
        <View style={tailwind.style('flex-row items-center gap-[2px]')}>
          {bars.map((amp, index) => (
            <WaveformBar
              key={index}
              height={amp}
              index={index}
              progressIndex={progressIndex}
              filledColor={filledColor}
              unfilledColor={unfilledColor}
            />
          ))}
        </View>
      </View>
    </GestureDetector>
  );
});
