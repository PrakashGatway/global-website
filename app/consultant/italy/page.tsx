import ItalyLanding from "@/components/landingPages/italy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: " Study In Italy consultant | Ooshas Global",
  description:
    "Looking for a Germany education consultant? Ooshas Global helps students apply for Bachelor's and Master's in Germany with scholarship, visa, APS, and university admission support.",
  keywords: [
    "Study In Italy",
    "Masters in Italy",
    "MBBS in Italy",
    "Top Universities in Italy",
    "Scholarship in Italy",
    "Study Abroad Consultant for Italy",
    "Public Universities in Italy"
  ]
};

export default function Page() {
  return <ItalyLanding />;
}