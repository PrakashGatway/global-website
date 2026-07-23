import type React from "react";
import type { Metadata, Viewport } from "next";
import {
  Noto_Sans
,Montserrat } from "next/font/google";
import "./globals.css";
import "driver.js/dist/driver.css";
// import { Footer } from "@/components/Footer";
import { serverInstance } from "./axiosInstance";
import { GlobalProvider } from "@/src/statecontext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

// import BreadcrumbSchema from "@/components/BreadcrumbSchema";

// import WhatsAppButton from "@/components/whatsappbtn";

import dynamic from "next/dynamic";

const WhatsAppButton = dynamic(
  () => import("@/components/whatsappbtn")
);

const Navbar = dynamic(() => import("@/components/navbar"));

const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer));

const ptSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // PT Sans supports mainly 400 & 700
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
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
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {

  const [feature, countryres, unicat, footerRes] = await Promise.all([
    serverInstance.get("/page-information/navbar?isNavbar=true"),
    serverInstance.get("/page-information/navbar?isFeatured=true&type=country"),
    serverInstance.get("/universities/search"),
    serverInstance.get("/page-information/navbar?isFooter=true&type=country&limit=15"),
  ]);

  const featureRes = feature.data.data.filter(
    (item) => item.pageType === "destinations",
  );

  const servicedata = feature.data.data.filter(
    (item) => item.pageType === "service",
  );

  const footerData = footerRes?.data?.data

  const serviceres = servicedata.reverse();


  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" className="w-40 " />
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
          strategy="afterInteractive"
        ></Script>
        <Script>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-70R8MGMXBN');
          `}
        </Script>

        <Script id="gtm-script" strategy="afterInteractive">
          {`
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),
        dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-W6KTHRQZ');
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

        {/* <BreadcrumbSchema params={params} /> */}
      </head>

      <body
        className={`${ptSans.className} antialiased`}
        style={{ maxWidth: "1840px", margin: "0 auto" }}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W6KTHRQZ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <GlobalProvider>
          <Navbar
            Featureitem={featureRes || []}
            Serviceitem={serviceres || []}
            countryres={countryres.data.data}
            unicat={unicat.data.data}
          />

          {children}
          <Toaster position="top-center" reverseOrder={false} />

          <WhatsAppButton />

          <Footer
            Featureitem={featureRes || []}
            Serviceitem={serviceres || []}
            countryres={countryres.data.data}
            footerData={footerData}
          />
        </GlobalProvider>

          <Script id="disable-right-click" strategy="afterInteractive">
          {`
            document.addEventListener("contextmenu", function(e) {
              e.preventDefault();
            });
          `}
        </Script>
      </body>
    </html>
  );
}