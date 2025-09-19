import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { getEmailError, getPasswordError } from '../utils/validation';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<any>;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const error = getEmailError(email);
    setEmailError(error || '');
    return !error;
  };

  const validatePassword = (password: string) => {
    const error = getPasswordError(password);
    setPasswordError(error || '');
    return !error;
  };

  const handleLogin = async () => {
    console.log('🚀 LoginForm: handleLogin iniciado');
    
    // Limpar erros anteriores
    setEmailError('');
    setPasswordError('');

    // Validar campos
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      console.log('❌ LoginForm: Validação falhou');
      return;
    }

    console.log('✅ LoginForm: Validação passou, chamando onLogin...');
    try {
      await onLogin(email.trim(), password);
      console.log('✅ LoginForm: onLogin executado com sucesso');
    } catch (error) {
      console.error('❌ LoginForm: Erro no onLogin:', error);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Biblioteca</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Digite seu email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, passwordError && styles.inputError]}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem uma conta? </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.signupLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.white,
    color: COLORS.text.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.gray[400],
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  signupText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
}); 