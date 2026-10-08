import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "../features/auth/userSlice";
import techBackgroundReducer from "../services/TechBackGround/techBackgroundSlice";
import gameListReducer from "../features/games/gameListSlice";
import trendingGameReducer from "../features/games/trendingRandomGame";
import aiChatReducer from "../features/ai/aiChatSlice";

const aiChatPersistConfig = {
  key: "aiChat",
  storage,
};

const persistedAIChatReducer = persistReducer(
  aiChatPersistConfig,
  aiChatReducer
);

const store = configureStore({
  reducer: {
    user: userReducer,
    techBackground: techBackgroundReducer,
    gameList: gameListReducer,
    trendingRandomGame: trendingGameReducer,
    aiChat: persistedAIChatReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;




// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "../features/auth/userSlice"
// import techBackgroundReducer from "../services/TechBackGround/techBackgroundSlice";
// import gameListReducer from "../features/games/gameListSlice";
// import trendingGameReducer from "../features/games/trendingRandomGame";
// import aiChatReducer from "../features/ai/aiChatSlice"


// const store = configureStore({
//     reducer: {
//         user: userReducer,
//         techBackground: techBackgroundReducer,
//         gameList: gameListReducer,
//         trendingRandomGame: trendingGameReducer,
//         aiChat: aiChatReducer,
//     },
// });

// export default store;
