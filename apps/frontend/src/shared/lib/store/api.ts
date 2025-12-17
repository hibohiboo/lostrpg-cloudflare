import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = '/api';

export const baseQuery = fetchBaseQuery({ baseUrl });
