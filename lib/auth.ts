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
  }, false)

  if (response.success && response.data) {
    const cookieStore = await cookies()
    const keyName = "auth-token"
    cookieStore.set(keyName, response.data.jwt, {
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
  cookieStore.delete("auth-token")
  return { successs: true }
  // redirect("/auth")
}

export async function getUser(): Promise<User | null> {

  const config = await getHeaders({ token: true })
  if (!config.headers?.Authorization) {
    console.log("no me api auth found")
    return null
  }

  const meReponse = await getApi<User>("/users/me?populate[0]=profile&populate[1]=role", true)
  if (meReponse.success && meReponse.data) {
    return meReponse.data
  } else {
    // redirect("/auth")
    return null
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
      Authorization: `Bearer ${cookieStore.get("auth-token")?.value}`,
      "Content-Type": "application/json",
    });
  } else {
    Object.assign(data, { "Content-Type": "application/json" });
  }
  return { headers: data } as AxiosRequestConfig
};
