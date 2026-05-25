import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNoteSchema, type CreateNoteFormValues } from '../lib/validation';
import {
  captureLocation,
  LocationPermissionDeniedError,
  LocationUnavailableError,
  type Coords,
} from '../lib/location';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNote } from '../store/notesSlice';
import { selectCurrentUser } from '../store/selectors';
import { theme } from '../theme';
import type { MainTabScreenProps } from '../navigation/types';

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CreateNoteScreen({ navigation }: MainTabScreenProps<'CreateNote'>) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [attachLocation, setAttachLocation] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingWithLocation, setSavingWithLocation] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateNoteFormValues>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { title: '', content: '' },
  });

  const persistNote = (values: CreateNoteFormValues, location: Coords | null) => {
    if (!user) return;
    dispatch(
      addNote({
        id: makeId(),
        userId: user.id,
        title: values.title.trim(),
        content: (values.content ?? '').trim(),
        createdAt: new Date().toISOString(),
        location,
      })
    );
    reset({ title: '', content: '' });
    setError(null);
    navigation.navigate('NotesList');
  };

  const onSubmit = async (values: CreateNoteFormValues) => {
    setError(null);
    if (!attachLocation) {
      persistNote(values, null);
      return;
    }

    setSavingWithLocation(true);
    try {
      const coords = await captureLocation();
      persistNote(values, coords);
    } catch (err) {
      if (err instanceof LocationPermissionDeniedError) {
        Alert.alert('Location unavailable', err.message, [
          { text: 'Save without location', onPress: () => persistNote(values, null) },
          { text: 'Cancel', style: 'cancel' },
        ]);
      } else if (err instanceof LocationUnavailableError) {
        Alert.alert(
          'Could not get location',
          `${err.message}\n\nMake sure location services are on and the emulator has a mock location set.`,
          [
            { text: 'Save without location', onPress: () => persistNote(values, null) },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        setError('Unexpected error capturing location. Please try again.');
      }
    } finally {
      setSavingWithLocation(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>New note</Text>

        {error ? <ErrorBanner message={error} /> : null}

        <FormField
          control={control}
          name="title"
          label="Title"
          required
          error={errors.title}
          placeholder="What's this note about?"
          autoFocus
        />
        <FormField
          control={control}
          name="content"
          label="Content"
          error={errors.content}
          placeholder="Add some details (optional)"
          multiline
          numberOfLines={6}
          style={styles.multiline}
          textAlignVertical="top"
        />

        <View style={styles.locationRow}>
          <View style={styles.locationCopy}>
            <Text style={styles.locationTitle}>Attach current location</Text>
            <Text style={styles.locationSub}>
              We'll ask for permission once. You can save without a location any time.
            </Text>
          </View>
          <Switch
            value={attachLocation}
            onValueChange={setAttachLocation}
            trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
            thumbColor={theme.colors.text}
          />
        </View>

        <Button
          label={savingWithLocation ? 'Getting location…' : 'Save note'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting || savingWithLocation}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, paddingTop: theme.spacing.xl },
  heading: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
  },
  multiline: { minHeight: 120 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  locationCopy: { flex: 1, marginRight: theme.spacing.md },
  locationTitle: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: '600' },
  locationSub: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
});
