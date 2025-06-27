/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { getHeaders } from "@/lib/auth";
import { Media } from "./types/type";
export const mediaBaseUrl = "http://localhost:1337"
export const baseURL = "http://localhost:1337/api";
// export const baseURL = "https://api.sarvraj.com/api";
// Create axios instance
const api = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: unknown
}

// GET
export async function getApi<T>(url: string, sendToken?: boolean): Promise<ApiResponse<T>> {
    try {
        const config = await getHeaders({ token: sendToken })
        const response = await api.get<T>(url, config);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error };
    }
}

// POST
export async function postApi<T>(url: string, data: unknown, sendToken?: boolean): Promise<ApiResponse<T>> {
    try {
        const config = await getHeaders({ token: sendToken })
        const response = await api.post<T>(url, data, config);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error };
    }
}

// PUT
export async function putApi<T>(
    url: string,
    data?: unknown,
    sendToken?: boolean
): Promise<ApiResponse<T>> {
    try {
        const config = await getHeaders({ token: sendToken })
        const response = await api.put<T>(url, data, config);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false, error
        };
    }
}

// PATCH
export async function patchApi<T>(
    url: string,
    data?: unknown,
    sendToken?: boolean
): Promise<ApiResponse<T>> {
    try {
        const config = await getHeaders({ token: sendToken })
        const response = await api.patch<T>(url, data, config);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error };
    }
}

// DELETE
export async function deleteApi<T>(
    url: string,
): Promise<ApiResponse<T>> {
    try {
        const config = await getHeaders({ token: true })
        const response = await api.delete<T>(url, config);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error };
    }
}

// UPLOAD

export async function uploadToStrapi(files: File | File[]): Promise<Media[] | undefined> {
    // console.log(files)
    // console.log("inside upload to strapi")
    const formData = new FormData();

    if (Array.isArray(files)) {
        files.forEach((file) => {
            formData.append('files', file);
        });
    } else {
        formData.append('files', files);
    }

    try {
        const config = await getHeaders({ token: true })

        const response = await axios.post(`${baseURL}/upload`, formData, {
            headers: {
                "Authorization": config.headers?.Authorization
            }
        });
        if (response.data) {
            return response.data; // Array of uploaded file objects
        }
    } catch (err) {
        console.error('File upload failed:', err);
        throw err;
    }
}
