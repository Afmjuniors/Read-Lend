import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';
import { MainScreen } from '../screens/MainScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants';

// Wrapper para MainScreen que fornece as props necessárias
const MainScreenWrapper: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    await dispatch(logout());
  };

  if (!user || !user.user) {
    return <LoadingScreen message="Carregando dados do usuário..." />;
  }

  return <MainScreen user={user.user} onLogout={handleLogout} activeTab={activeTab} />;
};

// Componente principal que renderiza o MainScreen com o menu customizado
const MainScreenWithCustomTabBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MainScreenWrapper activeTab={activeTab} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'books' && styles.activeTabButton]}
          onPress={() => setActiveTab('books')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'books' && styles.activeTabButtonText]}>
            📚
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'quick' && styles.activeTabButton]}
          onPress={() => setActiveTab('quick')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'quick' && styles.activeTabButtonText]}>
            ⚡
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'organization' && styles.activeTabButton]}
          onPress={() => setActiveTab('organization')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'organization' && styles.activeTabButtonText]}>
            🏢
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'notifications' && styles.activeTabButton]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'notifications' && styles.activeTabButtonText]}>
            🔔
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'profile' && styles.activeTabButton]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'profile' && styles.activeTabButtonText]}>
            👤
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingBottom: 60, // Espaço para o menu
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 5,
    paddingTop: 5,
    zIndex: 1000,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  activeTabButton: {
    backgroundColor: COLORS.gray[50],
  },
  tabButtonText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  activeTabButtonText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});

export const AppNavigator: React.FC = () => {
  return <MainScreenWithCustomTabBar />;
}; 