import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../config';

export const baseQuery = fetchBaseQuery({ baseUrl });
