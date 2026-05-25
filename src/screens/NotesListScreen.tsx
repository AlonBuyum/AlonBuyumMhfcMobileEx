import React, { useCallback } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteNote } from '../store/notesSlice';
import { selectCurrentUser, selectCurrentUserNotes } from '../store/selectors';
import { signOut } from '../store/authSlice';
import { Button } from '../components/Button';
import { theme } from '../theme';
import type { Note } from '../store/notesSlice';
import type { MainTabScreenProps } from '../navigation/types';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface RowProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
}

function NoteRow({ note, onPress, onDelete }: RowProps) {
  const handleLongPress = () => {
    Alert.alert('Delete note?', `"${note.title}" will be permanently deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={handleLongPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.rowContent}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        {note.content ? (
          <Text style={styles.preview} numberOfLines={2}>
            {note.content}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Text style={styles.metaText}>{formatDate(note.createdAt)}</Text>
          {note.location ? <Text style={styles.metaText}>📍 location</Text> : null}
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export function NotesListScreen({ navigation }: MainTabScreenProps<'NotesList'>) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const notes = useAppSelector(selectCurrentUserNotes);

  const handleDelete = useCallback(
    (noteId: string) => {
      if (!user) return;
      dispatch(deleteNote({ userId: user.id, noteId }));
    },
    [dispatch, user]
  );

  const handleSignOut = () => {
    Alert.alert('Sign out?', 'Your notes will stay on this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => dispatch(signOut()) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user?.name ?? 'there'}</Text>
        <Button label="Sign out" variant="ghost" onPress={handleSignOut} />
      </View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={notes.length === 0 ? styles.emptyContainer : styles.listContent}
        renderItem={({ item }) => (
          <NoteRow
            note={item}
            onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptyText}>Tap "Create" below to add your first note.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  greeting: { color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: '600' },
  listContent: { padding: theme.spacing.md },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rowPressed: { opacity: 0.7 },
  rowContent: { flex: 1 },
  title: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: '600' },
  preview: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  metaText: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  chevron: { color: theme.colors.textSecondary, fontSize: 28, marginLeft: theme.spacing.sm },
  sep: { height: theme.spacing.sm },
  empty: { alignItems: 'center', padding: theme.spacing.xl },
  emptyTitle: { color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: '600' },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});
