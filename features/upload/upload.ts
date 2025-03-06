import apiSlice from "@/api/apiSlice";

// Define the interface for the response
interface UploadResponse {
	fileUrl: string;
}

interface UploadMultiResponse {
	fileUrls: string[];
}

// Extend the apiSlice with upload endpoints
const uploadApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		// Upload image endpoint
		uploadImage: builder.mutation<UploadResponse, FormData>({
			query: data => ({
				url: '/upload/image',
				method: 'POST',
				body: data, // FormData will automatically include the file
			}),
		}),

		// Upload file endpoint
		uploadFile: builder.mutation<UploadResponse, FormData>({
			query: data => ({
				url: '/upload/file',
				method: 'POST',
				body: data, // FormData will automatically include the file
			}),
		}),

		// upload Multiple files endpoint
		uploadMultipleFiles: builder.mutation<UploadMultiResponse, FormData>({
			query: data => ({
				url: '/upload/files',
				method: 'POST',
				body: data, // FormData will automatically include the files
			}),
		}),

		// upload Multiple  Images endpoint
		uploadMultipleImages: builder.mutation<UploadMultiResponse, FormData>({
			query: data => ({
				url: '/upload/images',
				method: 'POST',
				body: data, // FormData will automatically include the files
			}),
		}),
	}),
	overrideExisting: false,
});

// Export the auto-generated hooks for usage in functional components
export const {
	useUploadImageMutation,
	useUploadFileMutation,
	useUploadMultipleFilesMutation,
	useUploadMultipleImagesMutation,
} = uploadApi;

export default uploadApi;
