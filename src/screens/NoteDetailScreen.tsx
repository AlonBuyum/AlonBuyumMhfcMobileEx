import React, { useLayoutEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteNote } from '../store/notesSlice';
import { selectCurrentUser, selectCurrentUserNotes } from '../store/selectors';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme';
import type { RootStackScreenProps } from '../navigation/types';

function formatFull(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function NoteDetailScreen({ route, navigation }: RootStackScreenProps<'NoteDetail'>) {
  const { noteId } = route.params;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const notes = useAppSelector(selectCurrentUserNotes);
  const note = notes.find((n) => n.id === noteId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: note?.title ?? 'Note' });
  }, [navigation, note?.title]);

  if (!note || !user) {
    return (
      <View style={styles.missingWrap}>
        <Text style={styles.missing}>Note not found</Text>
        <Button label="Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete note?', `"${note.title}" will be permanently deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteNote({ userId: user.id, noteId: note.id }));
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Card>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.timestamp}>{formatFull(note.createdAt)}</Text>
        {note.content ? <Text style={styles.content}>{note.content}</Text> : null}
      </Card>

      {note.location ? (
        <Card style={styles.mapCard}>
          <Text style={styles.sectionLabel}>Location</Text>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: note.location.latitude,
              longitude: note.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: note.location.latitude,
                longitude: note.location.longitude,
              }}
              title={note.title}
            />
          </MapView>
          <Text style={styles.coords}>
            {note.location.latitude.toFixed(5)}, {note.location.longitude.toFixed(5)}
            {note.location.accuracy ? ` (±${Math.round(note.location.accuracy)}m)` : ''}
          </Text>
        </Card>
      ) : (
        <Card style={styles.mapCard}>
          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={styles.noLocation}>No location was captured for this note.</Text>
        </Card>
      )}

      <Button label="Delete note" variant="danger" onPress={handleDelete} style={styles.deleteBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.md, gap: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: theme.fontSize.xl, fontWeight: '700' },
  timestamp: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  content: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.md,
    lineHeight: 22,
  },
  mapCard: { padding: theme.spacing.md, marginTop: theme.spacing.md },
  sectionLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  map: {
    width: '100%',
    height: 240,
    borderRadius: theme.radius.md,
  },
  coords: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.sm,
    fontVariant: ['tabular-nums'],
  },
  noLocation: { color: theme.colors.textSecondary, fontSize: theme.fontSize.md },
  deleteBtn: { marginTop: theme.spacing.md },
  missingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md,
  },
  missing: { color: theme.colors.text, fontSize: theme.fontSize.lg },
});
