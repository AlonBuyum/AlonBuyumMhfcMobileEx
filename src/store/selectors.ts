import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

export const selectCurrentUser = (state: RootState) => {
  const id = state.auth.currentUserId;
  if (!id) return null;
  return Object.values(state.auth.usersByEmail).find((u) => u.id === id) ?? null;
};

export const selectIsAuthenticated = (state: RootState) => state.auth.currentUserId !== null;

export const selectAuthUsersByEmail = (state: RootState) => state.auth.usersByEmail;

export const selectNotesByUserId = (state: RootState) => state.notes.byUserId;

export const selectCurrentUserNotes = createSelector(
  [selectNotesByUserId, (state: RootState) => state.auth.currentUserId],
  (byUserId, currentUserId) => (currentUserId ? byUserId[currentUserId] ?? [] : [])
);
