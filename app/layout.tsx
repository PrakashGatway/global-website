import type React from "react";
import type { Metadata, Viewport } from "next";
import {
  Noto_Sans
} from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import "keen-slider/keen-slider.min.css";
import { Footer } from "@/components/Footer";
import { serverInstance } from "./axiosInstance";
import { GlobalProvider } from "@/src/statecontext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

import WhatsAppButton from "@/components/whatsappbtn";
// export const dynamic = "force-dynamic";

const ptSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400","500","600","700"], // PT Sans supports mainly 400 & 700
  display: "swap",
});

export const revalidate = 600; // Revalidate every hour

export const metadata: Metadata = {
  title:
    "Ooshas Global – Study Abroad Consultants for UK, Germany, Italy & Australia",
  description:
    "Connect with top universities worldwide and find the perfect program for your educational journey",
  keywords:
    "education, universities, countries, study abroad, global education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  const [feature, countryres, unicat] = await Promise.all([
    serverInstance.get("/page-information/navbar?isNavbar=true"),
    serverInstance.get("/page-information/navbar?isFeatured=true&type=country"),
    serverInstance.get("/universities/search"),
  ]);

  const featureRes = feature.data.data.filter(
    (item) => item.pageType === "destinations",
  );

  const servicedata = feature.data.data.filter(
    (item) => item.pageType === "service",
  );

  const serviceres = servicedata.reverse();


  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/fevi-icon.png" className="w-20 " />
        <meta
          name="google-site-verification"
          content="VU_q7Dhlnq-bXvbs2_KwmafQK7MCZMSeu_dHgPEiCtE"
        />
        <meta
          name="google-site-verification"
          content="Z8XRz0UFtpmpZDjgpctrR8PbQLRZ5-08g7R6PsZj_Yw"
        />
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

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-70R8MGMXBN"
        ></Script>
        <Script>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-70R8MGMXBN');
          `}
        </Script>

        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RHBS4GW2Z0"
          strategy="afterInteractive"
        /> */}

        {/* <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-RHBS4GW2Z0');
  `}
        </Script> */}

        <BreadcrumbSchema params={params} />
      </head>

      <body
        className={`${ptSans.className} antialiased`}
        style={{ maxWidth: "1640px", margin: "0 auto" }}
      >
        <GlobalProvider>
          <Navbar
            Featureitem={featureRes || []}
            Serviceitem={serviceres || []}
            countryres={countryres.data.data}
            unicat={unicat.data.data}
          />

          {children}
          <Toaster position="bottom-right" reverseOrder={false} />

          <WhatsAppButton />

          <Footer
            Featureitem={featureRes || []}
            Serviceitem={serviceres || []}
            countryres={countryres.data.data}
          />
        </GlobalProvider>
      </body>
    </html>
  );
}
