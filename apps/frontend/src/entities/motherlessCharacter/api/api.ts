import { createApi } from '@reduxjs/toolkit/query/react';
import { InferRequestType, InferResponseType } from 'hono/client';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';
import type { ApiType } from '@lostrpg/frontend/shared/lib/api/client';

export type MotherlessCharacterDetailType =
  ApiType['motherless-characters'][':id'];
type MotherlessCharacterDetailData = InferResponseType<
  MotherlessCharacterDetailType['$get'],
  200
>;
type UploadImageType =
  ApiType['motherless-characters'][':id']['upload-image'];
type UploadImageResponse = InferResponseType<UploadImageType['$post'], 200>;

type GetMotherlessCharacterListResponse = InferResponseType<
  ApiType['motherless-characters']['$get'],
  200
>;
export interface GetMotherlessCharacterListArgs {
  offset: number;
  limit: number;
  name?: string;
}

export const motherlessCharacterApi = createApi({
  reducerPath: 'motherlessCharacterApi',
  baseQuery,
  tagTypes: ['MotherlessCharacter', 'MotherlessCharacterList'],
  endpoints: (builder) => ({
    getMotherlessCharacterList: builder.query<
      GetMotherlessCharacterListResponse,
      GetMotherlessCharacterListArgs
    >({
      query: ({ offset, limit, name }) => ({
        url: '/motherless-characters',
        params: {
          offset,
          limit,
          ...(name ? { name } : {}),
        },
      }),
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
      providesTags: ['MotherlessCharacterList'],
    }),
    createMotherlessCharacter: builder.mutation<
      InferResponseType<ApiType['motherless-characters']['$post'], 201>,
      InferRequestType<ApiType['motherless-characters']['$post']>['json']
    >({
      query: (data) => ({
        url: `/motherless-characters`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MotherlessCharacterList'],
    }),
    getMotherlessCharacter: builder.query<MotherlessCharacterDetailData, string>({
      query: (id) => `/motherless-characters/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'MotherlessCharacter', id },
      ],
    }),
    updateMotherlessCharacter: builder.mutation<
      void,
      {
        id: string;
        data: InferRequestType<MotherlessCharacterDetailType['$put']>['json'];
      }
    >({
      query: ({ id, data }) => ({
        url: `/motherless-characters/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'MotherlessCharacter', id },
        'MotherlessCharacterList',
      ],
    }),
    deleteMotherlessCharacter: builder.mutation<void, string>({
      query: (id) => ({
        url: `/motherless-characters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MotherlessCharacterList'],
    }),
    uploadMotherlessCharacterImage: builder.mutation<
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
          url: `/motherless-characters/${id}/upload-image`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'MotherlessCharacter', id },
      ],
    }),
  }),
});

export const {
  useGetMotherlessCharacterListQuery,
  useGetMotherlessCharacterQuery,
  useCreateMotherlessCharacterMutation,
  useUpdateMotherlessCharacterMutation,
  useDeleteMotherlessCharacterMutation,
  useUploadMotherlessCharacterImageMutation,
} = motherlessCharacterApi;
