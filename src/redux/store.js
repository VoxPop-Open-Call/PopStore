import {
  combineReducers,
  configureStore,
  getDefaultMiddleware
} from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "reduxjs-toolkit-persist";
import storage from "reduxjs-toolkit-persist/lib/storage";
import autoMergeLevel1 from "reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1";
import userReducer from "./user";
import csvTextReducer from "./csvText";

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel1
};

const reducers = combineReducers({
  user: userReducer,
  csvText: csvTextReducer
});
const _persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      /* ignore persistance actions */
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});
