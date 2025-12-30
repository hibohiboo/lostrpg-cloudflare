import { createApi } from '@reduxjs/toolkit/query/react';
import { InferRequestType, InferResponseType } from 'hono/client';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';
import type { ApiType } from '@lostrpg/frontend/shared/lib/api/client';

type CampDetailType = ApiType['camps'][':id'];
type CampDetailData = InferResponseType<CampDetailType['$get']>;
type UploadImageType = ApiType['camps'][':id']['upload-image'];
type UploadImageResponse = InferResponseType<UploadImageType['$post']>;
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
    getCampCharacters: builder.query<
      InferResponseType<CampDetailType['characters']['$get']>,
      string
    >({
      query: (id) => `/camps/${id}/characters`,
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
    uploadCampImage: builder.mutation<
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
          url: `/camps/${id}/upload-image`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Camp', id }],
    }),
  }),
});
export const {
  useGetCampListQuery,
  useGetCampQuery,
  useUploadCampImageMutation,
  useGetCampCharactersQuery,
} = campApi;
