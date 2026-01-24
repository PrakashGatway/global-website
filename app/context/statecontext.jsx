"use client"
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

const Globalcontext = createContext()

export function GlobalProvider({children}){
    
      const [loading ,setLoading] = useState(true)
      const [profile , setProfile] = useState(null)
      const [authToken , setauthToken] = useState(null)
    
      
    
        const getProfile = async()=>{
           try {
          const res = await axiosInstance.get("/me")
          setProfile(res.data.data)
        } catch (err) {
          console.log("Not authorized")
        } finally {
          setLoading(false)
        }
      }

      const Logout = ()=>{
        localStorage.removeItem("token")
        setProfile(null)
        window.location.replace("/")
      }
      
    
    
useEffect(()=>{
const token = localStorage.getItem("token")

setauthToken(token)
if(token){
    getProfile()
}
else{
    setLoading(false)
}
},[])


return(
    <Globalcontext.Provider value={{
        profile,loading,Logout
    }}>
        {children}

    </Globalcontext.Provider>
)






}


export function useGlobal(){

    const context = useContext(Globalcontext)

    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}

