import { getAsyncStorageData } from '@/features/slices/auth/AuthSlice';
import { RootState } from '@/features/strore';
import { checkTokenAndLogout } from '@/hooks/checkTokenAndLogout';
import {
	Conversation,
	GetAllConversationsResponse,
} from '@/types/Conversation';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

console.time('apiSlice');
const apiSlice = createApi({

	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		//CRM URL
		// baseUrl: 'https://crm.solutionprovider.com.bd/api',
		
		// //Solution Provider wifi
		// baseUrl: 'http://192.168.68.117:5000',
		//Rayhan Home Wifi
		// baseUrl:'http://192.168.0.104:5000',
		// Rayhan Mobile
		baseUrl:'http://192.168.193.180:5000',
		prepareHeaders: async (headers, { getState }) => {
			// Get token from auth state
			// const token = (getState() as RootState).auth.token;
			const token = await getAsyncStorageData('token');

			// Check token validity, and if invalid, handle logout
			// const isValid = checkTokenAndLogout(token);

			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}
			return headers;
		},
	}),
	tagTypes: ['ProductAd', 'Lead', 'Meeting'],
	endpoints: () => ({}),
});

console.timeEnd('apiSlice');

export default apiSlice;
