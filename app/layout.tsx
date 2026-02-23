import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google"
import Navbar from "@/components/navbar"
import "./globals.css"
import 'keen-slider/keen-slider.min.css';
import { Footer } from "@/components/Footer"
import { serverInstance } from "./axiosInstance"
import { GlobalProvider } from "@/src/statecontext"
import { Toaster } from "react-hot-toast";
import Script from "next/script"
import BreadcrumbSchema from "@/components/BreadcrumbSchema"






const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})


export const metadata: Metadata = {
  title: "Global Way - Your Education Ooshas Global",
  description: "Connect with top universities worldwide and find the perfect program for your educational journey",
  keywords: "education, universities, countries, study abroad, global education",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/images/fevi-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: any;
}>) {
  const [feature, countryres] = await Promise.all([
    serverInstance.get("/page-information/navbar?isNavbar=true"),
    serverInstance.get("/page-information/navbar?isFeatured=true&type=country"),
  ])




  const featureRes = feature.data.data.filter((item) =>
    item.pageType === "destinations"
  )

  const servicedata = feature.data.data.filter((item) =>
    item.pageType === "service"
  )


  const serviceres = servicedata.reverse()


  return (
    <html lang="en">

      <head>
        <link rel="icon" href="/images/fevi-icon.png" className="w-20 " />
        <meta name="google-site-verification" content="VU_q7Dhlnq-bXvbs2_KwmafQK7MCZMSeu_dHgPEiCtE" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z5PEF3NSXZ"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z5PEF3NSXZ');
          `}
        </Script>
        <BreadcrumbSchema  params={params}/>
    
      </head>


      <body className={`${notoSans.className} antialiased`}>
        <GlobalProvider>
        
          
        <Navbar Featureitem={featureRes || []} Serviceitem={serviceres || [] }
        countryres = {countryres.data.data}
        />
        
          {children}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
          />


          <Footer Featureitem={featureRes || []} Serviceitem={serviceres || []} countryres={countryres.data.data} />

        </GlobalProvider>


      </body>
    </html>
  )
}
