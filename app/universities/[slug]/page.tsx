// app/universities/[slug]/page.tsx  — SERVER COMPONENT (no "use client")

import { serverInstance } from "@/app/axiosInstance";
import UniDetailsClient from "../../../components/new";

interface UniversityData {
  _id: string;
  name: string;
  slug: string;
  uni_type: string;
  short_description: string;
  code: string;
  address: string;
  country: string;
  city: string;
  cover_photo?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  uni_logo: string;
  uni_web: string;
  uni_rank: Array<{
    type: string;
    rank: string;
    year?: string;
  }>;
  google_location: {
    lat: string;
    lng: string;
  };
  uni_contact: string;
  established_year: number;
  on_compus_accommodation: boolean;
  off_campus_accommodation: boolean;
  status: string;
  financials: {
    cost_of_living: string;
    ug_fees: string;
    pg_fees: string;
    other_fees: string;
  };
  location_alias: string;
  extra_content?: {
    _id: string;
    sections: Array<{
      section_key: string;
      heading: string;
      content: string;
      order: number;
      _id: string;
    }>;
    isPublished: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  seo_metadata?: {
    meta_title: string;
    meta_description: string;
    canonical_tag: string;
    meta_keywords: string;
  };
  createdAt: string;
  updatedAt: string;
  uni_gallery?: {
    images: string[];
    videos: string[];
  };
}

interface ApiResponse {
  success: boolean;
  result: UniversityData;
}


export default async function UniDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let universityData: UniversityData | null = null;
  let error: string | null = null;

  try {
    const res = await serverInstance.get<ApiResponse>(`/universities/${slug}`);
    if (res?.data?.success) {
      universityData = res.data.result;
    }
  } catch (err) {
    error = "Failed to load university data";
    console.error("Error fetching university data:", err);
  }

  const Universityres = await serverInstance.get("/universities?limit=5")
  
  const Faqres = await serverInstance.get(`/faqs/public/list?type=${slug}&limit=15`)

  if (!universityData) {
    return (
      <main className="min-h-[80vh] flex justify-center items-center bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading University Data
          </h1>
          <p className="text-slate-700">{error ?? "University not found"}</p>
          <a className="mt-6 inline-block underline text-blue-600" href="/">
            Go Home
          </a>
        </div>
      </main>
    );
  }


  return <UniDetailsClient data={universityData} Faqres={Faqres.data.data || []} Universityres={Universityres.data.result || []} />;
}