import { createApi } from '@reduxjs/toolkit/query/react';
import { InferRequestType, InferResponseType } from 'hono/client';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';
import type { ApiType } from '@lostrpg/frontend/shared/lib/api/client';

type CampDetailType = ApiType['camps'][':id'];
type CampDetailData = Extract<
  InferResponseType<CampDetailType['$get']>,
  { id: string }
>;
export const campApi = createApi({
  reducerPath: 'campApi',
  baseQuery,
  tagTypes: ['Camp', 'CampList'],
  endpoints: (builder) => ({
    getCampList: builder.query<
      InferResponseType<ApiType['camps']['$get']>,
      void
    >({
      query: () => `/camps`,
      providesTags: ['CampList'],
    }),
    createCamp: builder.mutation<
      InferResponseType<ApiType['camps']['$post']>,
      InferRequestType<ApiType['camps']['$post']>['json']
    >({
      query: (data) => ({
        url: `/camps`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CampList'],
    }),
    getCamp: builder.query<CampDetailData, string>({
      query: (id) => `/camps/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Camp', id }],
    }),
    updateCamp: builder.mutation<
      void,
      { id: string; data: InferRequestType<CampDetailType['$put']>['json'] }
    >({
      query: ({ id, data }) => ({
        url: `/camps/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Camp', id },
        'CampList',
      ],
    }),
    deleteCamp: builder.mutation<void, string>({
      query: (id) => ({
        url: `/camps/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CampList'],
    }),
  }),
});
export const { useGetCampListQuery, useGetCampQuery } = campApi;
