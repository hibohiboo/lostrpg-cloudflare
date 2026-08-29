import { createApi } from '@reduxjs/toolkit/query/react';
import { InferRequestType, InferResponseType } from 'hono/client';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';
import type { ApiType } from '@lostrpg/frontend/shared/lib/api/client';

type ScenarioDetailType = ApiType['scenarios'][':id'];
type ScenarioDetailData = InferResponseType<ScenarioDetailType['$get'], 200>;
type UploadImageType = ApiType['scenarios'][':id']['upload-image'];
type UploadImageResponse = InferResponseType<UploadImageType['$post'], 200>;
type GetScenarioListResponse = InferResponseType<
  ApiType['scenarios']['$get'],
  200
>;
export interface GetScenarioListArgs {
  offset: number;
  limit: number;
  name?: string;
}

export const scenarioApi = createApi({
  reducerPath: 'scenarioApi',
  baseQuery,
  tagTypes: ['Scenario', 'ScenarioList'],
  endpoints: (builder) => ({
    getScenarioList: builder.query<
      GetScenarioListResponse,
      GetScenarioListArgs
    >({
      query: ({ offset, limit, name }) => ({
        url: '/scenarios',
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
      providesTags: ['ScenarioList'],
    }),
    createScenario: builder.mutation<
      InferResponseType<ApiType['scenarios']['$post'], 201>,
      InferRequestType<ApiType['scenarios']['$post']>['json']
    >({
      query: (data) => ({
        url: `/scenarios`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ScenarioList'],
    }),
    getScenario: builder.query<ScenarioDetailData, string>({
      query: (id) => `/scenarios/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Scenario', id }],
    }),
    updateScenario: builder.mutation<
      void,
      {
        id: string;
        data: InferRequestType<ScenarioDetailType['$put']>['json'];
      }
    >({
      query: ({ id, data }) => ({
        url: `/scenarios/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Scenario', id },
        'ScenarioList',
      ],
    }),
    deleteScenario: builder.mutation<void, string>({
      query: (id) => ({
        url: `/scenarios/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ScenarioList'],
    }),
    uploadScenarioImage: builder.mutation<
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
          url: `/scenarios/${id}/upload-image`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Scenario', id },
      ],
    }),
  }),
});
export const {
  useGetScenarioListQuery,
  useGetScenarioQuery,
  useUploadScenarioImageMutation,
} = scenarioApi;
