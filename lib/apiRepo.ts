/* eslint-disable @typescript-eslint/no-explicit-any */

import { getApi, postApi, putApi, patchApi, deleteApi } from "./api";

export const apiRepo = {
    products: {
        findAll: async <T>(queryParams?: Record<string, any>, sendToken?: boolean) => {
            const query = generateQuery(queryParams);
            return await getApi<T>(`/products${query}`, sendToken);
        },

        findOne: async <T>(id: string | number, sendToken = false) => {
            return await getApi<T>(`/products/${id}`, sendToken);
        },

        create: async <T>(data: unknown, sendToken = true) => {
            return await postApi<T>("/products", data, sendToken);
        },

        update: async <T>(id: string | number, data: unknown, sendToken = true) => {
            return await putApi<T>(`/products/${id}`, data, sendToken);
        },

        patch: async <T>(id: string | number, data: unknown, sendToken = true) => {
            return await patchApi<T>(`/products/${id}`, data, sendToken);
        },

        delete: async <T>(id: string | number) => {
            return await deleteApi<T>(`/products/${id}`);
        },
    },

    users: {
        findAll: async <T>(queryParams?: Record<string, any>, sendToken = false) => {
            let query = "";
            if (queryParams) {
                const params = new URLSearchParams();
                Object.entries(queryParams).forEach(([key, value]) => {
                    params.append(key, String(value));
                });
                query = `?${params.toString()}`;
            }
            return await getApi<T>(`/users${query}`, sendToken);
        },

        findOne: async <T>(id: string | number, sendToken = false) => {
            return await getApi<T>(`/users/${id}`, sendToken);
        },

        create: async <T>(data: unknown, sendToken = true) => {
            return await postApi<T>("/users", data, sendToken);
        },

        update: async <T>(id: string | number, data: unknown, sendToken = true) => {
            return await putApi<T>(`/users/${id}`, data, sendToken);
        },

        patch: async <T>(id: string | number, data: unknown, sendToken = true) => {
            return await patchApi<T>(`/users/${id}`, data, sendToken);
        },

        delete: async <T>(id: string | number) => {
            return await deleteApi<T>(`/users/${id}`);
        },
    },
};


interface QueryParams {
    [key: string]: string | number | boolean;
}

function generateQuery(queryParams?: QueryParams) {
    let query = "";
    if (queryParams) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            params.append(key, String(value));
        });
        query = `?${params.toString()}`;
    }
    return query;
}