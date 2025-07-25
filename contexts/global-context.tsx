"use client"
import { StoreInfoPrivate, StoreInfoPublic } from "@/app/dashboard/settings/setting.type";
import { getApi } from "@/lib/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

interface GlobalContextType {
    publicInfo: StoreInfoPublic | null;
    privateInfo: StoreInfoPrivate | null;
    loading: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [publicInfo, setPublicInfo] = useState<StoreInfoPublic | null>(null)
    const [privateInfo, setPrivateInfo] = useState<StoreInfoPrivate | null>(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const fetchStoreInfo = async () => {
        setLoading(true)
        const publicRes = await getApi<{ data: StoreInfoPublic }>("/store-info-public", false)
        let privateRes = null;
        if (user) {
            privateRes = await getApi<{ data: StoreInfoPrivate }>("/store-info-private", true)
        }
        if (privateRes?.success && privateRes.data) {
            setPrivateInfo(privateRes.data.data)
        }
        if (publicRes?.success && publicRes.data) {
            setPublicInfo(publicRes.data.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchStoreInfo()
    }, [])

    return (
        <GlobalContext.Provider value={{
            publicInfo,
            privateInfo,
            loading: loading
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobal = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error("useGlobal must be used within a GlobalProvider")  // Throw an error if the context is not provided by the parent component.
    }
    return context
}