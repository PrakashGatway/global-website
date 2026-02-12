import ContactUsPage from "@/components/contactUs";
import { serverInstance } from "../axiosInstance";

export default async function page(){

  const res = await serverInstance.get("page-information/slug/contact")
    const Faqres= await  serverInstance.get("/faqs/public/list?type=General")




  return(
    <>
    <ContactUsPage contactData = {res.data.data} Faqres = {Faqres.data.data}/>

    </>
  )
}