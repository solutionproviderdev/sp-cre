import apiSlice from "@/api/apiSlice";


// Define types for the data structures
export interface MapData {
	_id: string;
	division: string;
	districts: {
		_id: string;
		name: string;
		areas: {
			_id: string;
			name: string;
			visitCharge: number;
		}[];
	}[];
}

interface Division {
	_id: string;
	division: string;
}

interface District {
	_id: string;
	name: string;
}

interface Area {
	_id: string;
	name: string;
}

interface SearchLocation {
	_id: string;
	name: string;
	path: string;
	divisionId?: string;
	districtId?: string;
	type: 'division' | 'district' | 'area';
}

const mapApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		// Get all map data
		getMapData: builder.query<MapData[], void>({
			query: () => '/map',
			providesTags: ['MapData'],
		}),

		// Fetch all divisions
		getDivisions: builder.query<Division[], void>({
			query: () => '/map/divisions',
		}),

		// Fetch districts by division ID
		getDistrictsByDivision: builder.query<District[], string>({
			query: (divisionId: string) => `/map/${divisionId}/districts`,
		}),

		// Fetch areas by district ID
		getAreasByDistrict: builder.query<Area[], string>({
			query: (districtId: string) => `/map/${districtId}/areas`,
		}),

		// Search for locations by keyword
		searchLocation: builder.query<SearchLocation[], string>({
			query: (keyword: string) => `/map/search?keyword=${keyword}`,
		}),

		// Add a new district to a division
		addDistrictToDivision: builder.mutation<
			MapData,
			{ divisionId: string; newDistrict: { name: string; areas?: any[] } }
		>({
			query: ({ divisionId, newDistrict }) => ({
				url: `/map/${divisionId}/districts`,
				method: 'POST',
				body: newDistrict,
			}),
			invalidatesTags: ['MapData'],
		}),

		// Add a new area to a district
		addAreaToDistrict: builder.mutation<
			MapData,
			{ districtId: string; newArea: { name: string; visitCharge: number } }
		>({
			query: ({ districtId, newArea }) => ({
				url: `/map/${districtId}/areas`,
				method: 'POST',
				body: newArea,
			}),
			invalidatesTags: ['MapData'],
		}),

		// Update the visit charge for an area
		updateVisitCharge: builder.mutation<
			{ message: string },
			{ areaId: string; visitCharge: number }
		>({
			query: ({ areaId, visitCharge }) => ({
				url: `/map/update-visit-charge/${areaId}`,
				method: 'PUT',
				body: { visitCharge },
			}),
			invalidatesTags: ['MapData'],
		}),
	}),
});

export const {
	useGetDivisionsQuery,
	useGetDistrictsByDivisionQuery,
	useGetAreasByDistrictQuery,
	useSearchLocationQuery,
	useGetMapDataQuery,
	useAddDistrictToDivisionMutation,
	useAddAreaToDistrictMutation,
	useUpdateVisitChargeMutation,
} = mapApi;

export default mapApi;
