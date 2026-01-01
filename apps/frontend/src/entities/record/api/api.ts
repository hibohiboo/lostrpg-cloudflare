import { createApi } from '@reduxjs/toolkit/query/react';
import { InferRequestType, InferResponseType } from 'hono/client';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';
import type { ApiType } from '@lostrpg/frontend/shared/lib/api/client';

type RecordsEndpointType = ApiType['characters'][':characterId']['records'];
type RecordEndpointType =
  ApiType['characters'][':characterId']['records'][':id'];
type RecordGetEndpointType = ApiType['characters']['records'][':id'];

export const recordApi = createApi({
  reducerPath: 'recordApi',
  baseQuery,
  tagTypes: ['Record', 'RecordList'],
  endpoints: (builder) => ({
    getRecord: builder.query<
      InferResponseType<RecordGetEndpointType['$get']>,
      string
    >({
      query: (id) => `/characters/records/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Record', id }],
    }),
    createRecord: builder.mutation<
      InferResponseType<RecordsEndpointType['$post']>,
      {
        characterId: string;
        data: InferRequestType<RecordsEndpointType['$post']>['json'];
      }
    >({
      query: ({ characterId, data }) => ({
        url: `/characters/${characterId}/records`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['RecordList'],
    }),
    updateRecord: builder.mutation<
      InferResponseType<RecordEndpointType['$put']>,
      {
        characterId: string;
        id: string;
        data: InferRequestType<RecordEndpointType['$put']>['json'];
      }
    >({
      query: ({ characterId, id, data }) => ({
        url: `/characters/${characterId}/records/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Record', id },
        'RecordList',
      ],
    }),
  }),
});

export const {
  useGetRecordQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
} = recordApi;
