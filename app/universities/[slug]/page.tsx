// app/universities/[slug]/page.tsx

import { serverInstance } from "@/app/axiosInstance"
import UniversityPage from "@/components/Universitypage/university"

export default async function Page({ params }) {
  const { slug } = await params

  console.log(slug)

  const res = await serverInstance.get(
    `/page-information/public/${slug}`
  )

  return <UniversityPage data={res.data.data} />
}
