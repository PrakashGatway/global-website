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
  ShieldCheck 
} from 'lucide-react';
import UniversityFilters from '@/components/Universitypage/universityFilters';
import UniversityList, { StudyStats, UniversityOverview } from '@/components/Universitypage/universityList';
import { UniversityListSkeleton } from '@/components/Universitypage/universityCard';
import { serverInstance } from '@/app/axiosInstance';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Find Top Universities Worldwide | Study Abroad Guide 2026',
  description: 'Discover 900+ top universities across Germany, UK, USA, Canada, and more. Find English-taught programs, low tuition fees, and high visa success rates.',
  keywords: 'universities, study abroad, top universities, higher education, international students, college search',
  openGraph: {
    title: 'Find Top Universities Worldwide | Study Abroad Guide',
    description: 'Discover 900+ top universities worldwide with English-taught programs, affordable tuition, and high visa success rates.',
    type: 'website',
    images: ['https://ooshasglobal.com/images/newlogo3.png'],
  }
};

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
    console.log(searchParams)
    
    if (searchParams.page) params.append('page', searchParams.page);
    // if (searchParams.limit) params.append('limit', "12" );
    if (searchParams.keyword) params.append('name', searchParams.keyword);
    if (searchParams.country) params.append('country', searchParams.country);
    if (searchParams.city) params.append('city', searchParams.city);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.intake) params.append('intake', searchParams.intake);
    params.append("limit", "12");
    
    // params.append('isWeb', 'false');
    params.append('populateExtra', 'false');
    
    const res = await serverInstance.get(`/universities?${params.toString()}`);
    
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
async function getCountries() {
  try {
    const res = await serverInstance.get('/countries');
    console.log(res.data)
    if (res.data.success) {
      return res.data.result;
    }
    return [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

async function HeroSection({searchParams}:any) {
  return (
    <section className="relative bg-[#F7F9FC] overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Cmglee_Cambridge_Trinity_College_Great_Court.jpg/960px-Cmglee_Cambridge_Trinity_College_Great_Court.jpg"
          alt="Universities around the world"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F3] via-[#F7F5F3]/70 to-transparent"></div>
      </div>
      
      <div className="max-w-[1380px] mx-auto px-4 sm:px-4 pt-12 lg:pt-20 pb-32 relative">
        <div className="relative z-10 grid lg:grid-cols-2 items-center gap-10">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#13294B]">
              Find top{' '}
              <span className="text-[#F46C44]">universities</span>
            </h1>
            <p className="mt-4 text-lg text-gray-700 font-medium leading-8">
              Discover 900+ top universities worldwide. World-class education, 
              low tuition fees, and exciting career opportunities await you.
            </p>
            
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

// Stats Section (Server Component)
function StatsSection() {
  return (
    <div className="w-full mx-auto relative -mt-16 max-w-[1380px] px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 p-8">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-[#13294B]" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#13294B]">900+</h3>
              <p className="text-gray-600">Universities</p>
            </div>
          </div>
          <div className="border-l border-gray-200 flex items-center gap-4 p-8">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
              <IndianRupee className="w-8 h-8 text-[#F46C44]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#13294B]">Low / No</h3>
              <p className="text-gray-600">Tuition Fees</p>
            </div>
          </div>
          <div className="border-l border-gray-200 flex items-center gap-4 p-8">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[#13294B]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#13294B]">English Taught</h3>
              <p className="text-gray-600">Programs</p>
            </div>
          </div>
          <div className="border-l border-gray-200 flex items-center gap-4 p-8">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#13294B]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#13294B]">High Visa</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
interface PageProps {
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

export default async function FindUniversitiesPage({ searchParams }: any) {
  let searchParam = await searchParams

  const initialData = await getUniversities({
    page: searchParam?.page || '1',
    keyword: searchParam?.keyword,
    country: searchParam?.country,
    // city: searchParam.city,
    type: searchParam?.type,
    intake: searchParam?.intake,
    limit: '12'
  });

  return (
    <div className="min-h-screen bg-[#F8F6F4]">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Find Top Universities Worldwide",
            "description": "Discover 900+ top universities across Germany, UK, USA, Canada, and more.",
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
      <HeroSection searchParams={searchParam}/>

      {/* Stats Section */}
      <StatsSection />

      {/* Main Content */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-2 py-12">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-78 shrink-0">
            <UniversityFilters searchParams={searchParam} />
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

      <StudyStats/>
      <UniversityOverview/>
    </div>
  );
}