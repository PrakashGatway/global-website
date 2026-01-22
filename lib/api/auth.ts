// Get API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Types
export interface LoginRequest {
  email: string
  password: string
  role?: 'admin' | 'manager' | 'counsellor' | 'user'
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  isEmailVerified?: boolean
}

export interface AuthResponse {
  success: boolean
  token?: string
  data?: User
  message?: string
}

export interface ApiError {
  success: false
  message: string
  path?: string
  method?: string
}

// Helper function to get token from localStorage
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

// Helper function to save token to localStorage
export const saveToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

// Helper function to save user to localStorage
export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('user', JSON.stringify(user))
}

// Helper function to get user from localStorage
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// Helper function to clear auth data
export const clearAuth = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<T> => {
  const token = getToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Only add token if available (optional for most endpoints)
  // requireAuth flag forces token requirement
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  } else if (requireAuth) {
    throw {
      success: false,
      message: 'Authentication required. Please login again.',
    } as ApiError
  }

  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle network errors or non-JSON responses
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        // If response is not JSON, create error from status
        errorData = {
          message: `Server error: ${response.status} ${response.statusText}`,
          path: endpoint,
          method: options.method || 'GET',
        }
      }

      // Handle 404 specifically
      if (response.status === 404) {
        const error: ApiError = {
          success: false,
          message: errorData.message || `API endpoint not found. Please check if backend server is running on ${API_BASE_URL}`,
          path: errorData.path || endpoint,
          method: errorData.method || options.method || 'GET',
        }
        throw error
      }

      const error: ApiError = {
        success: false,
        message: errorData.message || `Request failed with status ${response.status}`,
        path: errorData.path || endpoint,
        method: errorData.method || options.method || 'GET',
      }
      throw error
    }

    const data = await response.json()
    return data as T
  } catch (error: any) {
    // Handle network errors (server not reachable, CORS, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError: ApiError = {
        success: false,
        message: `Cannot connect to backend server. Please ensure the server is running on ${API_BASE_URL}`,
        path: endpoint,
        method: options.method || 'GET',
      }
      throw networkError
    }
    // Re-throw if it's already an ApiError
    throw error
  }
}

// Auth API functions
export const authApi = {
  /**
   * Login with email and role
   * @param credentials - Email and role
   * @returns Auth response with token and user data
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })

      if (response.success && response.token && response.data) {
        saveToken(response.token)
        saveUser(response.data)
      }

      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Auth response with token and user data
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      if (response.success && response.token && response.data) {
        saveToken(response.token)
        saveUser(response.data)
      }

      return response
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  },

  /**
   * Send OTP to email
   * @param email - User email
   * @param role - User role
   * @returns Success response with optional OTP (development mode)
   */
  sendOTP: async (
    email: string,
    role: 'admin' | 'manager' | 'counsellor' | 'user'
  ): Promise<{ success: boolean; message: string; otp?: string; isDevelopment?: boolean }> => {
    try {
      return await apiRequest<{ success: boolean; message: string; otp?: string; isDevelopment?: boolean }>(
        '/auth/send-otp',
        {
          method: 'POST',
          body: JSON.stringify({ email, role }),
        }
      )
    } catch (error) {
      console.error('Send OTP error:', error)
      throw error
    }
  },

  /**
   * Verify OTP and login
   * @param email - User email
   * @param otp - OTP code
   * @param role - User role
   * @returns Auth response with token and user data
   */
  verifyOTP: async (
    email: string,
    otp: string,
    role: 'admin' | 'manager' | 'counsellor' | 'user'
  ): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<AuthResponse>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp, role }),
      })

      if (response.success && response.token && response.data) {
        saveToken(response.token)
        saveUser(response.data)
      }

      return response
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw error
    }
  },

  /**
   * Get current user
   * @param useLocalStorage - If true, returns user from localStorage without API call
   * @returns User data
   */
  getMe: async (useLocalStorage: boolean = false): Promise<{ success: boolean; data: User }> => {
    try {
      // Option to get user from localStorage without API call
      if (useLocalStorage) {
        const user = getUser()
        if (user) {
          return { success: true, data: user }
        }
        throw { success: false, message: 'No user found in localStorage' } as ApiError
      }

      // Otherwise, fetch from API (requires token)
      const response = await apiRequest<{ success: boolean; data: User }>(
        '/auth/me',
        {
          method: 'GET',
        },
        true // Require auth for API call
      )

      if (response.success && response.data) {
        saveUser(response.data)
      }

      return response
    } catch (error) {
      console.error('Get me error:', error)
      throw error
    }
  },

  /**
   * Logout - clears auth data
   */
  logout: (): void => {
    clearAuth()
  },

  /**
   * Check if user is authenticated
   * @param requireToken - If true, requires token. If false, checks user in localStorage
   * @returns Boolean indicating if user is authenticated
   */
  isAuthenticated: (requireToken: boolean = false): boolean => {
    if (requireToken) {
      return !!getToken()
    }
    // Tokenless mode: check if user exists in localStorage
    return !!getUser()
  },
}
