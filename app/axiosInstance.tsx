import axios from "axios"

let mode = "dev"

const BASE_URL =
  mode === "dev"
    ? "http://localhost:5000/api/auth"
    : "http://localhost:5000/api/auth"


export const serverInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
//   withCredentials: true,
})


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
//   withCredentials: true,
})



axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)



axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status


    if (status === 401 || status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")

    
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  }
)

export const baseUrl = BASE_URL
export default axiosInstance
