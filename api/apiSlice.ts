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
		baseUrl: 'https://crm.solutionprovider.com.bd/api',
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
	endpoints: () => ({}),
});
console.timeEnd('apiSlice');

export default apiSlice;
