import { createSlice } from "@reduxjs/toolkit";

const MAX_MESSAGES = 8;

const initialState = {
  messages: [
    {
      role: "assistant",
      content: "Hey! I'm Respawn AI. How can I help you?",
    },
  ],
  summary: "",
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);

      if (state.messages.length > MAX_MESSAGES) {
        state.messages = state.messages.slice(-MAX_MESSAGES);
      }
    },

    setMessages: (state, action) => {
      state.messages = action.payload.slice(-MAX_MESSAGES);
    },

    setSummary: (state, action) => {
      state.summary = action.payload || "";
    },

    clearChat: (state) => {
      state.messages = [
        {
          role: "assistant",
          content: "Hey! I'm Respawn AI. How can I help you?",
        },
      ];

      state.summary = "";
    },
  },
});

export const {
  addMessage,
  setMessages,
  setSummary,
  clearChat,
} = aiChatSlice.actions;

export default aiChatSlice.reducer;