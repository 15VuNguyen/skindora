import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { rootReducer } from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Custom hook to use the typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
