import { createApi } from '@reduxjs/toolkit/query/react';
import { InferRequestType, InferResponseType } from 'hono/client';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';
import type { ApiType } from '@lostrpg/frontend/shared/lib/api/client';

type BossDetailType = ApiType['bosses'][':id'];
type BossDetailData = InferResponseType<BossDetailType['$get'], 200>;
type UploadImageType = ApiType['bosses'][':id']['upload-image'];
type UploadImageResponse = InferResponseType<UploadImageType['$post'], 200>;
type GetBossListResponse = InferResponseType<ApiType['bosses']['$get'], 200>;
export interface GetBossListArgs {
  offset: number;
  limit: number;
  name?: string;
}

export const bossApi = createApi({
  reducerPath: 'bossApi',
  baseQuery,
  tagTypes: ['Boss', 'BossList'],
  endpoints: (builder) => ({
    getBossList: builder.query<GetBossListResponse, GetBossListArgs>({
      query: ({ offset, limit, name }) => ({
        url: '/bosses',
        params: {
          offset,
          limit,
          ...(name ? { name } : {}),
        },
      }),
      // ページネーション（もっと読み込む）用に、検索語ごとにキャッシュをまとめて結合する
      serializeQueryArgs: ({ queryArgs, endpointName }) =>
        `${endpointName}-${queryArgs.name ?? ''}`,
      merge: (currentCache, newItems, { arg }) =>
        arg.offset === 0
          ? newItems
          : {
              data: [...currentCache.data, ...newItems.data],
              hasMore: newItems.hasMore,
            },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.offset !== previousArg?.offset ||
        currentArg?.name !== previousArg?.name,
      providesTags: ['BossList'],
    }),
    createBoss: builder.mutation<
      InferResponseType<ApiType['bosses']['$post'], 201>,
      InferRequestType<ApiType['bosses']['$post']>['json']
    >({
      query: (data) => ({
        url: `/bosses`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BossList'],
    }),
    getBoss: builder.query<BossDetailData, string>({
      query: (id) => `/bosses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Boss', id }],
    }),
    updateBoss: builder.mutation<
      void,
      { id: string; data: InferRequestType<BossDetailType['$put']>['json'] }
    >({
      query: ({ id, data }) => ({
        url: `/bosses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Boss', id },
        'BossList',
      ],
    }),
    deleteBoss: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bosses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BossList'],
    }),
    uploadBossImage: builder.mutation<
      UploadImageResponse,
      { id: string; image: File; password?: string }
    >({
      query: ({ id, image, password }) => {
        const formData = new FormData();
        formData.append('image', image);
        if (password) {
          formData.append('password', password);
        }
        return {
          url: `/bosses/${id}/upload-image`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Boss', id }],
    }),
  }),
});

export const {
  useGetBossListQuery,
  useGetBossQuery,
  useCreateBossMutation,
  useUpdateBossMutation,
  useDeleteBossMutation,
  useUploadBossImageMutation,
} = bossApi;
