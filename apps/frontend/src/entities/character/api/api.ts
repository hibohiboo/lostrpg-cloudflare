import { createApi } from '@reduxjs/toolkit/query/react';
import { InferRequestType, InferResponseType } from 'hono/client';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';
import type { ApiType } from '@lostrpg/frontend/shared/lib/api/client';

export type CharacterDetailType = ApiType['characters'][':id'];
type CharacterDetailData = InferResponseType<CharacterDetailType['$get']>;
type UploadImageType = ApiType['characters'][':id']['upload-image'];
type UploadImageResponse = InferResponseType<UploadImageType['$post']>;

export const characterApi = createApi({
  reducerPath: 'characterApi',
  baseQuery,
  tagTypes: ['Character', 'CharacterList'],
  endpoints: (builder) => ({
    getCharacterList: builder.query<
      InferResponseType<ApiType['characters']['$get']>,
      void
    >({
      query: () => `/characters`,
      providesTags: ['CharacterList'],
    }),
    createCharacter: builder.mutation<
      InferResponseType<ApiType['characters']['$post']>,
      InferRequestType<ApiType['characters']['$post']>['json']
    >({
      query: (data) => ({
        url: `/characters`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CharacterList'],
    }),
    getCharacter: builder.query<CharacterDetailData, string>({
      query: (id) => `/characters/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Character', id }],
    }),
    updateCharacter: builder.mutation<
      void,
      {
        id: string;
        data: InferRequestType<CharacterDetailType['$put']>['json'];
      }
    >({
      query: ({ id, data }) => ({
        url: `/characters/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Character', id },
        'CharacterList',
      ],
    }),
    deleteCharacter: builder.mutation<void, string>({
      query: (id) => ({
        url: `/characters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CharacterList'],
    }),
    uploadCharacterImage: builder.mutation<
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
          url: `/characters/${id}/upload-image`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Character', id }],
    }),
    getCharacterRecords: builder.query<
      InferResponseType<CharacterDetailType['records']['$get']>,
      string
    >({
      query: (id) => `/characters/${id}/records`,
      providesTags: (_result, _error, id) => [{ type: 'Character', id }],
    }),
  }),
});

export const {
  useGetCharacterListQuery,
  useGetCharacterQuery,
  useCreateCharacterMutation,
  useUpdateCharacterMutation,
  useDeleteCharacterMutation,
  useUploadCharacterImageMutation,
  useGetCharacterRecordsQuery,
} = characterApi;
