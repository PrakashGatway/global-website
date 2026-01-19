'use client'

import { useState, useEffect } from 'react'
import { getPageInformationBySlug, type PageInformation } from '../api/pageInformation'

/**
 * Generic hook to fetch page information for any page by slug
 * Works for: home, about, contact, and any future pages
 * 
 * @param slug - Page slug (e.g., 'home', 'about', 'contact', 'services', etc.)
 * @returns Page information, loading state, and error
 * 
 * @example
 * ```tsx
 * // In any page component
 * const { pageData, isLoading, error } = usePage('home')
 * 
 * // Or for about page
 * const { pageData, isLoading, error } = usePage('about')
 * ```
 */
export function usePage(slug: string) {
  const [pageData, setPageData] = useState<PageInformation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchPage() {
      setIsLoading(true)
      setError(null)
      
      try {
        const data = await getPageInformationBySlug(slug)
        
        if (isMounted) {
          setPageData(data)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch page'))
          setIsLoading(false)
        }
      }
    }

    if (slug) {
      fetchPage()
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [slug])

  return { pageData, isLoading, error }
}

/**
 * Utility function to get page slug from route path
 * Automatically converts route paths to slugs
 * 
 * @param pathname - Current route path (e.g., '/', '/about', '/contact')
 * @returns Page slug (e.g., 'home', 'about', 'contact')
 * 
 * @example
 * ```tsx
 * const slug = getSlugFromPath('/') // returns 'home'
 * const slug = getSlugFromPath('/about') // returns 'about'
 * const slug = getSlugFromPath('/contact-us') // returns 'contact-us'
 * ```
 */
export function getSlugFromPath(pathname: string): string {
  // Remove leading and trailing slashes
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '')
  
  // If empty or just '/', return 'home'
  if (!cleanPath || cleanPath === '') {
    return 'home'
  }
  
  // Return the path as slug
  return cleanPath
}

/**
 * Utility function to get page slug from Next.js usePathname hook
 * 
 * @param pathname - Pathname from usePathname() hook
 * @returns Page slug
 */
export function getPageSlug(pathname: string): string {
  return getSlugFromPath(pathname)
}
