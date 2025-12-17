import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@lostrpg/frontend/shared/lib/store/api';

type ListItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const campApi = createApi({
  reducerPath: 'campApi',
  baseQuery,
  endpoints: (builder) => ({
    getCampList: builder.query<ListItem[], void>({
      query: () => `/camps`,
    }),
  }),
});
export const { useGetCampListQuery } = campApi;
