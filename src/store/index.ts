import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import combinedReducer from "./reducer";
import storage from "redux-persist/lib/storage";
import thunk from 'redux-thunk';

const config = {
  key: "rootx",
  storage,
  whitelist: [
    "opd",
    "profile"
  ]
}

const persistedReducer = persistReducer(config, combinedReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>

const persistor = persistStore(store);

export { store, persistor };