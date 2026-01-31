import { Star, MapPin, Users, TrendingUp, Calendar, DollarSign, FileText, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { serverInstance } from '@/app/axiosInstance';

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{universityData.name}</h1>
              <p className="text-slate-600 flex items-center mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                {location}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="text-yellow-500 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-semibold text-slate-900">4.5 /5</span>
              </div>
              <p className="text-sm text-slate-600">(Reviews coming soon)</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings Section */}
      <div className="bg-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-slate-600 mb-2">University Ranking</p>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-blue-600">
                  #{universityData.uni_rank?.rank || 'N/A'}
                </div>
                <span className="text-slate-700">in {universityData.uni_rank?.type || 'Global'}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Status</p>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-blue-600">
                  {universityData.status || 'Active'}
                </div>
                <span className="text-slate-700">University Status</span>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Button variant="outline">View ranking details</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-3">
          <Button variant="default">Compare</Button>
          <Button variant="outline">Brochure</Button>
          <Button variant="outline">Rate my chance</Button>
          {universityData.uni_web && (
            <Button variant="outline" asChild>
              <a href={universityData.uni_web} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-0 bg-transparent h-auto p-0 gap-8">
              {/* Generate tabs dynamically from sections */}
              {activeSections.map((section) => (
                <TabsTrigger 
                  key={section._id} 
                  value={section.section_key}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0 py-4 text-slate-700 data-[state=active]:text-slate-900"
                >
                  {section.heading}
                </TabsTrigger>
              ))}
              
              {/* Additional tabs */}
              <TabsTrigger value="courses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0 py-4 text-slate-700 data-[state=active]:text-slate-900">
                Courses
              </TabsTrigger>
              <TabsTrigger value="fees" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0 py-4 text-slate-700 data-[state=active]:text-slate-900">
                Fees
              </TabsTrigger>
              <TabsTrigger value="rankings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0 py-4 text-slate-700 data-[state=active]:text-slate-900">
                Rankings
              </TabsTrigger>
              <TabsTrigger value="admissions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0 py-4 text-slate-700 data-[state=active]:text-slate-900">
                Admissions
              </TabsTrigger>
              <TabsTrigger value="scholarships" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0 py-4 text-slate-700 data-[state=active]:text-slate-900">
                Scholarships
              </TabsTrigger>
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
                        <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    </TabsContent>
                  ))}

                  {/* Courses Tab */}
                  <TabsContent value="courses" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">Courses at {universityData.name}</h2>
                      <p className="text-slate-700 leading-relaxed mb-6">
                        {universityData.name} offers diverse programs across various disciplines. Below are the main course categories.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {courses.map((course, idx) => (
                        <Card key={idx} className="border-slate-200">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">{course.name}</h4>
                                <p className="text-sm text-slate-600">{course.duration}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900">#{course.ranking}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Tuition Fees</span>
                                <span className="font-semibold text-slate-900">{course.fee}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Ranking</span>
                                <span className="font-semibold text-slate-900">#{course.ranking}</span>
                              </div>
                            </div>
                            <Button className="w-full mt-4 bg-transparent" variant="outline">Rate my chance</Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Fees Tab */}
                  <TabsContent value="fees" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">{universityData.name} Fees Structure</h2>
                      <p className="text-slate-700 leading-relaxed mb-6">
                        Detailed fee structure for various programs at {universityData.name}.
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Financial Breakdown</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded p-4">
                          <p className="text-sm text-slate-600 mb-2">Undergraduate Fees</p>
                          <p className="text-2xl font-bold text-blue-600">{universityData.financials?.ug_fees || 'N/A'}</p>
                        </div>
                        <div className="bg-white rounded p-4">
                          <p className="text-sm text-slate-600 mb-2">Postgraduate Fees</p>
                          <p className="text-2xl font-bold text-blue-600">{universityData.financials?.pg_fees || 'N/A'}</p>
                        </div>
                        <div className="bg-white rounded p-4">
                          <p className="text-sm text-slate-600 mb-2">Cost of Living</p>
                          <p className="text-2xl font-bold text-blue-600">{universityData.financials?.cost_of_living || 'N/A'}</p>
                        </div>
                        <div className="bg-white rounded p-4">
                          <p className="text-sm text-slate-600 mb-2">Other Fees</p>
                          <p className="text-2xl font-bold text-blue-600">{universityData.financials?.other_fees || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Financial Information</h3>
                      <p className="text-slate-700 leading-relaxed">
                        {universityData.short_description || 'Contact the university for detailed financial aid information.'}
                      </p>
                    </div>
                  </TabsContent>

                  {/* Rankings Tab */}
                  <TabsContent value="rankings" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">{universityData.name} Rankings</h2>
                      <p className="text-slate-700 leading-relaxed mb-6">
                        {universityData.name} is recognized globally for its academic excellence and research contributions.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-slate-200">
                        <CardContent className="pt-6">
                          <h4 className="font-bold text-slate-900 mb-4">University Rankings</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-700">{universityData.uni_rank?.type || 'Global'} Ranking</span>
                              <span className="font-bold text-blue-600">#{universityData.uni_rank?.rank || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-700">Status</span>
                              <span className="font-bold text-blue-600">{universityData.status}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200">
                        <CardContent className="pt-6">
                          <h4 className="font-bold text-slate-900 mb-4">Accreditation</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-700">University Type</span>
                              <span className="font-bold text-blue-600">{universityData.uni_type}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-700">Established</span>
                              <span className="font-bold text-blue-600">{universityData.established_year}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Admissions Tab */}
                  <TabsContent value="admissions" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">Admissions Information</h2>
                      <p className="text-slate-700 leading-relaxed mb-6">
                        {universityData.short_description || 'Please visit the official website or contact the admissions office for detailed admission requirements.'}
                      </p>
                    </div>

                    {/* University Information Table */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">University Details</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <tbody>
                            {universityInfo.map((info, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                <td className="px-4 py-3 font-medium text-slate-900 border border-slate-200 w-1/2">
                                  {info.label}
                                </td>
                                <td className="px-4 py-3 text-slate-700 border border-slate-200">
                                  {info.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Scholarships Tab */}
                  <TabsContent value="scholarships" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">Scholarships & Financial Aid</h2>
                      <p className="text-slate-700 leading-relaxed mb-6">
                        {universityData.name} offers various scholarships and financial aid options. Contact the financial aid office for detailed information.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Card className="border-slate-200">
                        <CardContent className="pt-6">
                          <h4 className="font-bold text-slate-900 mb-3">Financial Assistance</h4>
                          <p className="text-slate-700 text-sm">
                            For information about scholarships, grants, and financial aid, please contact the university's financial aid office.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200">
                        <CardContent className="pt-6">
                          <h4 className="font-bold text-slate-900 mb-3">Contact Information</h4>
                          <p className="text-slate-700 text-sm">
                            Phone: {universityData.uni_contact || 'N/A'}<br />
                            Website: {universityData.uni_web || 'N/A'}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Quick Stats */}
                  <Card className="mb-6 border-slate-200 sticky top-32">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-slate-900 mb-4">Quick Stats</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">University Type</p>
                          <p className="text-xl font-bold text-blue-600">{universityData.uni_type}</p>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm text-slate-600 mb-1">Established</p>
                          <p className="text-xl font-bold text-blue-600">{universityData.established_year}</p>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm text-slate-600 mb-1">Ranking</p>
                          <p className="text-xl font-bold text-blue-600">#{universityData.uni_rank?.rank || 'N/A'}</p>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm text-slate-600 mb-1">Status</p>
                          <p className="text-xl font-bold text-blue-600">{universityData.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA Section */}
                  <Card className="border-slate-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-slate-900 mb-4">Ready to Apply?</h3>
                      <div className="space-y-3">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Brochure</Button>
                        <Button className="w-full bg-transparent" variant="outline">Talk to Expert</Button>
                        {universityData.uni_web && (
                          <Button className="w-full bg-transparent" variant="outline" asChild>
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