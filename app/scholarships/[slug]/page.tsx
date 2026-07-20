import axiosInstance, { serverInstance } from "@/app/axiosInstance";
import ScholarshipPage from "@/components/scholarshipPage";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await axiosInstance.get(`/scholarships/slug/${slug}`);
    const scholarshipData = response.data?.data;

    if (!response.data?.success || !scholarshipData) {
      return {
        title: "Scholarship Not Found",
        description: "The requested scholarship page could not be found.",
      };
    }
    return {
      title: scholarshipData.seoTitle || `${scholarshipData.name || "Scholarship"} Details`,
      description: scholarshipData.seoDescription || "View details and eligibility criteria for this scholarship.",
      keywords: scholarshipData.seoKeyword || "",
    };
  } catch (error) {
    return {
      title: "Scholarship Details",
      description: "Learn more about available scholarship opportunities.",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  try {
    const [scholarshipResponse, allScholarshipsResponse, faq] = await Promise.all([
      axiosInstance.get(`/scholarships/slug/${slug}`),
      axiosInstance.get("/scholarships/public/list"),
      serverInstance.get(`/faqs/public/list?type=${slug}&limit=15`),
    ]);

    const scholarshipData = scholarshipResponse.data;
    const allScholarships = allScholarshipsResponse.data;
    const faqres = faq.data;

    const scholarship = scholarshipData?.success ? scholarshipData.data : null;

    const contentTabs = scholarshipData?.success
      ? (scholarshipData.data?.extra_content?.sections ?? []).map((section: any) => ({
          id: section.section_key,
          label: section.heading,
          content: section.content ?? null,
        }))
      : [];

    return (
      <ScholarshipPage
        initialScholarship={scholarship}
        initialContentTabs={contentTabs}
        initialSimilar={allScholarships?.data ?? []}
        faqres={faqres?.data ?? []}
        error={scholarshipData?.success ? null : scholarshipData?.message || "Scholarship not found"}
        slug={slug}
      />
    );
  } catch (error) {
    console.error("Scholarship Page Error:", error);
    return (
      <ScholarshipPage
        initialScholarship={null}
        initialContentTabs={[]}
        initialSimilar={[]}
        faqres={[]}
        error="Failed to load scholarship details"
        slug={slug}
      />
    );
  }
}






// import axiosInstance from "@/app/axiosInstance";
// import ScholarshipPage from "@/components/scholarshipPage";

// interface PageProps {
//   params: Promise<{
//     slug: string;
//   }>;
// }

// export default async function Page({ params }: PageProps) {
//   const { slug } = await params;

//   try {
//     const [scholarshipResponse, allScholarshipsResponse] = await Promise.all([
//       axiosInstance.get(`/scholarships/slug/${slug}`),
//       axiosInstance.get("/scholarships/public/list"),
//     ]);

//     const scholarshipData = scholarshipResponse.data;
//     const allScholarships = allScholarshipsResponse.data;

//     const scholarship = scholarshipData?.success
//       ? scholarshipData.data
//       : null;

//     const contentTabs =
//       scholarshipData?.success
//         ? (scholarshipData.data?.extra_content?.sections ?? []).map(
//             (section: any) => ({
//               id: section.section_key,
//               label: section.heading,
//               content: section.content ?? null,
//             })
//           )
//         : [];

//     return (
//       <ScholarshipPage
//         initialScholarship={scholarship}
//         initialContentTabs={contentTabs}
//         initialSimilar={allScholarships?.data ?? []}
//         error={
//           scholarshipData?.success
//             ? null
//             : scholarshipData?.message || "Scholarship not found"
//         }
//         slug={slug}
//       />
//     );
//   } catch (error) {
//     console.error("Scholarship Page Error:", error);

//     return (
//       <ScholarshipPage
//         initialScholarship={null}
//         initialContentTabs={[]}
//         initialSimilar={[]}
//         error="Failed to load scholarship details"
//         slug={slug}
//       />
//     );
//   }
// }