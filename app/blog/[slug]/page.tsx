import { serverInstance } from "@/app/axiosInstance"

import BlogDetailsPage from "@/components/blogDetails"
import { notFound } from "next/navigation"


// Define types
interface BlogSEO {
    metaTitle: string
    metaDescription: string
    keywords: string[]
}

interface Blog {
    _id: string
    title: string
    slug: string
    description: string
    shortDescription: string
    coverImage: string
    seo: BlogSEO
    tags: string[]
    status: string
    isFeatured: boolean
    views: number
    createdAt: string
    updatedAt: string
    __v: number
}



export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await serverInstance.get(`/blogs/${slug}`);
    const blog = res.data.data;

    const createdDate = new Date(blog.createdAt);

    // ✅ Fixed cutoff date (10 Jan 2026)
    const cutoffDate = new Date("2026-04-10");

    // ❗ condition: blog older than cutoff → noindex
    const noIndex = createdDate < cutoffDate;

    return {
      title: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.shortDescription,
      keywords: blog.seo?.keywords || [],

      robots: {
        index: !noIndex,
        follow: true,
      },

      openGraph: {
        title: blog.seo?.metaTitle || blog.title,
        description: blog.seo?.metaDescription || blog.shortDescription,
        images: [blog.coverImage],
      },
    };
  } catch (error) {
    return {
      title: "Blog Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function Page({ params }) {

    const { slug } = await params
    let blog: Blog
    try {
        const res = await serverInstance.get(`/blogs/${slug}`)
        blog = res.data.data
        console.log(blog.seo?.keywords)

    } catch (error) {
        console.error("Error fetching blog:", error)
        return notFound()
    }

    // ===== Latest Blogs =====
    const latestRes = await serverInstance.get("/blogs?limit=4&sort=-createdAt")

    const latestBlogs = latestRes.data.data


    const res = await serverInstance.get("/blogs/categories?limit=50")
    const blogCategory = res.data.data

    // get all blogs ordered by date
    const navRes = await serverInstance.get(
        "/blogs?type=blog"
    );

    const allBlogs = navRes.data.data;
 console.log(blogCategory,"hhh")
    return (
        <>

            <BlogDetailsPage latestBlogs={latestBlogs} blog={blog} blogCategory={blogCategory} allBlogs={allBlogs} />
        </>
    )
}