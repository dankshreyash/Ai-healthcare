/**
 * Redux slice for Interaction state.
 * Manages: interaction list, current interaction, loading, error.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import interactionService from '../Services/interactionService';

// ─── Async Thunks ────────────────────────────────────────────

export const fetchInteractions = createAsyncThunk(
  'interactions/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await interactionService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInteractionById = createAsyncThunk(
  'interactions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await interactionService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInteraction = createAsyncThunk(
  'interactions/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await interactionService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInteraction = createAsyncThunk(
  'interactions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await interactionService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInteraction = createAsyncThunk(
  'interactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await interactionService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Initial State ───────────────────────────────────────────

const initialState = {
  interactions: [],
  total: 0,
  currentInteraction: null,
  loading: false,
  error: null,
};

// ─── Slice ───────────────────────────────────────────────────

const interactionSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    clearCurrentInteraction: (state) => {
      state.currentInteraction = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = action.payload.interactions;
        state.total = action.payload.total;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchInteractionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInteraction = action.payload;
      })
      .addCase(fetchInteractionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInteraction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.interactions.findIndex(
          (i) => i.id === action.payload.id
        );
        if (index !== -1) {
          state.interactions[index] = action.payload;
        }
        if (state.currentInteraction?.id === action.payload.id) {
          state.currentInteraction = action.payload;
        }
      })
      .addCase(updateInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = state.interactions.filter(
          (i) => i.id !== action.payload
        );
        state.total -= 1;
        if (state.currentInteraction?.id === action.payload) {
          state.currentInteraction = null;
        }
      })
      .addCase(deleteInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentInteraction, clearError } = interactionSlice.actions;
export default interactionSlice.reducer;
