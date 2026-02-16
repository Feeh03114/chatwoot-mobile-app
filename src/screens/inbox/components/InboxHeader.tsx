import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import Animated, { LinearTransition, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BottomSheetModal, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';

import { BottomSheetBackdrop, BottomSheetWrapper } from '@/components-next';

import { Icon } from '@/components-next/common/icon';
import { DoubleCheckIcon, InboxFilterIcon, SearchIcon, CloseIcon } from '@/svg-icons';
import { tailwind } from '@/theme';
import { InboxFilters } from './InboxFilters';
import i18n from '@/i18n';
import { useRefsContext } from '@/context';
import { SearchBar } from '@/components-next/common/search/SearchBar';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectSearchText, setSearchText } from '@/store/notification/notificationFilterSlice';

type InboxHeaderProps = {
  markAllAsRead: () => void;
};

export const InboxHeader = (props: InboxHeaderProps) => {
  const { markAllAsRead } = props;
  const { inboxFiltersSheetRef } = useRefsContext();
  const dispatch = useAppDispatch();
  const currentSearchText = useAppSelector(selectSearchText);
  const colorScheme = useColorScheme();

  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleToggleState = () => {
    inboxFiltersSheetRef.current?.present();
  };

  const handleSearchIconPress = useCallback(() => {
    // Usar useCallback
    setShowSearchInput(prev => {
      if (prev) {
        // Se estava mostrando e vai fechar, limpar o texto de busca
        dispatch(setSearchText(''));
      }
      return !prev;
    });
  }, [dispatch]);

  const handleClearSearchText = useCallback(() => {
    // Novo handler para limpar o texto
    dispatch(setSearchText(''));
  }, [dispatch]);

  const animationConfigs = useBottomSheetSpringConfigs({
    mass: 1,
    stiffness: 420,
    damping: 30,
  });

  // Estilo animado para o wrapper do SearchBar para expansão
  const searchBarWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      flex: withTiming(showSearchInput ? 1 : 0.4, { duration: 250 }),
    };
  });

  const iconColor =
    colorScheme === 'dark'
      ? tailwind.color('white')
      : tailwind.color('gray-950');

  const closeIconColor =
    colorScheme === 'dark'
      ? tailwind.color('white')
      : tailwind.color('blackA-A9');

  const handleIndicatorStyle = useMemo(() => {
    return tailwind.style('overflow-hidden w-8 h-1 rounded-[11px]', {
      backgroundColor:
        colorScheme === 'dark' ? tailwind.color('whiteA-A6') : tailwind.color('blackA-A6'),
    });
  }, [colorScheme]);

  return (
    <Animated.View
      layout={LinearTransition.springify().duration(250)}
      style={tailwind.style('border-b-[1px] border-blackA-A3 dark:border-whiteA-A3')}>
      <Animated.View
        style={[
          tailwind.style('flex flex-row justify-between items-center px-4 pt-2 pb-[12px]'),
          showSearchInput
            ? {
                backgroundColor:
                  colorScheme === 'dark'
                    ? tailwind.color('grayDark-100')
                    : tailwind.color('gray-100'),
              }
            : {
                backgroundColor:
                  colorScheme === 'dark'
                    ? tailwind.color('brand-background-dark')
                    : tailwind.color('brand-background'),
              },
        ]}>
        {showSearchInput ? (
          <SearchBar
            isActive={showSearchInput}
            value={currentSearchText}
            onChangeText={text => dispatch(setSearchText(text))}
            leftIcon={<Icon icon={<CloseIcon />} stroke={closeIconColor} />}
            onLeftIconPress={handleSearchIconPress}
            rightIcon={
              currentSearchText ? (
                <Icon icon={<CloseIcon />} stroke={closeIconColor} />
              ) : (
                undefined
              )
            }
            onRightIconPress={handleClearSearchText}
            wrapperStyle={tailwind.style('flex-1')}
            placeholder={i18n.t('NOTIFICATION.SEARCH_PLACEHOLDER')} // Placeholder para busca
          />
        ) : (
          <>
            <Animated.View style={tailwind.style('flex-1')}>
              <Pressable hitSlop={16} onPress={markAllAsRead}>
                <Icon icon={<DoubleCheckIcon />} stroke={iconColor} size={24} />
              </Pressable>
            </Animated.View>
            <Animated.View style={tailwind.style('flex-1')}>
              <Animated.Text
                style={[
                  tailwind.style(
                    'text-[17px] text-center leading-[17px] tracking-[0.32px] font-inter-medium-24',
                  ),
                  {
                    color: colorScheme === 'dark' ? tailwind.color('grayDark-950') : tailwind.color('gray-950'),
                  },
                ]}>
                {i18n.t('NOTIFICATION.INBOX')}
              </Animated.Text>
            </Animated.View>
            <Animated.View
              style={tailwind.style('flex-1 items-end flex-row justify-end gap-4')}>
              <Pressable hitSlop={16} onPress={handleSearchIconPress}>
                <Icon icon={<SearchIcon />} stroke={iconColor} size={24} />
              </Pressable>
              <Pressable onPress={handleToggleState} hitSlop={16}>
                <Icon icon={<InboxFilterIcon />} stroke={iconColor} size={24} />
              </Pressable>
            </Animated.View>
          </>
        )}
      </Animated.View>
      <BottomSheetModal
        ref={inboxFiltersSheetRef}
        backdropComponent={BottomSheetBackdrop}
        handleIndicatorStyle={handleIndicatorStyle}
        handleStyle={tailwind.style('p-0 h-4 pt-[5px]')}
        style={tailwind.style('rounded-[26px] overflow-hidden')}
        animationConfigs={animationConfigs}
        enablePanDownToClose
        snapPoints={[160]}>
        <BottomSheetWrapper>
          <InboxFilters />
        </BottomSheetWrapper>
      </BottomSheetModal>
    </Animated.View>
  );
};
