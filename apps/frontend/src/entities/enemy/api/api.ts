import { createApi } from '@reduxjs/toolkit/query/react';
import { InferRequestType, InferResponseType } from 'hono/client';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';
import type { ApiType } from '@lostrpg/frontend/shared/lib/api/client';

type EnemyDetailType = ApiType['enemies'][':id'];
type EnemyDetailData = InferResponseType<EnemyDetailType['$get'], 200>;
type UploadImageType = ApiType['enemies'][':id']['upload-image'];
type UploadImageResponse = InferResponseType<UploadImageType['$post'], 200>;
type GetEnemyListResponse = InferResponseType<ApiType['enemies']['$get'], 200>;
export interface GetEnemyListArgs {
  offset: number;
  limit: number;
  name?: string;
  type?: string;
  sortBy?: 'updatedAt' | 'level';
  sortOrder?: 'asc' | 'desc';
}

export const enemyApi = createApi({
  reducerPath: 'enemyApi',
  baseQuery,
  tagTypes: ['Enemy', 'EnemyList'],
  endpoints: (builder) => ({
    getEnemyList: builder.query<GetEnemyListResponse, GetEnemyListArgs>({
      query: ({ offset, limit, name, type, sortBy, sortOrder }) => ({
        url: '/enemies',
        params: {
          offset,
          limit,
          ...(name ? { name } : {}),
          ...(type ? { type } : {}),
          ...(sortBy ? { sortBy, sortOrder } : {}),
        },
      }),
      // ページネーション（もっと読み込む）用に、検索語/絞り込み/並び順ごとにキャッシュをまとめて結合する
      serializeQueryArgs: ({ queryArgs, endpointName }) =>
        `${endpointName}-${queryArgs.name ?? ''}-${queryArgs.type ?? ''}-${queryArgs.sortBy ?? ''}-${queryArgs.sortOrder ?? ''}`,
      merge: (currentCache, newItems, { arg }) =>
        arg.offset === 0
          ? newItems
          : {
              data: [...currentCache.data, ...newItems.data],
              hasMore: newItems.hasMore,
            },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.offset !== previousArg?.offset ||
        currentArg?.name !== previousArg?.name ||
        currentArg?.type !== previousArg?.type ||
        currentArg?.sortBy !== previousArg?.sortBy ||
        currentArg?.sortOrder !== previousArg?.sortOrder,
      providesTags: ['EnemyList'],
    }),
    createEnemy: builder.mutation<
      InferResponseType<ApiType['enemies']['$post'], 201>,
      InferRequestType<ApiType['enemies']['$post']>['json']
    >({
      query: (data) => ({
        url: `/enemies`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['EnemyList'],
    }),
    getEnemy: builder.query<EnemyDetailData, string>({
      query: (id) => `/enemies/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Enemy', id }],
    }),
    updateEnemy: builder.mutation<
      void,
      { id: string; data: InferRequestType<EnemyDetailType['$put']>['json'] }
    >({
      query: ({ id, data }) => ({
        url: `/enemies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Enemy', id },
        'EnemyList',
      ],
    }),
    deleteEnemy: builder.mutation<void, string>({
      query: (id) => ({
        url: `/enemies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EnemyList'],
    }),
    uploadEnemyImage: builder.mutation<
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
          url: `/enemies/${id}/upload-image`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Enemy', id }],
    }),
  }),
});

export const {
  useGetEnemyListQuery,
  useGetEnemyQuery,
  useCreateEnemyMutation,
  useUpdateEnemyMutation,
  useDeleteEnemyMutation,
  useUploadEnemyImageMutation,
} = enemyApi;
