import axios from "axios"

let mode = "dev2"

const BASE_URL =
  mode === "dev"
    ? "http://localhost:5000/api"
    : "https://api.ooshasglobal.com/api"


const BASE_IMF_URL =
  mode === "dev"
    ? "http://localhost:5000"
    : "https://api.ooshasglobal.com"


export const serverInst = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
})

export const serverInstance = {
  async get<T = any>(
    url: string,
    config?: any & {
      revalidate?: number;
      tags?: string[];
    }
  ) {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(config?.headers as HeadersInit),
      },
      next: {
        revalidate: config?.revalidate ?? 600, // default 10 minutes
        tags: config?.tags,
      }
    });

    if (!res.ok) {
      throw new Error(`GET ${url} failed (${res.status})`);
    }

    return {
      data: (await res.json()) as T,
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
    };
  }
};

export const fileBaseurl = (data) => {
  return `${BASE_IMF_URL}${data}`
}

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


        // window.location.href = "/"
      }
    }
    return Promise.reject(error)
  }
)

export const baseUrl = BASE_URL
export default axiosInstance