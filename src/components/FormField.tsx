import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { theme } from '../theme';

interface Props<TFormValues extends FieldValues> extends Omit<TextInputProps, 'onChange'> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  error?: FieldError;
  required?: boolean;
}

export function FormField<TFormValues extends FieldValues>({
  control,
  name,
  label,
  error,
  required,
  ...inputProps
}: Props<TFormValues>) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            {...inputProps}
            value={value as string | undefined ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.input, error && styles.inputError, inputProps.style]}
          />
        )}
      />
      {error?.message ? <Text style={styles.error}>{error.message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: theme.spacing.md },
  label: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  required: { color: theme.colors.danger },
  input: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
  },
  inputError: { borderColor: theme.colors.danger },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
});
