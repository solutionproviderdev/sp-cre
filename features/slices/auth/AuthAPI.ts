import {
	Conversation,
	GetAllConversationsResponse,
} from '@/types/Conversation';
import apiSlice from '../../../api/apiSlice';
import { getSocket } from '@/hooks/getSocket';

interface Role {
	_id: string;
	roleName: string;
}

// Define the User interface
export interface User {
	_id: string;
	nameAsPerNID: string;
	nickname: string;
	email: string;
	personalPhone: string;
	officePhone: string;
	type: 'Admin' | 'Operator';
	gender: string;
	address: string;
	profilePicture?: string;
	coverPhoto?: string;
	status: string;
	roleId?: string; // Optional populated role information
	departmentId?: string; // Optional populated department information
}

// Interface for user login response
interface LoginResponse {
	user: User;
	token: string;
}

// Interface for getting user by ID response
interface GetUserByIdResponse {
	_id: string;
	nameAsPerNID: string;
	email: string;
	personalPhone: string;
	gender: string;
	status: string;
	department?: Department;
	role?: Role;
	profilePicture?: string;
	coverPhoto?: string;
	nickname: string;
}

export interface Department {
	_id: string;
	departmentName: string;
	description?: string;
	roles: Role[];
	staffCount: number;
}

// Response for fetching all permissions
// type GetAllPermissionsResponse = Permission[];

// Responses
type GetAllDepartmentsResponse = Department[];

type GetDepartmentByIdResponse = Department;

// Interface for fetching all users by department and role
type GetAllUsersResponse = User[];

const socket = getSocket();

const authApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		// User login
		loginUser: builder.mutation<
			LoginResponse,
			{ email: string; password: string }
		>({
			query: ({ email, password }) => ({
				url: '/users/login',
				method: 'POST',
				body: { email, password },
				credentials: 'include',
			}),
		}),

		// User logout
		logoutUser: builder.mutation<{ msg: string }, void>({
			query: () => ({
				url: '/users/logout',
				method: 'POST',
			}),
		}),

		// Get user by department and role
		getUserByDepartmentAndRole: builder.query<
			GetAllUsersResponse,
			{ departmentName?: string; roleName?: string }
		>({
			query: ({ departmentName, roleName }) => {
				if (departmentName && roleName) {
					return {
						url: `/users?departmentName=${departmentName}&roleName=${roleName}`,
					};
				} else if (departmentName) {
					return {
						url: `/users?departmentName=${departmentName}`,
					};
				} else {
					return {
						url: '/users',
					};
				}
			},
		}),

		// Get single user by ID
		getUserById: builder.query<GetUserByIdResponse, string>({
			query: id => `/users/${id}`,
		}),

		// Fetch department by ID
		getDepartmentById: builder.query<GetDepartmentByIdResponse, string>({
			query: id => `/users/departments/${id}`,
		}),

		// // get All Conversations
		getAllConversations: builder.query<
			GetAllConversationsResponse,
			{ page: number; limit: number }
		>({
			query: ({ page, limit }) =>
				`/lead/conversation?page=${page}&limit=${limit}`,
			onCacheEntryAdded: async (
				arg,
				{ updateCachedData, cacheDataLoaded, cacheEntryRemoved }
			) => {
				await cacheDataLoaded;

				const handleConversationUpdate = (conversation: Conversation) => {
					updateCachedData(draft => {
						const index = draft.leads.findIndex(
							({ _id }) => _id === conversation._id
						);
						if (index !== -1) {
							draft.leads[index] = conversation;
						} else {
							draft.leads.unshift(conversation);
						}
						draft.leads.sort(
							(a, b) =>
								new Date(b.lastMessageTime).getTime() -
								new Date(a.lastMessageTime).getTime()
						);
					});
				};

				socket.on('conversation', handleConversationUpdate);
				await cacheEntryRemoved;
				socket.off('conversation', handleConversationUpdate);
			},
		}),
		// Mark messages as seen with optimistic update
		markAsSeen: builder.mutation<void, { id: string }>({
			query: ({ id }) => ({
				url: `/lead/conversation/${id}/mark-messages-seen`,
				method: 'PUT',
			}),
			// Optimistic update: we update the cached data before the mutation is fulfilled
			onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
				// Optimistically update the leads cache to mark messages as seen
				const patchResult = dispatch(
					authApi.util.updateQueryData(
						'getAllConversations',
						{ page: 1, limit: 500 }, // Assuming you're fetching paginated data
						draft => {
							const lead = draft.leads.find(lead => lead._id === arg.id);
							if (lead) {
								lead.messagesSeen = true; // Mark the messages as seen optimistically
							}
						}
					)
				);

				try {
					// Await the actual server response
					await queryFulfilled;
				} catch (err) {
					// Rollback the optimistic update if the mutation fails
					patchResult.undo();
				}
			},
			// Invalidates the cache for specific lead once the mutation is successful
			invalidatesTags: (result, error, { id }) => [{ type: 'Lead', id }],
		}),
	}),
	overrideExisting: false,
});

// Export hooks for each endpoint
export const {
	useLoginUserMutation,
	useLogoutUserMutation,
	useGetUserByDepartmentAndRoleQuery,
	useGetDepartmentByIdQuery,
	useGetUserByIdQuery,
	useMarkAsSeenMutation,
	useGetAllConversationsQuery,
} = authApi;

export default authApi;
