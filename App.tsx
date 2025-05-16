import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/contexts/AuthContext';
import StackNavigator from './src/navigations/StackNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PortalProvider} from '@gorhom/portal';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <PortalProvider>
          <AuthProvider>
            <NavigationContainer>
              <StackNavigator />
            </NavigationContainer>
          </AuthProvider>
        </PortalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
