import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  MapPin,
  GraduationCap,
  BookOpen,
  IndianRupee,
  ShieldCheck,
  Globe,
  Users,
  Award,
  Building2
} from 'lucide-react';
import UniversityFilters, { MainUniversityFilters } from '@/components/Universitypage/universityFilters';
import UniversityList, { StudyStats, UniversityOverview } from '@/components/Universitypage/universityList';
import { UniversityListSkeleton } from '@/components/Universitypage/universityCard';
import axiosInstance, { serverInstance, serverInst } from '@/app/axiosInstance';
import FAQSection, { UniversityFAQSection } from '@/components/faqPage';
import { ContentSection, CTASection, EligibilityCriteriaSection, UniversityContentSection, WhyStudySection } from '@/components/country';
import NotFound from '@/app/not-found';
import { WhyStudySectionUniversity } from '@/components/Universitypage/WhyChooseSection';

// Types
interface University {
  _id: string;
  name: string;
  slug: string;
  address: string;
  image?: string;
  logo?: string;
  extra_content?: {
    fees?: string;
    language?: string;
  };
}

interface UniversitiesResponse {
  success: boolean;
  result: University[];
  total: number;
  page: number;
  totalPages: number;
}

interface PageData {
  success: boolean;
  data: {
    _id: string;
    title: string;
    subTitle: string;
    isNavbar: boolean;
    navbarTitle: string;
    description: string;
    pageType: string;
    cardImage: string;
    navbarImage: string;
    country: string | null;
    slug: string;
    status: string;
    isFeatured: boolean;
    isFooter: boolean;
    seoMeta: {
      metaTitle: string;
      metaDescription: string;
      metaKeywords: string;
      canonicalUrl: string;
    };
    city: string;
    state: string;
    sections: {
      hero?: {
        __order__: number;
        __originalName__: string;
        __isDuplicate__: boolean;
        title: string;
        tag: string;
        subtitle: string;
        heroImage: string;
      };
      stats?: {
        __order__: number;
        __originalName__: string;
        __isDuplicate__: boolean;
        items: Array<{
          title: string;
          description: string;
          stats: string;
          icon: string;
        }>;
      };
      universityOverview?: {
        __order__: number;
        __originalName__: string;
        __isDuplicate__: boolean;
        isHidden: string;
        title: string;
        tag: string;
        description: string;
        features: Array<{
          icon: string;
          title: string;
          description: string;
        }>;
      };
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = "find-universities-main-page"

  try {
    const res = await serverInst.get(`/page-information/slug/${slug}?type=university`);
    const pageData = res.data.data;
    const seo = pageData?.seoMeta;

    return {
      title: seo?.metaTitle?.trim() || pageData?.title || slug,
      description: seo?.metaDescription || pageData?.description || '',
      keywords: seo?.metaKeywords || '',
      // alternates: {
      //   canonical: `/${seo?.canonicalUrl || `universities/${slug}`}`,
      // },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: seo?.metaTitle || pageData?.title,
        description: seo?.metaDescription || pageData?.description,
        type: "website",
        images: pageData?.cardImage ? [pageData.cardImage] : [],
      },
    };
  } catch (error) {
    console.error('Error fetching page metadata:', error);
    return {
      title: 'Find Universities',
      description: 'Discover top universities worldwide',
    };
  }
}

async function getUniversities(searchParams: {
  page?: string;
  keyword?: string;
  country?: string;
  city?: string;
  type?: string;
  intake?: string;
  limit?: string;
}): Promise<UniversitiesResponse> {
  try {
    const params = new URLSearchParams();

    if (searchParams.page) params.append('page', searchParams.page);
    if (searchParams.keyword) params.append('name', searchParams.keyword);
    if (searchParams.country) params.append('country', searchParams.country);
    if (searchParams.city) params.append('city', searchParams.city);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.intake) params.append('intake', searchParams.intake);
    params.append("limit", "12");
    params.append('populateExtra', 'false');

    const res = await serverInst.get(`/universities?${params.toString()}`);

    if (res.data.success) {
      return res.data;
    }

    return {
      success: false,
      result: [],
      total: 0,
      page: 1,
      totalPages: 0
    };
  } catch (error) {
    console.error('Error fetching universities:', error);
    return {
      success: false,
      result: [],
      total: 0,
      page: 1,
      totalPages: 0
    };
  }
}

function parseTitle(title: string): { text: string; highlighted: string } {
  if (!title) return { text: 'Find top', highlighted: 'universities' };

  // Check if title contains '||' separator
  if (title.includes('||')) {
    const parts = title.split('||');
    return {
      text: parts[0].trim(),
      highlighted: parts[1].trim()
    };
  }

  return { text: title, highlighted: '' };
}

async function HeroSection({ searchParams, pageData }: { searchParams: any; pageData: PageData['data'] }) {
  const heroData = pageData?.sections?.hero;

  // Parse title
  const { text, highlighted } = parseTitle(heroData?.title || '');

  const heroImage = heroData?.heroImage || 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Cmglee_Cambridge_Trinity_College_Great_Court.jpg/960px-Cmglee_Cambridge_Trinity_College_Great_Court.jpg';

  const subtitle = heroData?.subtitle || 'Discover 900+ top universities worldwide. World-class education, low tuition fees, and exciting career opportunities await you.';

  const TitleTag = heroData?.tag === '1' ? 'h1' : heroData?.tag === '2' ? 'h2' : 'p';
  const titleClasses = "text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.15] max-w-4xl [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]";

  return (
    <section className="relative h-[400px] px-4 sm:h-[450px] [text-shadow:0_0px_0px_rgba(0,0,0,0.9)] overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto  h-full flex flex-col justify-end pb-12">

        <TitleTag className={titleClasses}>
          {text}{' '}
          {highlighted && <span className="text-[#F46C44] [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">{highlighted}</span>}
        </TitleTag>

        {/* Subtitle */}
        <div
          className="text-white text-sm font-medium md:text-base mt-3 max-w-3xl [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />

        {/* Search Form (Adapted with glassmorphism to fit the dark overlay) */}
        <form action={`/study-abroad-universities`} method="GET" className="mt-8 max-w-2xl">
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-2xl flex overflow-hidden border border-white/20">
            <div className="flex items-center flex-1 px-6">
              <Search className="w-5 h-5 text-gray-500 mr-3" />
              <input
                type="text"
                name="keyword"
                placeholder="Search ..."
                className="w-full h-13 outline-none text-gray-800 placeholder:text-gray-500 bg-transparent"
                defaultValue={searchParams?.keyword || ''}
              />
            </div>
            <button
              type="submit"
              className="w-20 bg-[#F46C44] hover:bg-[#E85B30] transition flex items-center justify-center"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function StatsSection1({ statsData, slug }: any) {
  const items =
    statsData?.items?.length > 0
      ? statsData.items.map((item: any) => ({
        title: item.title,
        image: item.Images,
      }))
      : [];
  const { text, highlighted } = parseTitle(statsData?.title || '');

  return (
    <section className="bg-white px-4 [text-shadow:0_0px_0px_rgba(0,0,0,0.9)] py-8 relative z-10">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl lg:text-4xl font-semibold text-[#F46C44] text-start leading-tight mb-4">
          {text}{" "}
          {highlighted && (
            <span className="text-[#13294B]">{highlighted}</span>
          )}
        </h2>
      </div>


      <div className="bg-white max-w-7xl mx-auto  ">
        <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide pb-4 snap-x snap-mandatory">
          {items.map((item, index) => (
            <Link
              href={`/university/${slug}?city=${encodeURIComponent(item.title)}`}
              key={index}
              className="group relative min-w-[210px] bg-orange-600 w-[180px] h-[180px] overflow-hidden rounded-3xl
  transition-all duration-700 hover:-translate-y-1
  cursor-pointer"
            >
              <Image
                src={item.image || "https://res.klook.com/image/upload/fl_lossy.progressive,q_60/Mobile/City/jhnsgv9uilr7xh5fzyml.jpg"}
                alt={item.title || "University"}
                fill
                sizes="280px"
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0
    bg-gradient-to-t
    from-black
    via-black/20
    to-transparent"
              />


              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-extrabold leading-tight text-white drop-shadow-xl">
                  Universities
                </h3>

                <p className="mt-px text-xl font-bold text-white">
                  in {item.title}
                </p>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
// Main Page Component
interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    keyword?: string;
    country?: string;
    city?: string;
    type?: string;
    intake?: string;
    tuitionFee?: string;
    language?: string;
  };
}

export default async function FindUniversitiesPage({ params, searchParams }: PageProps) {

  const slug = "find-universities-main-page"

  const searchParam = await searchParams;

  // Fetch page data
  let pageData: PageData | null = null;
  let Faqres: any = [];
  let countrydata: any = [];
  try {
    const [res, api, data] = await Promise.all([
      serverInstance.get(`/page-information/slug/${slug}?type=university`),
      serverInstance.get(`/faqs/public/list?type=${slug}&limit=15`),
      serverInstance.get(`/countries/public?limit=300`)
    ])

    pageData = res.data;
    Faqres = api.data || [];
    countrydata = data.data || [];

  } catch (error) {
    console.error('Error fetching page data:', error);
    return <NotFound />
  }

  // Get default country from page data
  const defaultCountry = pageData?.data?.country?.code || '';

  // Fetch universities with default country
  const initialData = await getUniversities({
    page: searchParam?.page || '1',
    keyword: searchParam?.keyword,
    country: defaultCountry, // Use default if not provided
    city: searchParam?.city,
    type: searchParam?.type,
    intake: searchParam?.intake,
    limit: '12'
  });

  // Fetch universities
  // const initialData = await getUniversities({
  //   page: searchParam?.page || '1',
  //   keyword: searchParam?.keyword,
  //   country: searchParam?.country  || '',
  //   type: searchParam?.type,
  //   intake: searchParam?.intake,
  //   limit: '12'
  // });

  const pageTitle = pageData?.data?.title || 'Find Top Universities Worldwide';

  const sections = pageData?.data?.sections || {};

  const orderedSections = Object.entries(sections)
    .sort(([, a], [, b]) => (a.__order__ ?? 999) - (b.__order__ ?? 999));

  return (
    <div className="min-h-screen bg-[#F8F6F4]">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageTitle,
            "description": pageData?.data?.seoMeta?.metaDescription || "Discover top universities worldwide",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": initialData.result.map((uni, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "CollegeOrUniversity",
                  "name": uni.name,
                  "address": uni.address
                }
              }))
            }
          })
        }}
      />

      <HeroSection searchParams={searchParam} pageData={pageData?.data} />
      {/* Hero Section */}
      <StudyStats statsData={pageData?.data?.sections?.stats} />
      {/* <StatsSection statsData={pageData?.data?.sections?.stats} /> */}
      <UniversityOverview
        pageData={pageData?.data?.sections?.universityOverview}
      />
      <div className="px-4">
        {/* Main Content */}
        <section className="max-w-7xl mx-auto  py-12">
          <h2 className="text-primary flex flex-col gap-1 mb-6 text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="text-[#F46C44] font-semibold" dangerouslySetInnerHTML={{
              __html: pageData?.data?.title?.split("||")[0] || "Explore Universities"
            }} />
            <span dangerouslySetInnerHTML={{ __html: pageData?.data?.title?.split("||")[1] || "in World" }} />
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-78 shrink-0">
              <MainUniversityFilters searchParams={searchParam} city={pageData?.data?.sections?.city?.items || []}
                countrydata={countrydata?.data || []} slug={slug} defaultCountry={defaultCountry} />
            </div>

            {/* Results Area */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  <span className="text-[#F46C44]">{initialData.total}</span> Universities Found
                </h2>
              </div>

              {/* University List with Server Component */}
              <Suspense fallback={<UniversityListSkeleton />}>
                <UniversityList
                  key={JSON.stringify(searchParam)}
                  initialData={initialData}
                  searchParams={searchParam}
                />
              </Suspense>
            </div>
          </div>
        </section>
      </div>

      {/* StudyStats Component */}
      {/* <StudyStats statsData={pageData?.data?.sections?.stats} />
      {pageData?.data?.sections?.whyStudy && <WhyStudySection data={pageData?.data?.sections?.whyStudy} />}
      {pageData?.data?.sections?.contentSection && <ContentSection data={pageData?.data?.sections?.contentSection} />}
      {pageData?.data?.sections?.eligibilityCriteria && <EligibilityCriteriaSection data={pageData?.data?.sections?.eligibilityCriteria} />}
      <StatsSection1 statsData={pageData?.data?.sections?.city} slug={slug} />
      <UniversityOverview pageData={pageData?.data?.sections?.universityOverview} />
      {<CTASection data={pageData?.data?.sections?.cta} />} */}

      {orderedSections.map(([key, section]) => {
        switch (section.__originalName__ || key) {

          case "whyStudy":
            return <WhyStudySectionUniversity key={key} data={section} />;

          case "contentSection":
            return <UniversityContentSection key={key} data={section} />;

          case "eligibilityCriteria":
            return <EligibilityCriteriaSection key={key} data={section} />;

          // case "city":
          //   return (
          //     <StatsSection1
          //       key={key}
          //       statsData={section}
          //       slug={slug}
          //     />
          //   );

          case "universityOverview":
            if (section.__isDuplicate__) {
              return (
                <UniversityOverview
                  key={key}
                  pageData={section}
                />
              )
            } else return null;

          case "cta":
            return (
              <CTASection
                key={key}
                data={section}
              />
            );

          default:
            return null;
        }
      })}

      <div className='px-4'>
        <UniversityFAQSection Faqres={Faqres} />
      </div>
    </div>
  );
}