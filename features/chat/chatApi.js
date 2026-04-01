import { baseApi } from '../../app/baseApi';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ userId, message, chatId }) => ({
        url: '/chat',
        method: 'POST',
        body: { userId, message, chatId },
      }),
      invalidatesTags: (_result, _err, { userId }) => [{ type: 'Chats', id: userId }],
    }),

    getHistory: builder.query({
      query: (chatId) => `/history/${chatId}`,
      providesTags: (_result, _err, chatId) => [{ type: 'History', id: chatId }],
    }),

    getUserChats: builder.query({
      query: (userId) => `/chats/${userId}`,
      providesTags: (_result, _err, userId) => [{ type: 'Chats', id: userId }],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useLazyGetHistoryQuery,
  useGetUserChatsQuery,
} = chatApi;
