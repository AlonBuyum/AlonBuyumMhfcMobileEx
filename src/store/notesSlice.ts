import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NoteLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  location: NoteLocation | null;
}

export interface NotesState {
  byUserId: Record<string, Note[]>;
}

const initialState: NotesState = {
  byUserId: {},
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      const note = action.payload;
      if (!state.byUserId[note.userId]) {
        state.byUserId[note.userId] = [];
      }
      state.byUserId[note.userId].unshift(note);
    },
    deleteNote: (state, action: PayloadAction<{ userId: string; noteId: string }>) => {
      const { userId, noteId } = action.payload;
      const list = state.byUserId[userId];
      if (!list) return;
      state.byUserId[userId] = list.filter((n) => n.id !== noteId);
    },
    clearUserNotes: (state, action: PayloadAction<{ userId: string }>) => {
      delete state.byUserId[action.payload.userId];
    },
  },
});

export const { addNote, deleteNote, clearUserNotes } = notesSlice.actions;
export default notesSlice.reducer;
