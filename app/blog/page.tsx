import Blogs from "@/components/blog"
import { serverInstance } from "../axiosInstance"


export const dynamic = "force-dynamic"


export async function generateMetadata() {
  const res = await serverInstance.get("/blogs?type=blog");
  const seo = res.data.data.seoMeta;

  return {
    title: seo?.metaTitle?.trim() || "blogs",
    description: seo?.metaDescription,
    keywords: seo?.metaKeywords,
    alternates: {
      canonical: `${seo?.canonicalUrl || `https://ooshasglobal.com/blog/`}`
    },
    openGraph: {
      title: seo?.metaTitle,
      description: seo?.metaDescription,
      url: `/${seo?.canonicalUrl || "service"}`,
      type: "website"
    }
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string , category?: string }
}) {

  let searchquery = await searchParams
  const page =
    typeof searchquery.page === "string"
      ? Number(searchquery.page)
      : 1

  const limit =
    typeof searchquery.limit === "string"
      ? 9
      : 9

        const category =
    typeof searchquery.category === "string"
      ? searchquery.category
      : undefined

  const blogres = await serverInstance.get("/blogs?type=blog", {
    params: {
      page,
      limit,
      category
    },
  })

  console.log(blogres)

  const blogcategory = await serverInstance.get("/blogs/categories")

  

  return (
    <>
    <Blogs
      Blogdata={blogres.data.data}
      categoryData={blogcategory.data.data}
      page={blogres.data.page}
      limit={blogres.data.limit}
      total={blogres.data.total}
      categoryData={blogcategory.data.data}
    />

    


    </>
  )
}
