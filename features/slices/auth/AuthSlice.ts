import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { User } from './AuthAPI';

// Define the structure of the JWT payload
interface JwtPayload {
	exp: number; // Expiration time in seconds
}

// Define the structure of the AuthState
interface AuthState {
	user: User | null;
	isLoggedIn: boolean;
	token: string | null;
}

// Helper function to check if the token is expired
const isTokenValid = (token: string | null): boolean => {
	if (!token) return false;

	try {
		const decodedToken = jwtDecode<JwtPayload>(token);
		const currentTime = Date.now() / 1000; // Get the current time in seconds
		return decodedToken.exp > currentTime; // Check if the token is still valid
	} catch (error) {
		return false; // Treat invalid or expired tokens as invalid
	}
};

// Helper function to save data to AsyncStorage
const saveToAsyncStorage = async (
	key: string,
	value: string
): Promise<void> => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (error) {
		console.error(`Error saving ${key} to AsyncStorage`, error);
	}
};

// Helper function to retrieve data from AsyncStorage
export const getAsyncStorageData = async (
	key: string
): Promise<string | null> => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (error) {
		console.error(`Error retrieving ${key} from AsyncStorage`, error);
		return null;
	}
};

// Helper function to remove data from AsyncStorage
export const removeAsyncStorageData = async (key: string): Promise<void> => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing ${key} from AsyncStorage`, error);
	}
};

// Helper function to initialize the auth state asynchronously
const initializeAuthState = async (): Promise<AuthState> => {
	const tokenFromStorage = await getAsyncStorageData('token');
	const userFromStorage = await getAsyncStorageData('user');

	const initialTokenIsValid = isTokenValid(tokenFromStorage);

	if (initialTokenIsValid && userFromStorage) {
		// If the token is valid and user data is available, set user

		return {
			user: JSON.parse(userFromStorage),
			isLoggedIn: true,
			token: tokenFromStorage,
		};
	}

	// Remove invalid data
	await removeAsyncStorageData('token');
	await removeAsyncStorageData('user');

	return {
		user: null,
		isLoggedIn: false,
		token: null,
	};
};

// Initialize the state synchronously first, then asynchronously update it
let initialState: AuthState = {
	user: null,
	isLoggedIn: false,
	token: null,
};

// Create the auth slice
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Action to set the user and token
		setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
			state.user = action.payload.user;
			state.isLoggedIn = true;
			state.token = action.payload.token;

			// Store token and user in AsyncStorage
			saveToAsyncStorage('token', action.payload.token);
			saveToAsyncStorage('user', JSON.stringify(action.payload.user));
		},

		// Action to log out the user
		logoutUser: state => {
			state.user = null;
			state.isLoggedIn = false;
			state.token = null;

			// Remove token and user from AsyncStorage
			removeAsyncStorageData('token').catch(err =>
				console.error('Error removing token:', err)
			);
			removeAsyncStorageData('user').catch(err =>
				console.error('Error removing user:', err)
			);
		},
	},
});

// Dispatch an action to update the state after initialization
(async () => {
	const initializedState = await initializeAuthState();
})();

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
