import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '../../services/api';

// ─── THUNKS ───────────────────────────────────────────────────
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, chatId }, { rejectWithValue }) => {
    try {
      return await chatApi.sendMessage(message, chatId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadHistory = createAsyncThunk(
  'chat/loadHistory',
  async (chatId, { rejectWithValue }) => {
    try {
      return await chatApi.getHistory(chatId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadUserChats = createAsyncThunk(
  'chat/loadUserChats',
  async (userId, { rejectWithValue }) => {
    try {
      return await chatApi.getUserChats(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── SLICE ────────────────────────────────────────────────────
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    currentChatId:  null,
    messages:       [],
    userChats:      [],
    sending:        false,
    historyLoading: false,
    error:          null,
  },
  reducers: {
    newChat(state) {
      state.currentChatId = null;
      state.messages      = [];
    },
    selectChat(state, action) {
      state.currentChatId = action.payload;
      state.messages      = [];
    },
    // Optimistic: darhol foydalanuvchi xabarini qo'shish
    addUserMessage(state, action) {
      state.messages.push({
        role:      'user',
        message:   action.payload,
        timestamp: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    // sendMessage
    builder
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error   = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending       = false;
        state.currentChatId = action.payload.chatId;
        state.messages.push({
          role:      'assistant',
          message:   action.payload.response,
          timestamp: action.payload.timestamp,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error   = action.payload;
        state.messages.push({
          role:    'assistant',
          message: '❌ Xatolik yuz berdi. Qaytadan urinib ko\'ring.',
        });
      });

    // loadHistory
    builder
      .addCase(loadHistory.pending, (state) => { state.historyLoading = true; })
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.messages       = action.payload;
      })
      .addCase(loadHistory.rejected, (state) => { state.historyLoading = false; });

    // loadUserChats
    builder
      .addCase(loadUserChats.fulfilled, (state, action) => {
        state.userChats = action.payload;
      });
  },
});

export const { newChat, selectChat, addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;
