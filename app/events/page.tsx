

import Events from "@/components/events";
import { serverInstance } from "../axiosInstance";
import { number, string } from "zod";



export default async function EventsPage({ searchParams }: {
  searchParams: {
    page?: string, limit?: string
  }
}) {
  let searchquery = await searchParams

  const page =
    typeof searchquery.page === "string"
      ? Number(searchquery.page)
      : 1

  const limit =
    typeof searchquery.page === "string"
      ? 2
      : 2


  const res = await serverInstance.get("/blogs/?type=event", {
        params: {
          page,
          limit
        }
      })

      const reswebinar = await serverInstance.get("/blogs?type=webnair")

      console.log(res)

  console.log(reswebinar)
  return (
    <>
      <Events eventData={res.data.data} page={res.data.page} limit={res.data.limit} total = {res.data.total} webinarData = {reswebinar.data.data} />

    </>);
}