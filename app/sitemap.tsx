// app/sitemap.ts
import type { MetadataRoute } from "next";
import { baseUrl } from "./axiosInstance";

export const revalidate = 21600; // 6 hours

const myPath = "https://ooshasglobal.com";

async function getBlogs(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${baseUrl}/blogs?method=flaten`, {
      next: { revalidate: 21600 }
    });

    if (!res.ok) return [];

    const response = await res.json();

    const Blogs = response.data.filter((b: any) => b.blogType === "blog");
    const eventBlogs = response.data.filter((b: any) => b.blogType === "event");

    return [
      ...Blogs.map((b: any) => ({
        url: `${myPath}/blog/${b.slug}`,
        lastModified: b.updatedAt
          ? new Date(b.updatedAt)
          : new Date(),
        changeFrequency: "daily"

      })),
      ...eventBlogs.map((b: any) => ({
        url: `${myPath}/events/${b.slug}`,
        lastModified: b.updatedAt
          ? new Date(b.updatedAt)
          : new Date(),
        changeFrequency: "daily"
      })),
    ];
  } catch (error) {
    return [];
  }
}

async function getAllPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${baseUrl}/page-information?method=flaten`, {
      next: { revalidate: 21600 }
    });

    if (!res.ok) return [];

    const response = await res.json();
    const data = response.data;

    const urls: MetadataRoute.Sitemap = data
      .map((item: any) => {
        let path: string | null = null;

        switch (item.pageType) {
          case "about":
            path = `${myPath}/about`;
            break;

          case "contact":
            path = `${myPath}/contact`;
            break;

          case "career":
            path = `${myPath}/career`;
            break;

          case "service":
            if(item.slug === "service"){ path = `${myPath}/service`}
            else {path = `${myPath}/service/${item.slug}`}
            break;

          case "destinations":
            path = `${myPath}/universities/group/${item.slug}`;
            break;

          case "country":
            path = `${myPath}/destination/${item.slug}`;
            break;

          default:
            return null; // 👈 skip unknown types
        }

        return {
          url: path,
          lastModified: item.updatedAt
            ? new Date(item.updatedAt)
            : new Date(),
                  changeFrequency: "daily"

        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap; // 👈 removes null

    return urls;
  } catch (error) {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getBlogs();
  const allpages = await getAllPages();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${myPath}`,
      lastModified: new Date(),
      changeFrequency: "daily"
    },
    {
      url: `${myPath}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily"

    },
    {
      url: `${myPath}/events`,
      lastModified: new Date(),
      changeFrequency: "daily"

    },
    {
      url: `${myPath}/login`,
      lastModified: new Date(),
      changeFrequency: "daily"

    },
    {
      url: `${myPath}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "daily"

    },
    {
      url: `${myPath}/terms-condition`,
      lastModified: new Date(),
      changeFrequency: "daily"

    }
  ];

  return [
    ...staticUrls,
    ...blogs,
    ...allpages,
  ];
}