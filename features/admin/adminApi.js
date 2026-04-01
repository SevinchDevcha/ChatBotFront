import { baseApi } from '../../app/baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKnowledge: builder.query({
      query: () => '/admin/knowledge',
      providesTags: ['Knowledge'],
    }),

    uploadKnowledge: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/admin/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Knowledge'],
    }),

    deleteKnowledge: builder.mutation({
      query: (id) => ({
        url: `/admin/knowledge/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Knowledge'],
    }),
  }),
});

export const {
  useGetKnowledgeQuery,
  useUploadKnowledgeMutation,
  useDeleteKnowledgeMutation,
} = adminApi;
