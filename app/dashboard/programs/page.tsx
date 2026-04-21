import CoursesPage from "@/components/dashboard/Program/programPage"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursesPage />
    </Suspense>
  )
}