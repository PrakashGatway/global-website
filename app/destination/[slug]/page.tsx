import { serverInstance } from "@/app/axiosInstance";
import CountryDetails from "@/components/country";


export default async function Page({params}){

      const Universityres = await serverInstance.get("/universities?location_alias=ivy-league")

  const Faqres = await  serverInstance.get("/faqs/public/list?type=General")

  const {slug} = await params

  const Pageres =   await  serverInstance.get(`/page-information/slug/${slug}`)
  console.log(Pageres)






    return(
        <CountryDetails Universityres = {Universityres} Faqres = {Faqres} Pageres={Pageres.data}  />
    )
}