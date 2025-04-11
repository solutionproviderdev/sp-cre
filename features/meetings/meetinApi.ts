import apiSlice from "@/api/apiSlice";
import { Lead } from "../lead/leadApi";



export interface Meeting {
	_id: string;
	date: string;
	slot: string;
	salesExecutive: {
		_id: string;
		nickname: string;
		profilePicture: string;
		nameAsPerNID: string;
	};
	status: string;
	visitCharge: number;
	auditFields: {
		createdBy: string;
		updatedBy: string;
	};
	lead: Lead;
}

// Meeting type for RTK
export interface MeetingPayload {
	_id?: string;
	leadId: string;
	date: string;
	slot: string;
	salesExecutive: string;
	status?: 'Fixed' | 'Postponed' | 'Rescheduled' | 'Canceled' | 'Sold';
	visitCharge?: number;
	name?: string;
	requirements?: string[];
	projectLocation?: string;
	projectStatus?: {
		status: string;
		subStatus: string;
	};
	comment?: {
		text: string;
		images?: string[];
	};
	address: {
		division: string;
		district: string;
		area: string;
		address: string;
	};
}

interface CommentPayload {
	commentText?: string;
	images?: string[];
}

interface ProjectStatus {
	status: string;
	subStatus: string;
}

interface Address {
	division: string;
	district: string;
	area: string;
	address: string;
}

interface RescheduleMeetingPayload {
	id: string; // Meeting ID
	date: string;
	slot: string;
	salesExecutive: string;
	comment: CommentPayload;
	name?: string;
	address?: Address;
	phone?: string[];
	projectLocation?: string;
	requirements?: string[];
	projectStatus?: ProjectStatus;
}

interface PostponeMeetingPayload {
	id: string; // Meeting ID
	comment: CommentPayload;
	reminderTime: string; // Added to handle the reminder creation
}

export const meetingsApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getAllMeetings: builder.query<
			Meeting[],
			{
				status?: string;
				dateRange?: string;
				salesExecutiveId?: string;
				creId?: string;
			}
		>({
			query: params => ({
				url: '/meeting/',
				params,
			}),
			providesTags: ['Meeting'],
		}),

		// get meeting by date range
		getMeetingByDateRange: builder.query<
			Meeting[],
			{ startDate: string; endDate: string }
		>({
			query: ({ startDate, endDate }) => ({
				url: '/meeting',
				params: { dateRange: `${startDate}_${endDate}` },
			}),
			providesTags: ['Meeting'],
		}),

		// get meeting by id
		getMeetingById: builder.query<Meeting, string>({
			query: id => `/meeting/${id}`,
			providesTags: ['Meeting'],
		}),

		fixMeeting: builder.mutation<Meeting, Partial<MeetingPayload>>({
			query: newMeeting => ({
				url: '/meeting/fix',
				method: 'POST',
				body: newMeeting,
			}),
			invalidatesTags: ['Meeting'],
		}),
		postponeMeeting: builder.mutation<Meeting, PostponeMeetingPayload>({
			query: ({ id, comment, reminderTime }) => ({
				url: `/meeting/${id}/postpone`,
				method: 'PATCH',
				body: {
					...comment,
					reminderTime, // Pass the reminder time to the endpoint
				},
			}),
			invalidatesTags: ['Meeting'],
		}),
		rescheduleMeeting: builder.mutation<Meeting, RescheduleMeetingPayload>({
			query: ({
				id,
				date,
				slot,
				comment,
				salesExecutive,
				name,
				address,
				phone,
				projectLocation,
				requirements,
				projectStatus,
			}) => ({
				url: `/meeting/${id}/reschedule`,
				method: 'PATCH',
				body: {
					date,
					slot,
					salesExecutive,
					...comment,
					name,
					address,
					phone,
					projectLocation,
					requirements,
					projectStatus,
				},
			}),
			invalidatesTags: ['Meeting'],
		}),

		cancelMeeting: builder.mutation<Meeting, PostponeMeetingPayload>({
			query: ({ id, comment, reminderTime }) => ({
				url: `/meeting/${id}/cancel`,
				method: 'PATCH',
				body: { ...comment, reminderTime },
			}),
			invalidatesTags: ['Meeting'],
		}),
		updateMeetingDetails: builder.mutation<
			Meeting,
			{ id: string; updates: Partial<Meeting> }
		>({
			query: ({ id, updates }) => ({
				url: `/meeting/${id}/update`,
				method: 'PATCH',
				body: updates,
			}),
			invalidatesTags: ['Meeting'],
		}),
		reassignOrSwapMeeting: builder.mutation<
			Meeting,
			{ id: string; newSalesExecutiveId?: string; newSlot: string }
		>({
			query: ({ id, newSalesExecutiveId, newSlot }) => {
				return {
					url: `/meeting/${id}/reassign`,
					method: 'PATCH',
					body: { newSalesExecutiveId, newSlot },
				};
			},
			invalidatesTags: ['Meeting'],
		}),
		// update meeting status to 'Sold'
		markMeetingAsSold: builder.mutation<
			Meeting,
			{ id: string; status: string }
		>({
			query: ({ id, status }) => ({
				url: `/meeting/${id}/update`,
				method: 'PATCH',
				body: { status },
			}),
			invalidatesTags: ['Meeting'],
		}),

		// delete a meeting
		deleteaMeeting: builder.mutation<Meeting, string>({
			query: id => ({
				url: `/meeting/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Meeting'],
		}),
	}),
});
export const {
	useGetAllMeetingsQuery,
	useGetMeetingByIdQuery,
	useFixMeetingMutation,
	usePostponeMeetingMutation,
	useGetMeetingByDateRangeQuery,
	useRescheduleMeetingMutation,
	useCancelMeetingMutation,
	useUpdateMeetingDetailsMutation,
	useMarkMeetingAsSoldMutation,
	useReassignOrSwapMeetingMutation,
	useDeleteaMeetingMutation,
} = meetingsApi;
