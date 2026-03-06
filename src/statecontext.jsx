"use client"
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../app/axiosInstance";

const Globalcontext = createContext()
export function GlobalProvider({ children }) {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)
  
    const [authToken, setauthToken] = useState(null)

    const getProfile = async () => {
        try {
            const res = await axiosInstance.get("/auth/me")
            setProfile(res.data.data)
       
        } catch (err) {
            console.log("Not authorized")
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async () => {
        try {
            const res = await axiosInstance.get("/auth/me")
            setProfile(res.data.data)
        } catch (err) {
            console.log("Not authorized")
        }
    }

    const Logout =() => {
        setLoading(true)
        window.location.replace("/")
        localStorage.removeItem("token")
        setProfile(null)
        setLoading(false)
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        setauthToken(token)
        if (token) {
            getProfile()
        }
        else {
            if(window.location.pathname === "/dashboard"){
                window.location.replace("/")
            }
            setLoading(false)
        }
    }, [])


    return (
        <Globalcontext.Provider value={{
            profile, loading, Logout,updateProfile
        }}>
            {children}

        </Globalcontext.Provider>
    )
}

export function useGlobal() {
    const context = useContext(Globalcontext)

    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}

