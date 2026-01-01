import { createApi } from '@reduxjs/toolkit/query/react';
import { InferRequestType, InferResponseType } from 'hono/client';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';
import type { ApiType } from '@lostrpg/frontend/shared/lib/api/client';

type RecordsEndpointType = ApiType['characters'][':characterId']['records'];

export const recordApi = createApi({
  reducerPath: 'recordApi',
  baseQuery,
  tagTypes: ['Record', 'RecordList'],
  endpoints: (builder) => ({
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
  }),
});

export const { useCreateRecordMutation } = recordApi;
