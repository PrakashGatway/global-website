import { Star, MapPin, Users, TrendingUp, Calendar, DollarSign, FileText, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { serverInstance } from '@/app/axiosInstance';
import HeroSlider from '@/components/heroSlider';
import SocialLinksCard from '@/components/socialLinkCard';
import DOMPurify from "isomorphic-dompurify";



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
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  uni_logo: string;
  uni_web: string;
  uni_rank: {
    type: string;
    rank: string;
  };
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
  extra_content: {
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
  seo_metadata: {
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

// Default values for missing data
const defaultHighlights = [
  { label: 'Acceptance Rate', value: 'N/A' },
  { label: 'Student Count', value: 'N/A' },
  { label: 'International Students', value: 'N/A' },
];

const defaultCourses = [
  {
    name: 'Undergraduate Programs',
    duration: '3-4 years',
    fee: 'See Financials',
    ranking: 'N/A',
  },
  {
    name: 'Postgraduate Programs',
    duration: '1-2 years',
    fee: 'See Financials',
    ranking: 'N/A',
  },
];

export default async function UniDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let universityData: UniversityData | null = null;
  let error: string | null = null;



  try {
    const res = await serverInstance.get<ApiResponse>(`/universities/${slug}`);
    if (res.data.success) {
      universityData = res.data.result;
    }
  } catch (err) {
    error = 'Failed to load university data';
    console.error('Error fetching university data:', err);
  }

  if (error || !universityData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading University Data</h1>
          <p className="text-slate-700">{error || 'University not found'}</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </main>
    );
  }

  const latitude = universityData.google_location?.lat;
  const longitude = universityData.google_location?.lng;


  // Prepare data from API response
  const location = `${universityData.city}, ${universityData.country}`.replace(/, $/, '');
  const highlights = [
    { label: universityData.uni_type ? `${universityData.uni_type.charAt(0).toUpperCase() + universityData.uni_type.slice(1)} University` : 'University', value: '' },
    { label: universityData.on_compus_accommodation ? 'On-campus accommodation' : 'No on-campus accommodation', value: '' },
    { label: `Estd. ${universityData.established_year}`, value: '' },
  ];

  const universityInfo = [
    { label: 'University Type', value: universityData.uni_type || 'N/A' },
    { label: 'Location', value: location },
    { label: 'Address', value: universityData.address || 'N/A' },
    { label: 'Contact', value: universityData.uni_contact || 'N/A' },
    { label: 'Website', value: universityData.uni_web || 'N/A' },
    { label: 'Established Year', value: universityData.established_year.toString() },
    { label: 'On-campus Accommodation', value: universityData.on_compus_accommodation ? 'Yes' : 'No' },
    { label: 'Off-campus Accommodation', value: universityData.off_campus_accommodation ? 'Yes' : 'No' },
    { label: 'Cost of Living', value: universityData.financials?.cost_of_living || 'N/A' },
    { label: 'UG Fees', value: universityData.financials?.ug_fees || 'N/A' },
    { label: 'PG Fees', value: universityData.financials?.pg_fees || 'N/A' },
  ];

  const courses = [
    {
      name: 'Undergraduate Programs',
      duration: '3-4 years',
      fee: universityData.financials?.ug_fees || 'N/A',
      ranking: universityData.uni_rank?.rank || 'N/A',
    },
    {
      name: 'Postgraduate Programs',
      duration: '1-2 years',
      fee: universityData.financials?.pg_fees || 'N/A',
      ranking: universityData.uni_rank?.rank || 'N/A',
    },
  ];

  // Get active sections from API
  const activeSections = universityData.extra_content?.sections || [];

  // Determine default tab based on available sections
  const defaultTab = activeSections.length > 0 ? activeSections[0].section_key : 'college-info';

  // Get gallery data from API
  const galleryImages = universityData.uni_gallery?.images || [];
  const galleryVideos = universityData.uni_gallery?.videos || [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section with Slider */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HeroSlider
            images={galleryImages}
            videos={galleryVideos}
            universityName={universityData.name}
          />
        </div>
      </div>

      {/* Header Info */}
      <div className="sticky top-20 z-40 border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{universityData.name}</h1>
              <p className="text-slate-600 flex items-center mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                {location}
              </p>
            </div>

          </div>


        </div>
      </div>

      {/* Rankings Section */}
      <div className="bg-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Rankings */}
            <div className="md:col-span-2">
              <p className="text-sm text-slate-600 mb-3">University Rankings</p>

              <div className="grid sm:grid-cols-2 gap-6">
                {Array.isArray(universityData.uni_rank) && universityData.uni_rank.length > 0 ? (
                  universityData.uni_rank.map((rank, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="text-4xl font-bold text-orange-500">
                        #{rank.rank}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {rank.type}
                        </p>
                        <p className="text-sm text-slate-600">
                          Year {rank.year}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600">Ranking data not available</p>
                )}
              </div>
            </div>

            {/* Intakes (replacing Status) */}
            <div>
              <p className="text-sm text-slate-600 mb-3">Available Intakes</p>

              <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
                {Array.isArray(universityData.intakes) && universityData.intakes.length > 0 ? (
                  universityData.intakes.map((intake, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <span className="text-slate-800 font-medium">
                        {intake}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600">No intake information available</p>
                )}
              </div>

              <Button variant="outline" className="mt-4 w-full hover:bg-orange-500 cursor-pointer ">
                View admission timeline
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* LEFT SOCIAL LINKS */}
      <SocialLinksCard
        facebook={universityData.social_links?.facebook}
        twitter={universityData.social_links?.twitter}
        instagram={universityData.social_links?.instagram}
        linkedin={universityData.social_links?.linkedin}
      />



      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-30 mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-0 bg-transparent h-auto p-0 gap-8">
              {/* Generate tabs dynamically from sections */}
              {activeSections.map((section) => (
                <TabsTrigger
                  key={section._id}
                  value={section.section_key}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-600 px-0 py-4 text-slate-700 data-[state=active]:text-slate-900"
                >
                  {section.heading}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-0 py-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {/* Dynamic Sections from API */}
                  {activeSections.map((section) => (
                    <TabsContent key={section._id} value={section.section_key} className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.heading}</h2>

                        <div
                          className="text-slate-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(section.content),
                          }}
                        />

                      </div>
                    </TabsContent>
                  ))}


                  {/* Location Section */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                    <div className="grid lg:grid-cols-3 gap-8">

                      {/* LEFT: Google Map */}
                      <div className="lg:col-span-2">
                        <Card className="border-gray-300">
                          <CardContent className="p-0">
                            <div className="h-[350px] w-full rounded-lg overflow-hidden">
                              {latitude && longitude ? (
                                <iframe
                                  title="University Location"
                                  width="100%"
                                  height="100%"
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                  src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                                  className="border-0"
                                />
                              ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                  Location not available
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* RIGHT: Address Details */}
                      <div className="lg:col-span-1">
                        <Card className="border-gray-300">
                          <CardContent className="pt-6">
                            <h3 className="font-bold text-gray-800 mb-4">
                              Campus Location
                            </h3>

                            <div className="space-y-4 text-sm text-gray-600">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-orange-600 mt-1" />
                                <span>{universityData.address || 'N/A'}</span>
                              </div>

                              <div className="border-t border-gray-300 pt-4">
                                <p>
                                  <span className="font-medium text-gray-800">City:</span>{' '}
                                  {universityData.city}
                                </p>
                                <p>
                                  <span className="font-medium text-gray-800">Country:</span>{' '}
                                  {universityData.country}
                                </p>
                              </div>

                              <Button
                                asChild
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                <a
                                  href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Open in Google Maps
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>



                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Quick Stats */}
                  <Card className="mb-6 border-gray-300">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-gray-800 mb-4">
                        Financial Overview
                      </h3>

                      <div className="space-y-4">
                        {/* Cost of Living */}
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Cost of Living (Annual)
                          </p>
                          <p className="text-xl font-bold text-orange-600">
                            {universityData.financials?.cost_of_living || 'N/A'}
                          </p>
                        </div>

                        {/* UG Fees */}
                        <div className="border-t border-gray-300 pt-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Undergraduate Fees
                          </p>
                          <p className="text-xl font-bold text-orange-600">
                            {universityData.financials?.ug_fees || 'N/A'}
                          </p>
                        </div>

                        {/* PG Fees */}
                        <div className="border-t border-gray-300 pt-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Postgraduate Fees
                          </p>
                          <p className="text-xl font-bold text-orange-600">
                            {universityData.financials?.pg_fees || 'N/A'}
                          </p>
                        </div>

                        {/* Other Fees */}
                        <div className="border-t border-gray-300 pt-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Other Fees
                          </p>
                          <p className="text-xl font-bold text-orange-600">
                            {universityData.financials?.other_fees || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>


                  {/* CTA Section */}
                  <Card className="border-slate-200 bg-gray-50">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-slate-900 mb-4">Ready to Apply?</h3>
                      <div className="space-y-3">
                        <Button className="w-full bg-gray-600 hover:bg-orange-500 cursor-pointer">Get Brochure</Button>
                        <Button className="w-full bg-transparent hover:bg-orange-500" variant="outline">Talk to Expert</Button>
                        {universityData.uni_web && (
                          <Button className="w-full bg-transparent hover:bg-orange-500" variant="outline" asChild>
                            <a href={universityData.uni_web} target="_blank" rel="noopener noreferrer">
                              Visit Official Website
                            </a>
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-4 text-center">
                        Contact us for admission assistance
                      </p>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Card className="mt-6 border-slate-200">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900 mb-1">Address</p>
                          <p className="text-sm text-slate-600">{universityData.address}</p>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm font-medium text-slate-900 mb-1">Contact</p>
                          <p className="text-sm text-slate-600">{universityData.uni_contact}</p>
                        </div>
                        {universityData.uni_web && (
                          <div className="border-t border-slate-200 pt-4">
                            <p className="text-sm font-medium text-slate-900 mb-1">Website</p>
                            <a
                              href={universityData.uni_web}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {universityData.uni_web}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-slate-400">
            Last updated on {new Date(universityData.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>


    </main>
  );
}