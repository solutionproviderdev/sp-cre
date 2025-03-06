import { logoutUser } from '@/features/slices/auth/AuthSlice';
import store from '@/features/strore';
import { jwtDecode } from 'jwt-decode';

// Helper function to check token validity
export const checkTokenAndLogout = (token: string | null) => {
	if (token) {
		try {
			const decodedToken = jwtDecode<{ exp: number }>(token);
			const currentTime = Date.now() / 1000;
			// console.log('token is valid');

			if (decodedToken.exp < currentTime) {
				// console.log('Token has expired');
				// If the token has expired, dispatch logout action
				store.dispatch(logoutUser());
				return false;
			}
			return true;
		} catch (error) {
			// If decoding the token fails, log the user out
			store.dispatch(logoutUser());
			return false;
		}
	}
	return false;
};
