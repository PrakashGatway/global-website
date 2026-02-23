"use client";
import Image from "next/image";
import IvyLeagueNavigation from "@/components/IvyLeagueNavigation";
import ImageTestimonial from "@/components/ImageTestimonial";
import IvyLeagueUniversitySlider from "@/components/IvyLeagueUniversitySlider";
import { Footer } from "@/components/Footer";
import VideoBackground from "@/components/VideoBackground";
import StatisticsSlider from "@/components/StatisticsSlider";
import { useEffect, useState } from "react";
import OffersSlider, {
  AdmissionRequirementsUK,
  HowGawayHelps,
  IvyLeagueSection,
  ScholarshipRequirements,
  StickyIvelgueSection,
  StickyPaymentSection,
} from "@/components/PageComponent/DistinationSliders";
import CaseStudy from "@/components/PageComponent/CaseStudy";
import FAQSection from "../faqPage";
import UniversityCard from "../UniversityCard";
import { format } from "path";
import { formatDate } from "date-fns";

const images = [
  "https://t3.ftcdn.net/jpg/06/23/84/22/360_F_623842281_ECGgEpMEkQdH83gbmexIn5l3ACl7V3M0.jpg",
  "https://img.freepik.com/premium-photo/young-handsome-man-pointing-camera-choosing-you-university-student-concept_1194-262936.jpg",
  "https://as2.ftcdn.net/jpg/05/29/12/57/1000_F_529125762_omW1yTehDLLFJKwLJjRET0G3sXiQnK5g.jpg",
];

export default function UniversityPage({ data, caseStudy, imageRes, Faqres, Unires, Unicategory }) {
  const [index, setIndex] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Extract sections for cleaner access
  const sections = data?.sections || {};

  // Parse bottomText like "98% || of our students..."
  const parseBottomText = (text) => {
    if (!text) return { percent: "", description: "" };
    const parts = text.split("||").map((p) => p.trim());
    return { percent: parts[0] || "", description: parts[1] || "" };
  };

  const { percent, description } = parseBottomText(
    sections.imageTestimonials?.bottomText
  );





  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden px-5 ">
        <div className="absolute inset-0">
          <VideoBackground
            videos={[
              "/images/0_Queens_University_Belfast_Belfast_1920x1080.mp4",
              "/images/4730892_Cheyenne_Wyoming_1920x1080.mp4"
            ]}
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center items-start text-left max-w-7xl mx-auto">
          <div className="max-w-4xl" style={{ transform: 'none', perspective: 'none' }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-0 leading-tight" style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500, textAlign: 'left', transform: 'none', transformStyle: 'flat', transformOrigin: 'initial', letterSpacing: 'normal' }}>
              <span className="block">{sections.hero?.title}</span>
              <span className="block">{data?.title}</span>
            </h1>
            <p className="text-lg md:text-xl text-white mb-10 leading-relaxed" style={{ textAlign: 'left' }}>
              {data?.subTitle}
            </p>
          </div>
        </div>
      </section>

      {/* Our Global University Network */}
      <section className="py-12 bg-white">
        <div className="mx-auto px-5">
          <h2 style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500, textAlign: 'center', transform: 'none', transformStyle: 'flat', transformOrigin: 'initial', letterSpacing: 'normal' }} className="text-[2.6rem] font-bold text-center mb-6 text-gray-600">
            {sections.universities?.title}
          </h2>
          <IvyLeagueUniversitySlider />
        </div>
      </section>

      {/* Ivy Coach's College Admissions Track Record */}
      <section className="py-5 bg-gray-50" style={{ overflow: 'visible' }}>
        <div className="mb-8 mx-auto" style={{ borderTop: '3px solid rgb(94, 77, 77)', width: '70%' }}></div>

        <div className="text-center py-6 mb-12 bg-[#f5f1f0]">
          <h2 className="text-[2.6rem] font-bold mb-4 uppercase tracking-wide" style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", textAlign: 'center' }}>
            <span className="block text-[#f46c44]">{sections.content?.title?.split('||').slice(0)}</span>
            <span className="block text-gray-600">{sections.content?.title?.split('||').slice(1)}</span>
          </h2>
          <p className="text-lg text-gray-800 max-w-4xl mx-auto mb-2 font-semibold" style={{ textAlign: 'center' }}>
            The percentage of Ivy Coach's packaged clients over the last 10 years who earned admission to the following schools in the Early round.
          </p>
          <p className="text-lg text-gray-800 font-semibold mx-auto" style={{ textAlign: 'center' }}>
            At most of these schools, we typically have 3-4 applicants annually.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4" style={{ overflow: 'visible' }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start" style={{ overflow: 'visible' }}>
            {/* Left Panel - Proven Success */}
            <div className="col-span-2">
              <h3 className="text-3xl font-bold mb-3">
                <span className="block text-2xl font-bold italic" style={{
                  fontFamily: "'Mileast Italic', 'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                  background: 'linear-gradient(180deg, #ff8c5a 0%, #f46c44 50%, #e55a2b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 1px 2px rgba(244, 108, 68, 0.3))'
                }}>
                  {sections.imageTestimonials?.title || "Numbers Don't Lie."}
                </span>
                <span className="block text-gray-600">{sections.imageTestimonials?.subTitle?.split('\n')[0] || "Proven Success."}</span>
                <span className="block text-gray-600">{sections.imageTestimonials?.subTitle?.split('\n')[1] || "Unmatched Results."}</span>
              </h3>

              <div className="w-full hidden
      lg:block">
                <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] lg:w-[450px] lg:h-[450px]">
                  <div className="lg:relative lg:w-[92%] lg:h-[91%]">
                    <div
                      className="lg:absolute inset-0 z-10 lg:top-[41px] lg:left-[38px] "
                      style={{
                        backgroundImage: `url(${images[index]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskSize: "100% 100%",
                        maskRepeat: "no-repeat",
                        maskSize: "100% 100%",
                        width: "335px",
                        height: "335px",
                        borderRadius: "100px",
                      }}
                    />
                    <img
                      src="/images/student-rank-img.png"
                      alt="frame"
                      className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="text-left border-l-2 border-b-2 p-4 mt-0">
                <div className="text-5xl" style={{ color: '#f46c44' }}>{percent}</div>
                <p className="text-sm text-gray-700">{description}</p>
              </div>
            </div>

            {/* Right Panel - Stats */}
            <div className="col-span-3" style={{ overflow: 'visible' }}>
              <div className="mb-1 text-left p-4 w-100" style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#f46c44', borderRadius: '20px', overflow: 'visible' }}>
                <i className="text-7xl mb-0" style={{ color: '#f46c44', fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
                  {sections.imageTestimonials?.totalOffers || "1,485"}
                </i>
                <p style={{ color: '#2f2c29', fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500 }} className="text-gray-600 text-lg">
                  Total Offers in Last 10 Years
                </p>
              </div>

              <div className="">
                <h4 className="text-[1.8rem] font-bold text-gray-600" style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}>
                  <span className="border-b-2 border-gray-300 pb-2 inline-block">College Specific Acceptance Rates</span>
                </h4>
                <div className="flex items-center gap-6 pb-2">
                  <div><span className="text-sm font-semibold text-gray-600">General Admit Rate</span></div>
                  <div className="w-[px] h-full min-h-[4px] bg-gray-300 self-stretch"></div>
                  <div><span className="text-sm font-semibold" style={{ color: '#f46c44' }}>Ooshas Student Admit Rate</span></div>
                </div>
                <div className="space-y-0 pr-12">
                  {[
                    { name: 'Harvard', generalRate: 3.2, gawayRate: 20.0, logo: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'Harvard' },
                    { name: 'Stanford', generalRate: 4.3, gawayRate: 80.0, logo: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'Stanford' },
                    { name: 'Yale', generalRate: 4.6, gawayRate: 70.2, logo: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'Yale' },
                    { name: 'Columbia', generalRate: 3.9, gawayRate: 78.1, logo: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'Columbia' },
                    { name: 'UPenn', generalRate: 5.9, gawayRate: 83.3, logo: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'UPenn' },
                    { name: 'Dartmouth', generalRate: 6.2, gawayRate: 77.0, logo: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'Dartmouth' },
                    { name: 'Princeton', generalRate: 5.7, gawayRate: 60.6, logo: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'Princeton' },
                    { name: 'Cornell', generalRate: 7.3, gawayRate: 80.6, logo: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'Cornell' },
                    { name: 'MIT', generalRate: 6.5, gawayRate: 85.0, logo: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'MIT' }
                  ].map((uni, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-16 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Image
                          src={uni.logo}
                          alt={uni.alt}
                          width={60}
                          height={60}
                          className="object-contain w-full h-full"
                          unoptimized
                        />
                      </div>
                      <div className="w-19 flex-shrink-0">
                        <span className="text-base font-semibold text-gray-800">{uni.name}</span>
                      </div>
                      <div className="flex-1"></div>
                      <div className="h-10 mr-3 w-0.5 bg-gray-300"></div>
                      <div className="flex-10">
                        <div style={{ marginLeft: '2px', position: 'relative' }}>
                          <div className="rounded-full h-4 relative" style={{ overflow: 'visible' }}>
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(uni.gawayRate / 85.0) * 100}%`,
                                background: `linear-gradient(to right, #f46c44 50%,rgba(231, 218, 214, 0.78) 100%)`
                              }}
                            ></div>
                          </div>
                          <span
                            className="text-sm font-bold absolute top-1/2 -translate-y-1/2 whitespace-nowrap"
                            style={{
                              color: '#1f1d1dbd',
                              left: `calc(${(uni.gawayRate / 85.0) * 100}% + 8px)`
                            }}
                          >
                            {uni.gawayRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center item-center">
            <button className="mt-8 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:text-orange-500 transition border-2" style={{ borderColor: '#f46c44', outline: 'none', background: 'transparent' }}>
              VIEW STATISTICS
            </button>
          </div>
        </div>
      </section>

      <div className="w-full px-8 pb-10 mx-auto">


        <UniversityCard university={Unires} />

      </div>


      {/* The Ivy Coach Daily */}
      <section className="py-12 bg-[#f5f1f0] overflow-visible">
        <div className="max-w-7xl mx-auto px-4 overflow-visible">
          <div className="text-center mb-8">
            <h2 className="text-[2.6rem] font-bold uppercase" style={{ color: '#f46c44', fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500, textAlign: 'center', transform: 'none', transformStyle: 'flat', transformOrigin: 'initial', letterSpacing: 'normal' }}>
              {sections.blogs?.title}
            </h2>
            <p className="text-lg font-semibold text-gray-700">
              {sections.blogs?.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10" style={{ width: '100%' }}>
            {Unicategory.map((item, i) => (
              <div key={`ivy-coach-${i}`} className="overflow-hidden transition w-full">
                <Image
                  src={item.coverImage}
                  alt={item.uni}
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover"
                  unoptimized
                />
                <div className="py-4">
                  <h4 style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500, textAlign: 'center', transform: 'none', transformStyle: 'flat', transformOrigin: 'initial' }} className="text-lg font-bold text-gray-700 mb-2 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-center text-gray-600">by S.K. Date: {new Date(item?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="text-gray-700 px-10 py-3 rounded-lg font-semibold hover:text-orange-500 transition border-2" style={{ borderColor: '#f46c44', outline: 'none', background: 'transparent' }}>
              VIEW ALL
            </button>
          </div>
        </div>
      </section>

      {/* Reusable Sections — These likely already use `data` internally */}
      <OffersSlider />

      <section className="mx-auto bg-[#fff9f4] py-20 px-5">
        <div className="max-w-7xl mx-auto mb-8 mx-auto">
          <h2 className="text-[2.6rem] font-bold text-center" style={{ color: '#f46c44', fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}>
            <span className="text-[#f46c44]">{sections.whySpecial.title.split('||')[0]}</span> {""}
            <span className="text-gray-600">{sections.whySpecial.title.split('||')[1]}</span>
          </h2>
          <p className="text-lg font-semibold text-gray-700">{sections.roadMap.subtitle}</p>

          <StickyPaymentSection sections={data.sections.whySpecial.items} />



        </div>
      </section>

      <AdmissionRequirementsUK admissionData={data.sections.admissionRequirements} />
      <HowGawayHelps howWeHelpData={data.sections.howWeHelp} />

      {/* Admission Process Roadmap */}
      <section className="mx-auto bg-[#fff9f4] py-20 px-5">
        <div className="max-w-7xl mx-auto mb-8 mx-auto">
          <h2 className="text-[2.6rem] font-bold text-center" style={{ color: '#f46c44', fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}>
            <span className="text-[#f46c44]">{sections.roadMap.title.split('||')[0].trim()}</span> {""}
            <span className="text-gray-600">{sections.roadMap.title.split('||')[1].trim()}</span>
          </h2>
          <p className="text-lg font-semibold text-gray-700">{sections.roadMap.subtitle}</p>

          <div className="max-w-5xl mx-auto flex justify-center">
            <Image src="/images/00123.png" alt="ivy-admission-process" width={1000} height={800} className="w-full h-full" />
          </div>
        </div>
      </section>


      <ScholarshipRequirements scholarshipData={data.sections.scholarships} />


      <ImageTestimonial
        title={sections?.bottomTestimonial?.title}
        subtitle={sections?.bottomTestimonial?.subtitle}
        font={true}
        items={imageRes}
      />
      <CaseStudy font={true} caseStudydata={sections.caseStudies} caseStudy={caseStudy} />

      {/* Final CTA */}
      <section className="py-24" style={{ backgroundColor: '#f46c44' }}>
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 600 }} className="text-5xl md:text-6xl font-bold text-white mb-8 uppercase tracking-wide">
            TOWARD THE <span className="line-through">CONQUEST OF</span> ADMISSION
          </h2>
          <p style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500 }} className="text-xl text-white mb-10 max-w-3xl mx-auto leading-relaxed">
            If you're interested in Ivy Coach's college counseling, fill out our contact form or schedule a free consultation to learn more and get in touch.
          </p>
          <button className="bg-white text-orange-500 px-6 py-2 rounded-lg text-xl font-semibold hover:bg-gray-100 transition shadow-lg">
            GET STARTED
          </button>
        </div>
      </section>

      <FAQSection Faqres={Faqres} />
    </div>
  );
}