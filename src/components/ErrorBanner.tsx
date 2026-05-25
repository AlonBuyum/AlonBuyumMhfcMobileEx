import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.danger,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  text: { color: '#fecaca', fontSize: theme.fontSize.sm },
});
