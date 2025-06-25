"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { LoginCredentials, User } from "./types/auth"
import { getApi, postApi } from "./api"
import { AxiosRequestConfig } from "axios"



export async function login(credentials: LoginCredentials) {
  // Simulate API delay
  const response = await postApi<{ user: User, jwt: string }>("/auth/local", {
    identifier: credentials.email,
    password: credentials.password,
  })

  // Mock authentication - replace with actual auth logic
  if (response.success && response.data) {
    console.log(response.data)
    const cookieStore = await cookies()
    cookieStore.set("admin-auth-token", response.data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return { success: true, user: response.data }
  }
  return { success: false, error: "Invalid credentials" }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-auth-token")
  redirect("/auth")
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin-auth-token")?.value) {
    return null
  }

  const meReponse = await getApi<User>("/users/me", true)
  if (meReponse.success && meReponse.data) {
    return meReponse.data
  } else {
    redirect("/auth")
  }
}

interface HeaderConfig {
  token?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export async function getHeaders(config: HeaderConfig): Promise<AxiosRequestConfig> {
  const cookieStore = await cookies();
  const data = {}
  if (config.token) {
    Object.assign(data, {
      Authorization: `Bearer ${cookieStore.get("admin-auth-token")?.value}`,
      "Content-Type": "application/json",
    });
  } else {
    Object.assign(data, { "Content-Type": "application/json" });
  }
  return { headers: data } as AxiosRequestConfig
};
