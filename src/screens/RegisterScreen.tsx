import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '../lib/validation';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser } from '../store/authSlice';
import { selectAuthUsersByEmail } from '../store/selectors';
import { theme } from '../theme';
import type { RootStackScreenProps } from '../navigation/types';

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
  const dispatch = useAppDispatch();
  const usersByEmail = useAppSelector(selectAuthUsersByEmail);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', name: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (values: RegisterFormValues) => {
    setServerError(null);
    const emailKey = values.email.toLowerCase().trim();
    if (usersByEmail[emailKey]) {
      setServerError('An account with this email already exists');
      return;
    }
    dispatch(
      registerUser({
        id: makeId(),
        email: emailKey,
        name: values.name.trim(),
        password: values.password,
        createdAt: new Date().toISOString(),
      })
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.sub}>Local only — your notes stay on this device</Text>

        {serverError ? <ErrorBanner message={serverError} /> : null}

        <FormField
          control={control}
          name="name"
          label="Name"
          required
          error={errors.name}
          autoComplete="name"
          textContentType="name"
          placeholder="Your name"
        />
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
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="At least 8 characters"
        />
        <FormField
          control={control}
          name="confirmPassword"
          label="Confirm password"
          required
          error={errors.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="Re-enter your password"
        />

        <Button
          label="Create account"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />

        <View style={styles.bottom}>
          <Text style={styles.muted}>Already registered?</Text>
          <Button label="Sign in" variant="ghost" onPress={() => navigation.navigate('Login')} />
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
  bottom: { marginTop: theme.spacing.lg, alignItems: 'center' },
  muted: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
});
