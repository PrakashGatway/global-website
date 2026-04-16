import { serverInstance } from "@/app/axiosInstance";
import UniDetailsClient from "../../../components/new";

export async function generateMetadata({
  params
}:any){

  const { slug } = await params;
  try {
    const res = await serverInstance.get(`/universities/${slug}`);

    const uni = res?.data?.result;

    if (!uni) {
      return {
        title: "University Not Found",
        description: "No university data available",
      };
    }
    const seo = uni?.seo_metadata || {};
    return {
      title:
        seo.meta_title ||
        `${uni.name} | Study in ${uni.country} | Admission 2026`,
      description:
        seo.meta_description ||
        uni.short_description ||
        `Explore ${uni.name}, located in ${uni.city}, ${uni.country}.Check courses, fees, rankings, and admission details.`,
      keywords:
        seo.meta_keywords ||
        `${uni.name}, ${uni.city} university, study in ${uni.country}, ${uni.name} fees, ${uni.name} ranking`,
      alternates: {
        canonical:
          seo.canonical_tag ||
          `https://ooshasglobal.com/universities/${uni.slug}`,
      },
      openGraph: {
        title: seo.meta_title || uni.name,
        description:
          seo.meta_description || uni.short_description || "",
        url: `https://yourdomain.com/universities/${uni.slug}`,
        siteName: "Oosha's Global",
        images: [
          {
            url: uni.cover_photo || uni.uni_logo,
            width: 1200,
            height: 630,
            alt: uni.name,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seo.meta_title || uni.name,
        description:
          seo.meta_description || uni.short_description || "",
        images: [uni.cover_photo || uni.uni_logo],
      },
    };
  } catch (error) {
    return {
      title: "University",
      description: "University details page",
    };
  }
}

export default async function UniDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let universityData: any | null = null;
  let error: string | null = null;

  try {
    const res = await serverInstance.get<any>(`/universities/${slug}`);
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