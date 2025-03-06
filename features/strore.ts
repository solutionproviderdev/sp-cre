import { configureStore } from '@reduxjs/toolkit';
import apiSlice from '../api/apiSlice';
import authReducer from './slices/auth/AuthSlice';

const store = configureStore({
	reducer: {
		[apiSlice?.reducerPath]: apiSlice?.reducer,
		auth: authReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({ serializableCheck: false }).concat(
			apiSlice.middleware
		), // Add API slice middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
