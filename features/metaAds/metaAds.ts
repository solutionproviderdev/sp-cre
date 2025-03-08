import apiSlice from '@/api/apiSlice';

// Define the type for an image associated with a product ad
export interface AdImage {
	url: string;
	project?: string;
	sqft?: number;
	budget?: number;
	pageId: string;
}

// Define the ProductAd type
export interface ProductAd {
	_id: string;
	name: string;
	images: AdImage[];
	description?: string;
	tags?: string[];
	createdAt: string;
	updatedAt: string;
}

// Define a simplified type for a product ad as returned for a lead
export interface ProductAdForLead {
	name: string;
	description?: string;
	images: AdImage[];
}

export const productAdsApi = apiSlice.injectEndpoints({
 
	endpoints: builder => ({
		// GET /api/ads - Get all product ads
		getAllProductAds: builder.query<ProductAd[], void>({
			query: () => '/meta-ads',
			providesTags: (result = [], error, arg) =>
				result
					? [
							...result.map(({ _id }) => ({
								type: 'ProductAd' as const,
								id: _id,
							})),
							{ type: 'ProductAd', id: 'LIST' },
					  ]
					: [{ type: 'ProductAd', id: 'LIST' }],
		}),

		// GET /api/ads/:id - Get a single product ad by ID
		getProductAdById: builder.query<ProductAd, string>({
			query: id => `/meta-ads/${id}`,
			providesTags: (result, error, id) => [{ type: 'ProductAd', id }],
		}),

		// POST /api/ads - Create a new product ad
		createProductAd: builder.mutation<ProductAd, Partial<ProductAd>>({
			query: newAd => ({
				url: '/meta-ads',
				method: 'POST',
				body: newAd,
			}),
			invalidatesTags: [{ type: 'ProductAd', id: 'LIST' }],
		}),

		// PUT /api/ads/:id - Update an existing product ad
		updateProductAd: builder.mutation<
			ProductAd,
			{ id: string; updates: Partial<ProductAd> }
		>({
			query: ({ id, updates }) => ({
				url: `/meta-ads/${id}`,
				method: 'PUT',
				body: updates,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'ProductAd', id }],
		}),

		// DELETE /api/ads/:id - Delete a product ad
		deleteProductAd: builder.mutation<{ message: string }, string>({
			query: id => ({
				url: `/meta-ads/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'ProductAd', id },
				{ type: 'ProductAd', id: 'LIST' },
			],
		}),

		// POST /api/ads/:id/images - Add a new image to an existing product ad
		addProductAdImage: builder.mutation<
			ProductAd,
			{ id: string; imageData: AdImage }
		>({
			query: ({ id, imageData }) => ({
				url: `/meta-ads/${id}/images`,
				method: 'POST',
				body: imageData,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'ProductAd', id }],
		}),

		// GET /api/ads/for-lead/:leadId - Get product ads for a lead based on its pageId and existing relations
		getProductAdsForLead: builder.query<ProductAdForLead[], string>({
			query: (leadId: string) => `/meta-ads/for-lead/${leadId}`,
			providesTags: (result, error, leadId) => [
				{ type: 'ProductAd', id: leadId },
			],
		}),
	}),
	overrideExisting: true,
});

export const {
	useGetAllProductAdsQuery,
	useGetProductAdByIdQuery,
	useCreateProductAdMutation,
	useUpdateProductAdMutation,
	useDeleteProductAdMutation,
	useAddProductAdImageMutation,
	useGetProductAdsForLeadQuery,
} = productAdsApi;

export default productAdsApi;
