import Homepage from "@/components/homepage";
import { baseUrl, serverInstance } from "./axiosInstance";



export default async function Home() {

      const res = await fetch(`${baseUrl}/page-information/slug/home`, {
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
        },
        next: { revalidate: 10800 }, // ⬅️ THIS ENABLES ISR
      });
    
      if (!res.ok) {
        throw new Error('Failed to fetch homepage data');
      }
    
      const { data } = await res.json();
      const homePage = data.sections;
    
      const resBlog = await serverInstance.get("/blogs?type=blog&limit=6")
  const Blogdata = resBlog.data.data || []


  const [destinationRes, imageRes] = await Promise.all([
  serverInstance.get(
    "/page-information/navbar?isFeatured=true&type=destinations&limit=6"
  ),
  serverInstance.get(
    "/testimonials?type=image"
  ),
])

 return <Homepage homePage = {homePage} Blogdata = {Blogdata} destinationData = {destinationRes.data.data} imageData = {imageRes.data.data}  />
}

