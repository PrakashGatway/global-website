import { serverInstance } from "@/app/axiosInstance"
import Loading from "@/app/loading"
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

export default async function Page({params}){

    

    const { slug } = await params

    let blog: Blog

    try {
        const res = await serverInstance.get(`/blogs/${slug}`)
        blog = res.data.data
        console.log("Blog Data:", blog)
        console.log(blog.seo?.keywords)

    } catch (error) {
        console.error("Error fetching blog:", error)
        return notFound()
    }

    // ===== Latest Blogs =====
const latestRes = await serverInstance.get("/blogs?limit=4&sort=-createdAt")

const latestBlogs = latestRes.data.data


    const res = await serverInstance.get("/blogs/categories")
    const blogCategory = res.data.data
    console.log(blogCategory)

    // get all blogs ordered by date
const navRes = await serverInstance.get(
  "/blogs?type=blog"
);

const allBlogs = navRes.data.data;

    return(
        <>
        
        <BlogDetailsPage latestBlogs = {latestBlogs} blog= {blog} blogCategory= {blogCategory} allBlogs= {allBlogs} />
</>
    )
}