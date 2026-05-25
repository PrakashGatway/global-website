import CareerPage from "@/components/career";
import { serverInstance } from "../axiosInstance";


export default async function page(){

  const res = await serverInstance.get("/page-information/slug/career"); 
  return(
    <CareerPage careerData = {res.data.data}/>
  )
}