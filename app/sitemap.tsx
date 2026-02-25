// app/sitemap.ts
import type { MetadataRoute } from "next";
import { baseUrl } from "./axiosInstance";


export const revalidate = 21600;

const myPath = "https://api.ooshasglobal.com"

async function getBlogs(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${baseUrl}/blogs?method=flaten`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.log("API ERROR:", res.status);
      return [];
    }

    const response = await res.json();
     // ✅ array

   

    // ✅ filter
    const Blogs = response.data.filter((b: any) => b.blogType === "blog");
    const eventBlogs = response.data.filter((b: any) => b.blogType === "event");


    

   


    // ✅ map sitemap urls
    const urls: MetadataRoute.Sitemap = [
      ...Blogs.map((b: any) => ({
        url: `${myPath}/blog/${b.slug}`
      })),
      ...eventBlogs.map((b: any) => ({
        url: `${myPath}/events/${b.slug}`
      })),
    ];

    return urls; // ⭐ IMPORTANT
  } catch (error) {
    console.log("SITEMAP ERROR:", error);
    return [];
  }
}

async function getAllPages(): Promise<MetadataRoute.Sitemap> {
  try{
    const res = await fetch(`${baseUrl}/page-information?method=flaten`,{
      cache : "no-store"
    })
    if (!res.ok) {
      console.log("API ERROR:", res.status);
      return [];
    }

    const response = await res.json();
    const data = response.data;
    console.log(response, "all pages")

    const urls = data.map((item)=> {
      let path = ""

      switch(item.pageType){
        case "home":
          path = `${myPath}/`
          break

          case "about":
          path = `${myPath}/about`
          break

          case "contact":
          path = `${myPath}/contact`
          break

          case "career":
          path = `${myPath}/contact`
          break

          case "service":
          path = `${myPath}/service/${item.slug}`
          break

          case "destinations":
          path = `${myPath}/universities/group/${item.slug}`
          break

          case "country":
          path = `${myPath}/destination/${item.slug}`
          break
      }

      return {
        url : path
      }

      
    })
    console.log("length", urls.length)


    return urls
    
    


  }
  catch (error) {
    console.log("SITEMAP ERROR:", error);
    return [];
  }
}




export default async function sitemap() {
  const blogs = await getBlogs();
  const allpages = await getAllPages();

  return [
    {
      url: myPath
    },
    ...blogs,
    ...allpages
  ];
}
