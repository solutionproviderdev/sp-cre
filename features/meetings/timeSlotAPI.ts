import apiSlice from "@/api/apiSlice";


// Define types for the data structures
interface TimeSlot {
	_id: string;
	slot: string;
	active: boolean;
}

const timeSlotApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		// Fetch all active time slots
		getAllActiveTimeSlots: builder.query<TimeSlot[], void>({
			query: () => '/meeting/timeslots',
		}),

		// Add a new time slot to the right
		addTimeSlotToRight: builder.mutation<TimeSlot, void>({
			query: () => ({
				url: '/meeting/timeslots/right',
				method: 'POST',
			}),
		}),

		// Add a new time slot to the left
		addTimeSlotToLeft: builder.mutation<TimeSlot, void>({
			query: () => ({
				url: '/meeting/timeslots/left',
				method: 'POST',
			}),
		}),

		// Delete (deactivate) a time slot from the right
		deleteTimeSlotFromRight: builder.mutation<TimeSlot, void>({
			query: () => ({
				url: '/meeting/timeslots/right',
				method: 'DELETE',
			}),
		}),

		// Delete (deactivate) a time slot from the left
		deleteTimeSlotFromLeft: builder.mutation<TimeSlot, void>({
			query: () => ({
				url: '/meeting/timeslots/left',
				method: 'DELETE',
			}),
		}),
	}),
});

// Export hooks for using the endpoints in components
export const {
	useGetAllActiveTimeSlotsQuery,
	useAddTimeSlotToRightMutation,
	useAddTimeSlotToLeftMutation,
	useDeleteTimeSlotFromRightMutation,
	useDeleteTimeSlotFromLeftMutation,
} = timeSlotApi;

export default timeSlotApi;
