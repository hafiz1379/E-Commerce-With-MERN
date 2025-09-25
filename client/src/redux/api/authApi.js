import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import userApi from "./userApi";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query(body) {
        return { url: "/register", method: "POST", body };
      },
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    login: builder.mutation({
      query(body) {
        return { url: "/login", method: "POST", body };
      },
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.query({
      query: () => ({ url: "/logout", method: "post" }),
    }),
  }),
});

export default authApi;
export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } =
  authApi;
