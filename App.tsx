import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/theme';

function HydrationFallback() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={<HydrationFallback />} persistor={persistor}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <AppNavigator />
          </PersistGate>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  loader: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
