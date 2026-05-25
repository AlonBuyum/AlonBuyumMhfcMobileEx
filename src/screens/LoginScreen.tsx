import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../lib/validation';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signIn } from '../store/authSlice';
import { selectAuthUsersByEmail } from '../store/selectors';
import { theme } from '../theme';
import type { RootStackScreenProps } from '../navigation/types';

export function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const dispatch = useAppDispatch();
  const usersByEmail = useAppSelector(selectAuthUsersByEmail);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    setServerError(null);
    const user = usersByEmail[values.email.toLowerCase().trim()];
    if (!user || user.password !== values.password) {
      setServerError('Invalid email or password');
      return;
    }
    dispatch(signIn({ userId: user.id }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to your notes</Text>

        {serverError ? <ErrorBanner message={serverError} /> : null}

        <FormField
          control={control}
          name="email"
          label="Email"
          required
          error={errors.email}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="you@example.com"
        />
        <FormField
          control={control}
          name="password"
          label="Password"
          required
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
          placeholder="••••••••"
        />

        <Button label="Sign in" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

        <View style={styles.bottom}>
          <Text style={styles.muted}>Don't have an account?</Text>
          <Button label="Create one" variant="ghost" onPress={() => navigation.navigate('Register')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, paddingTop: theme.spacing.xl },
  heading: { color: theme.colors.text, fontSize: theme.fontSize.xxl, fontWeight: '700' },
  sub: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  bottom: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  muted: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
});
