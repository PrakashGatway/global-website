'use client'

import { useState, useEffect } from 'react'
import { getImageBySlug, getImagesBySlug, ImageType } from '../api/pageInformation'

/**
 * Hook to fetch a single image by slug and image type
 * @param slug - Page slug
 * @param imageType - Type of image
 * @param fallbackUrl - Fallback URL if image not found
 */
export function usePageImage(
  slug: string,
  imageType: ImageType,
  fallbackUrl?: string
): string | null {
  const [imageUrl, setImageUrl] = useState<string | null>(fallbackUrl || null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchImage() {
      setIsLoading(true)
      const url = await getImageBySlug(slug, imageType)
      
      if (isMounted) {
        setImageUrl(url || fallbackUrl || null)
        setIsLoading(false)
      }
    }

    fetchImage()

    return () => {
      isMounted = false
    }
  }, [slug, imageType, fallbackUrl])

  return imageUrl
}

/**
 * Hook to fetch multiple images at once
 * @param slug - Page slug
 * @param imageTypes - Array of image types to fetch
 * @param fallbacks - Object with fallback URLs for each image type
 */
export function usePageImages(
  slug: string,
  imageTypes: ImageType[],
  fallbacks?: Partial<Record<ImageType, string>>
): {
  images: Record<ImageType, string | null>
  isLoading: boolean
} {
  const [images, setImages] = useState<Record<ImageType, string | null>>(
    {} as Record<ImageType, string | null>
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchImages() {
      setIsLoading(true)
      const fetchedImages = await getImagesBySlug(slug, imageTypes)
      
      if (isMounted) {
        // Apply fallbacks for images that weren't found
        const finalImages: Record<string, string | null> = {}
        imageTypes.forEach((type) => {
          finalImages[type] = fetchedImages[type] || fallbacks?.[type] || null
        })
        setImages(finalImages as Record<ImageType, string | null>)
        setIsLoading(false)
      }
    }

    fetchImages()

    return () => {
      isMounted = false
    }
  }, [slug, imageTypes.join(','), JSON.stringify(fallbacks)])

  return { images, isLoading }
}
