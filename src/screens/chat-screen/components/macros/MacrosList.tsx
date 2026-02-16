import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';
import Animated from 'react-native-reanimated';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { BottomSheetBackdrop } from '@/components-next';
import i18n from '@/i18n';
import { useRefsContext } from '@/context';
import { tailwind } from '@/theme';
import { Macro } from '@/types';
import { useAppSelector } from '@/hooks';
import { selectAllMacros } from '@/store/macro/macroSelectors';

import MacroStack from './MacroStack';
import MacroDetails from './MacroDetails';
import { MacroProvider } from './MacroContext';

export const MacrosList = ({ conversationId }: { conversationId: number }) => {
  const colorScheme = useColorScheme();
  const macros = useAppSelector(selectAllMacros);
  const [selectedMacro, setSelectedMacro] = useState<Macro | null>(null);

  const handleMacroPress = (macro: Macro) => {
    setSelectedMacro(macro);
  };

  const handleBack = () => {
    setSelectedMacro(null);
  };

  const onClose = () => {
    setSelectedMacro(null);
    macrosListSheetRef.current?.dismiss({ overshootClamping: true });
  };

  const { macrosListSheetRef } = useRefsContext();

  return (
    <Animated.View>
      <BottomSheetModal
        ref={macrosListSheetRef}
        backdropComponent={BottomSheetBackdrop}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === 'dark' ? 'hsla(0, 0%, 100%, 0.169)' : 'hsla(0, 0%, 0%, 0.133)',
          overflow: 'hidden',
          width: 32,
          height: 4,
          borderRadius: 11,
        }}
        style={tailwind.style('rounded-[26px] overflow-hidden')}
        enablePanDownToClose
        snapPoints={['75%']}
        enableDynamicSizing={false}>
        <MacroProvider conversationId={conversationId} onClose={onClose}>
          <Animated.View style={tailwind.style('flex-1')}>
            {selectedMacro ? (
              <MacroDetails macro={selectedMacro} onBack={handleBack} onClose={onClose} />
            ) : (
              <Animated.View style={tailwind.style('flex-1')}>
                <View style={tailwind.style('px-4 pt-1 pb-4 items-center')}>
                  <Animated.Text
                    style={tailwind.style(
                      'text-gray-700 font-inter-580-24 leading-[17px] tracking-[0.32px]',
                    )}>
                    {i18n.t('MACRO.SELECT_MACRO')}
                  </Animated.Text>
                </View>
                <BottomSheetScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={tailwind.style('px-3 pb-6')}>
                  <MacroStack
                    handleMacroPress={handleMacroPress}
                    macrosList={macros}
                    isInsideBottomSheet
                  />
                </BottomSheetScrollView>
              </Animated.View>
            )}
          </Animated.View>
        </MacroProvider>
      </BottomSheetModal>
    </Animated.View>
  );
};

export default MacrosList;
