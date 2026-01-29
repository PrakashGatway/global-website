import Blogs from "@/components/blog"
import { serverInstance } from "../axiosInstance"


export const dynamic = "force-dynamic"

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

  const blogres = await serverInstance.get("/blogs", {
    params: {
      page,
      limit,
      category
    },
  })

  console.log(searchquery.page)

  const blogcategory = await serverInstance.get("/blogs/categories")

  console.log(blogcategory)

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
