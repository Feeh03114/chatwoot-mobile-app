import React, { forwardRef, PropsWithChildren, useCallback, useRef } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import * as ContextMenu from 'zeego/context-menu';

import { tailwind } from '@/theme';
import { BottomSheetHeader, BottomSheetWrapper, Icon } from '@/components-next/common';
import { useThemeColors } from '@/hooks/useThemeColors'; // Adicionar import

export type MenuOption = {
  title: string;
  icon: React.ReactNode;
  handleOnPressMenuOption: () => void;
  destructive?: boolean;
  stroke?: string;
  fill?: string;
};

type MessageMenuProps = {
  menuOptions: MenuOption[];
};

const ContextMenuTrigger = ContextMenu.create<React.ComponentProps<typeof ContextMenu.Trigger>>(
  props => (
    <ContextMenu.Trigger {...props} asChild>
      <View aria-role="button">{props.children}</View>
    </ContextMenu.Trigger>
  ),
  'Trigger',
);

const ContextMenuItem = ContextMenu.create<React.ComponentProps<typeof ContextMenu.Item>>(
  props => (
    <ContextMenu.Item {...props}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {props.children}
      </View>
    </ContextMenu.Item>
  ),
  'Item',
);

// eslint-disable-next-line react/display-name
const ContextMenuBottomSheetBackdrop = forwardRef<
  React.RefObject<BottomSheetModal>,
  BottomSheetBackdropProps
>((props, ref) => {
  const { animatedIndex, style } = props;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1]),
    };
  });

  const handleBackdropPress = () => {
    // @ts-expect-error Bottom sheet dismiss method typing issue
    ref?.current?.dismiss({ overshootClamping: true });
  };

  return (
    <Pressable onPress={handleBackdropPress} style={style}>
      <Animated.View style={[tailwind.style('bg-blackA-A9'), style, animatedStyle]} />
    </Pressable>
  );
});

export const MessageMenu = (props: PropsWithChildren<MessageMenuProps>) => {
  const { children, menuOptions } = props;

  const contextMenuSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => {
    contextMenuSheetRef.current?.present();
  };
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => runOnJS(openSheet)());

  const { bottom } = useSafeAreaInsets();

  const animationConfigs = useBottomSheetSpringConfigs({
    mass: 1,
    stiffness: 420,
    damping: 30,
  });

  const handleOnDismiss = () => {
    contextMenuSheetRef.current?.dismiss();
  };

  const renderBackDrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <ContextMenuBottomSheetBackdrop
        {...backdropProps}
        // @ts-expect-error Backdrop component ref typing issue
        ref={contextMenuSheetRef}
      />
    ),
    [],
  );

  const { getThemedColor, theme: colorScheme } = useThemeColors();

  if (menuOptions?.length === 0) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (Platform.OS === 'android') {
    const borderColor = getThemedColor('border-blackA-A3', 'border-grayDark-300'); // Cor da borda
    const textColor = getThemedColor('text-gray-950', 'text-grayDark-950'); // Cor do texto da opção

    return (
      <React.Fragment>
        <GestureDetector gesture={longPressGesture}>{children}</GestureDetector>
        <BottomSheetModal
          ref={contextMenuSheetRef}
          backdropComponent={renderBackDrop}
        handleIndicatorStyle={{
            backgroundColor:
              colorScheme === 'dark'
                ? 'hsla(0, 0%, 100%, 0.169)'
                : 'hsla(0, 0%, 0%, 0.133)',
            overflow: 'hidden',
            width: 32,
            height: 4,
            borderRadius: 11,
          }}
          handleStyle={tailwind.style('p-0 h-4 pt-[5px]')}
          style={tailwind.style('mx-3 rounded-[26px] overflow-hidden')}
          detached
          bottomInset={bottom === 0 ? 12 : bottom}
          animationConfigs={animationConfigs}
          enablePanDownToClose
          snapPoints={[menuOptions.length * 44 + 4 + 37]}
          onDismiss={handleOnDismiss}>
          <BottomSheetWrapper>
            <BottomSheetHeader headerText="Select action" />
            <Animated.View style={tailwind.style('py-1 pl-3')}>
              {menuOptions?.map((option, index) => {
                return (
                  <Pressable
                    key={option.title + index}
                    onPress={() => {
                      handleOnDismiss();
                      option.handleOnPressMenuOption();
                    }}
                    style={tailwind.style('flex flex-row items-center')}>
                    <Animated.View>
                      {/* O option.icon deve lidar com sua própria cor via useThemeColors */}
                      <Icon icon={option.icon} size={24} />
                    </Animated.View>
                    <Animated.View
                      style={tailwind.style(
                        'flex-1 ml-3 flex-row justify-between py-[11px] pr-3',
                        index !== menuOptions.length - 1 ? `border-b-[1px] ${borderColor}` : '', // Aplicar borderColor
                      )}>
                      <Animated.Text
                        style={tailwind.style(
                          'text-base font-inter-420-20 leading-[21px] tracking-[0.16px] capitalize',
                          textColor, // Aplicar textColor
                        )}>
                        {option.title}
                      </Animated.Text>
                    </Animated.View>
                  </Pressable>
                );
              })}
            </Animated.View>
          </BottomSheetWrapper>
        </BottomSheetModal>
      </React.Fragment>
    );
  }

  return (
    <ContextMenu.Root>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenu.Content>
        {menuOptions?.map(option => {
          return (
            <ContextMenuItem
              key={option.title}
              onSelect={option.handleOnPressMenuOption}
              destructive={option.destructive}>
              {/* O option.icon e o ContextMenu.ItemTitle devem lidar com suas próprias cores via useThemeColors */}
              {option.icon}
              <ContextMenu.ItemTitle>{option.title}</ContextMenu.ItemTitle>
            </ContextMenuItem>
          );
        })}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
