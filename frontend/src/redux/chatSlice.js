/**
 * Redux slice for Chat state.
 * Manages: chat history, loading, error.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../Services/chatService';

// ─── Async Thunks ────────────────────────────────────────────

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, interactionId }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(message, interactionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Initial State ───────────────────────────────────────────

const initialState = {
  messages: [], // Array of { role: 'user' | 'assistant', content: string, data?: any }
  loading: false,
  error: null,
};

// ─── Slice ───────────────────────────────────────────────────

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload });
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: 'assistant',
          content: action.payload.reply,
          data: action.payload.extracted_data,
          action: action.payload.action,
          interactionId: action.payload.interaction_id,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messages.push({
          role: 'assistant',
          content: 'Sorry, an error occurred while processing your request.',
          isError: true,
        });
      });
  },
});

export const { addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
