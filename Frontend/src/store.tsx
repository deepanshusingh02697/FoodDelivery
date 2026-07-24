import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
} from "redux-persist";

import authReducer from "./Redux/Slices/authSlice";
import cartReducer from './Redux/Slices/cartSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const storage = {
  getItem: (key: string) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","cart"],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;