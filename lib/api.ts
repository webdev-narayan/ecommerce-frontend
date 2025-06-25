import axios from "axios";
import { getHeaders } from "@/lib/auth";
export  const  mediaBaseUrl = "http://localhost:1337"
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
