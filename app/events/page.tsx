import Events from "@/components/events";
import { serverInstance } from "../axiosInstance";
import { number, string } from "zod";

export const dynamic = "force-dynamic";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
  };
}) {
  let searchquery = await searchParams;

  const page = Number(searchquery.page) || 1;
  const limit = Number(searchquery.limit) || 1;
  const type = searchquery.type || "event";

  let res;

  if (type === "webnair") {
    res = await serverInstance.get(
      `/blogs?type=webnair&page=${page}&limit=${limit}`,
    );
  } else {
    res = await serverInstance.get(
      `/blogs?type=event&page=${page}&limit=${limit}`,
    );
  }
  return (
    <>
      <Events
        data={res.data.data}
        page={res.data.page}
        limit={res.data.limit}
        total={res.data.total}
        type={type}
      />
    </>
  );
}
