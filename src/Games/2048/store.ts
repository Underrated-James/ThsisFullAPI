// src/store.ts
import { createStore } from 'redux';
import applicationState from './reducers';

const store = createStore(applicationState);

export default store;

// ✅ These are the correct inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
