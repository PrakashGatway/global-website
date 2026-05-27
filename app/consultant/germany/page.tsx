import GermanyLanding from "@/components/landingPages/germany";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Study in Germany Consultant | Ooshas Global",

    description:
        "Looking for a Germany education consultant? Ooshas Global helps students apply for Bachelor's and Master's in Germany with scholarship, visa, APS, and university admission support.",

    keywords: [
        "Germany education consultant",
        "Study abroad consultant for Germany",
        "Masters in Germany",
        "Bachelor in Germany",
        "Scholarship in Germany",
        "Top universities in Germany",
        "Public universities in Germany"
    ],

    openGraph: {
        title: "Study in Germany Consultant | Ooshas Global",
        description:
            "Apply to top public universities in Germany with expert admission, scholarship, APS, and visa guidance.",
        siteName: "Ooshas Global",
        images: [
            {
                url: "https://ooshasglobal.com/images/newlogo3.png",
                width: 1200,
                height: 630,
                alt: "Study in Germany",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Study in Germany Consultant",
        description:
            "Germany education consultant for Bachelor's, Master's, scholarships and student visa support.",
        images: ["https://ooshasglobal.com/images/newlogo3.png"],
    }
};

export default function Page() {
    return <GermanyLanding />;
}