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
import UniversityFilters from '@/components/Universitypage/universityFilters';
import UniversityList, { StudyStats, UniversityOverview } from '@/components/Universitypage/universityList';
import { UniversityListSkeleton } from '@/components/Universitypage/universityCard';
import axiosInstance, { serverInstance, serverInst } from '@/app/axiosInstance';
import FAQSection from '@/components/faqPage';
import { ContentSection, EligibilityCriteriaSection, WhyStudySection } from '@/components/country';

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

// Generate Metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  try {
    const res = await serverInst.get(`/page-information/slug/${slug}`);
    const pageData = res.data.data;
    const seo = pageData?.seoMeta;

    return {
      title: seo?.metaTitle?.trim() || pageData?.title || slug,
      description: seo?.metaDescription || pageData?.description || '',
      keywords: seo?.metaKeywords || '',
      alternates: {
        canonical: `/${seo?.canonicalUrl || `universities/${slug}`}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: seo?.metaTitle || pageData?.title,
        description: seo?.metaDescription || pageData?.description,
        url: `/${seo?.canonicalUrl || `universities/${slug}`}`,
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

// Server-side data fetching
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

// Helper function to parse title with highlighted text
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

// Helper to get icon component
function getIconComponent(iconName: string, className: string = "w-8 h-8") {
  const icons: Record<string, any> = {
    GraduationCap,
    IndianRupee,
    BookOpen,
    ShieldCheck,
    Globe,
    Users,
    Award,
    Building2
  };

  const Icon = icons[iconName];
  return Icon ? <Icon className={className} /> : <GraduationCap className={className} />;
}

// Hero Section Component
async function HeroSection({ searchParams, pageData }: { searchParams: any; pageData: PageData['data'] }) {
  const heroData = pageData?.sections?.hero;

  // Parse title
  const { text, highlighted } = parseTitle(heroData?.title || '');

  // Get hero image
  const heroImage = heroData?.heroImage || 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Cmglee_Cambridge_Trinity_College_Great_Court.jpg/960px-Cmglee_Cambridge_Trinity_College_Great_Court.jpg';

  // Parse subtitle (remove HTML tags for plain text or use dangerouslySetInnerHTML)
  const subtitle = heroData?.subtitle || 'Discover 900+ top universities worldwide. World-class education, low tuition fees, and exciting career opportunities await you.';

  return (
    <section className="relative bg-[#F7F9FC] overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={text || "Universities around the world"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F3] via-[#F7F5F3]/70 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-4 pt-12 lg:pt-20 pb-32 relative">
        <div className="relative z-10 grid lg:grid-cols-2 items-center gap-10">
          {/* Left Content */}
          <div className="max-w-2xl">
            {heroData?.tag === '1' && (
              <h1 className="text-4xl lg:text-6xl font-bold text-[#13294B]">
                {text}{' '}
                {highlighted && <span className="text-[#F46C44]">{highlighted}</span>}
              </h1>
            )}
            {heroData?.tag === '2' && (
              <h2 className="text-4xl lg:text-6xl font-bold text-[#13294B]">
                {text}{' '}
                {highlighted && <span className="text-[#F46C44]">{highlighted}</span>}
              </h2>
            )}
            {(!heroData?.tag || heroData?.tag === 'p') && (
              <p className="text-4xl lg:text-6xl font-bold text-[#13294B]">
                {text}{' '}
                {highlighted && <span className="text-[#F46C44]">{highlighted}</span>}
              </p>
            )}

            <div
              className="mt-4 text-lg text-gray-700 font-medium leading-8"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />

            {/* Search Form */}
            <form action="/find-universities" method="GET" className="mt-6">
              <div className="bg-white rounded-2xl shadow-xl flex overflow-hidden border border-gray-200">
                <div className="flex items-center flex-1 px-6">
                  <Search className="w-6 h-6 text-gray-400 mr-4" />
                  <input
                    type="text"
                    name="keyword"
                    placeholder="Search universities, courses or cities..."
                    className="w-full h-15 outline-none text-gray-700 placeholder:text-gray-400"
                    defaultValue={searchParams?.keyword || ''}
                  />
                </div>
                <button
                  type="submit"
                  className="w-20 bg-[#F46C44] hover:bg-[#E85B30] transition flex items-center justify-center"
                >
                  <Search className="w-7 h-7 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Empty for design balance */}
          <div></div>
        </div>
      </div>
    </section>
  );
}

// Stats Section Component
function StatsSection({ statsData }: { statsData: PageData['data']['sections']['stats'] }) {
  // Default stats if not provided
  console.log(statsData, 'update')
  const defaultStats = [
    { title: 'Universities', stats: '900+', icon: 'GraduationCap', description: 'Universities worldwide' },
    // { title: 'Tuition Fees', stats: 'Low / No', icon: 'IndianRupee', description: 'Tuition Fees' },
    // { title: 'Programs', stats: 'English Taught', icon: 'BookOpen', description: 'Programs' },
    // { title: 'Visa Success', stats: 'High Visa', icon: 'ShieldCheck', description: 'Success Rate' }
  ];

  const items = statsData?.items && statsData.items.length > 0
    ? statsData.items.map(item => ({
      title: item.title,
      stats: item.stats,
      icon: item.icon,
      description: item.description || item.title
    }))
    : defaultStats;

  // Ensure we have 4 items, pad with defaults if needed
  while (items.length < 4) {
    const defaultItem = defaultStats[items.length % defaultStats.length];
    items.push({ ...defaultItem });
  }

  return (
    <div className="w-full mx-auto relative -mt-16 max-w-7xl px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = getIconComponent(item.icon);
            // Determine color based on icon
            const isOrangeIcon = item.icon === 'IndianRupee';

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-8 ${index > 0 ? 'border-l border-gray-200' : ''}`}
              >
                <div className={`w-14 h-14 rounded-full ${isOrangeIcon ? 'bg-orange-50' : 'bg-orange-50'} flex items-center justify-center`}>
                  {Icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#13294B]">{item.stats}</h3>
                  <p className="text-gray-600">{item.title || item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
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
    <section className="bg-white px-4 relative z-10">
      <h1 className="text-3xl lg:text-5xl font-bold text-[#13294B] text-center leading-tight mb-10">
        {text}{" "}
        {highlighted && (
          <span className="text-[#F46C44]">{highlighted}</span>
        )}
      </h1>

      <div className="bg-white max-w-7xl mx-auto  ">
        <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide pb-4 snap-x snap-mandatory">
          {items.map((item, index) => (
            <Link
              href={`/university/${slug}?city=${encodeURIComponent(item.title)}`}
              key={index}
              className="group relative border border-gray-200 min-w-[280px] bg-orange-600 w-[280px] h-[320px] overflow-hidden rounded-3xl
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
                <h3 className="text-[28px] font-extrabold leading-tight text-white drop-shadow-xl">
                  Universities
                </h3>

                <p className="mt-1 text-xl font-medium text-white">
                  in {item.title}
                </p>

                <p className="mt-2 text-sm leading-6 text-white/75 line-clamp-2">
                  Discover globally ranked universities, scholarships and exciting career opportunities.
                </p>

                <button
                  className="mt-3 flex w-fit items-center gap-2 rounded-full
      bg-[#F36D45]
      px-4 py-2
      text-sm font-semibold text-white
      transition-all duration-500
      group-hover:gap-4
      group-hover:scale-105
      hover:bg-[#ff7d58]"
                >
                  Explore
                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </button>
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
  const { slug } = await params;
  const searchParam = await searchParams;

  // Fetch page data
  let pageData: PageData | null = null;
  let Faqres: any = [];
  let countrydata: any = [];
  try {
    const [res, api, data] = await Promise.all([
      serverInstance.get(`/page-information/slug/${slug}`),
      serverInstance.get(`/faqs/public/list?type=${slug}&limit=15`),
      serverInstance.get(`/countries/public?limit=300`)
    ])

    pageData = res.data;
    Faqres = api.data || [];
    countrydata = data.data || [];

  } catch (error) {
    console.error('Error fetching page data:', error);
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

  return (
    <div className="min-h-screen bg-[#F8F6F4] ">
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

      {/* Hero Section */}
      <HeroSection searchParams={searchParam} pageData={pageData?.data} />

      {/* Stats Section */}
      <StatsSection statsData={pageData?.data?.sections?.stats} />

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-2 py-12">
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Filters Sidebar */}
          <div className="w-full lg:w-78 shrink-0">
            <UniversityFilters searchParams={searchParam} city={pageData?.data?.sections?.city?.items || []}
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

      {/* StudyStats Component */}
      <StudyStats statsData={pageData?.data?.sections?.stats} />
      {pageData?.data?.sections?.whyStudy && <WhyStudySection data={pageData?.data?.sections?.whyStudy} />}
      {pageData?.data?.sections?.contentSection && <ContentSection data={pageData?.data?.sections?.contentSection} />}
      {pageData?.data?.sections?.eligibilityCriteria && <EligibilityCriteriaSection data={pageData?.data?.sections?.eligibilityCriteria} />}
      <StatsSection1 statsData={pageData?.data?.sections?.city} slug={slug} />
      <UniversityOverview pageData={pageData?.data?.sections?.universityOverview} />
      <section className="relative bg-[#ee6a43] overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-0">

          {/* Text */}
          <div className="text-white relative z-10">
            <span className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight"> Turn Your Dream of Studying Abroad into Reality </span>

            <br /> <span
              className="mt-4 text-sm sm:text-base lg:text-lg max-w-xl text-white/90"

            >From choosing the right country and university to securing scholarships, preparing your application, and obtaining your student visa, Ooshas Global provides personalized, end-to-end guidance at every stage of your study abroad journey.</span>
            <div className="mt-4">
              <a href="/contact">
                <button className="bg-secondary hover:bg-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium shadow-md hover:scale-105 transition text-xs sm:text-base">
                  Contact US
                </button>
              </a>
            </div>
          </div>

          {/* Decorative circle — only on lg */}
          <div className="hidden lg:flex relative h-[325px] items-center justify-center">
            <img
              src="/images/circle stand.png"
              alt=""
              className="absolute z-10 w-[90px] bottom-0"
              style={{ right: "calc(50% - 45px)" }}
            />
            <img
              src="/images/circle.png"
              alt=""
              className="w-80 xl:w-96 animate-spin [animation-duration:60s]"
            />
          </div>
        </div>

        <img
          src="/images/country-building-img.png"
          alt=""
          className="absolute bottom-0 right-0 w-2/3 sm:w-1/2 object-contain pointer-events-none"
        />
        <div className="absolute bottom-0 left-0 w-full sm:w-1/2 h-2 sm:h-3 bg-yellow-400" />
      </section>
      <div className='px-4'>
        <FAQSection Faqres={Faqres} />
      </div>
    </div>
  );
}