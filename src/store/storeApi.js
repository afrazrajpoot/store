"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  tagTypes: ["products", "order"], // Define tag types
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: `/api/products`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
    getProducts: builder.query({
      query: () => `/api/products`,
      providesTags: ["products"],
    }),
    getProductById: builder.query({
      query: (id) => `/api/products?id=${id}`,
      providesTags: ["products"],
    }),
    updateProduct: builder.mutation({
      query: (formData) => ({
        url: `/api/products?id=${formData.get("id")}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: `/api/order`,
        method: "POST",
        body: data,
      }),
    }),
    getOrders: builder.query({
      query: ({ page, limit }) => `/api/order?page=${page}&limit=${limit}`,
      providesTags: ["order"],
    }),
    completeOrder: builder.mutation({
      query: (data) => ({
        url: `/api/completeorder`,
        method: "POST",
        body: data,
      }),
    }),

    loginAdmin: builder.mutation({
      query: (data) => ({
        url: `/api/login`,
        method: "POST",
        body: data,
      }),
    }),
    uploadImages: builder.mutation({
      query: (data) => ({
        url: `/api/uploadHeroImages`,
        method: "POST",
        body: data,
      }),
    }),
    getImages: builder.query({
      query: () => `/api/uploadHeroImages`,
    }),
    getProduct0: builder.query({
      query: (id) => `/api/get-product-0`,
    }),
    sentShipmentMessage: builder.mutation({
      query: (data) => ({
        url: `/api/sent-shipmentMessage`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useCompleteOrderMutation,
  useLoginAdminMutation,
  useUploadImagesMutation,
  useGetImagesQuery, // Ensure this is exported
  useGetProduct0Query,
  useSentShipmentMessageMutation,
} = storeApi;
