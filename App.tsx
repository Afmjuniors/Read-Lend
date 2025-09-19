import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { AuthNavigator } from './src/navigators/AuthNavigator';
import { AppNavigator } from './src/navigators/AppNavigator';
import { useAuth } from './src/hooks/useAuth';
import { LoadingScreen } from './src/components/LoadingScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('🔄 App render - user:', user, 'isAuthenticated:', isAuthenticated, 'loading:', loading);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    console.log('⏳ Mostrando loading...');
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={AppNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
