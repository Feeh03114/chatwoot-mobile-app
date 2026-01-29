import React from 'react';
import { Provider } from 'react-redux';
import { Alert, BackHandler, View } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { AppNavigator } from '@/navigation';
import { tailwind } from '@/theme/tailwind';

import i18n from '@/i18n';

import { AppInitializer } from '@/components-next/common/app-initializer/AppInitializer';
import { useDeviceContext } from 'twrnc';

const Chatwoot = () => {
  useDeviceContext(tailwind);
  
  const handleBackButtonClick = () => {
    Alert.alert(
      i18n.t('EXIT.TITLE'),
      i18n.t('EXIT.SUBTITLE'),
      [
        {
          text: i18n.t('EXIT.CANCEL'),
          onPress: () => {},
          style: 'cancel',
        },
        { text: i18n.t('EXIT.OK'), onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false },
    );
    return true;
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppInitializer>
          <View style={tailwind.style('flex-1 bg-brand-background')}>
            <AppNavigator />
          </View>
        </AppInitializer>
      </PersistGate>
    </Provider>
  );
};

export default Chatwoot;
