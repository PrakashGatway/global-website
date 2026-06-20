import UKLanding from "@/components/landingPages/uk";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Study in UK Consultant | Ooshas Global",

    description:
        "Looking for a UK education consultant? Ooshas Global helps students apply for Bachelor's and Master's in UK with scholarship, visa, APS, and university admission support.",

    keywords: [
        "UK education consultant",
        "Study abroad consultant for UK",
        "Masters in UK",
        "Bachelor in UK",
        "Scholarship in UK",
        "Top universities in UK",
        "Public universities in UK"
    ],

    openGraph: {
        title: "Study in UK Consultant | Ooshas Global",
        description:
            "Apply to top public universities in UK with expert admission, scholarship, APS, and visa guidance.",
        siteName: "Ooshas Global",
        images: [
            {
                url: "https://ooshasglobal.com/images/newlogo3.png",
                width: 1200,
                height: 630,
                alt: "Study in UK",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Study in UK Consultant",
        description:
            "UK education consultant for Bachelor's, Master's, scholarships and student visa support.",
        images: ["https://ooshasglobal.com/images/newlogo3.png"],
    }
};

export default function Page() {
    return <UKLanding />;
}