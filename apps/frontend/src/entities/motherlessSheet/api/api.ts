import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets/';

export interface SpreadSheetResponse {
  majorDimension: 'ROWS';
  range: string;
  values: string[][];
}

export interface GetMotherlessSheetValuesArgs {
  sheetName: string;
  range: string;
}

export const motherlessSheetApi = createApi({
  reducerPath: 'motherlessSheetApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getSheetValues: builder.query<
      SpreadSheetResponse,
      GetMotherlessSheetValuesArgs
    >({
      query: ({ sheetName, range }) => {
        const spreadSheetId = import.meta.env.VITE_MOTHERLESS_SPREAD_SHEET_ID;
        const apiKey = import.meta.env.VITE_SPREAD_SHEET_API_KEY;
        return `${spreadSheetId}/values/${encodeURIComponent(sheetName)}!${range}?key=${apiKey}`;
      },
      // シートの編集頻度は高くないため、無駄な再取得を避けキャッシュを長めに保つ
      keepUnusedDataFor: 600,
    }),
  }),
});

export const { useGetSheetValuesQuery } = motherlessSheetApi;
