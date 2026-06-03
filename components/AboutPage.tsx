"use client"
import Image from 'next/image';
import { motion } from "framer-motion";
import { GraduationCap } from 'lucide-react';
import UniversitySliderClient from '@/components/PageComponent/Unversity';
import UniversitiesSlider from '@/components/PageComponent/UniversitiesSlider';
import { useState } from 'react';
import MultiStepForm from '@/components/PopupForm';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/app/axiosInstance';
import { DynamicLucideIcon } from './DynamicLucideIcon';
import toast from 'react-hot-toast';

export default function AboutUsPage({ aboutData }) {
  const [openForm, setOpenForm] = useState(false);

  // Extract data from the response
  const heroTitle = aboutData?.sections?.hero?.title || "Welcome to Ooshas";
  const storyTitle = aboutData?.sections?.story?.title || "The Story Behind || Ooshas Global";
  const storySubtitle = aboutData?.sections?.story?.subtitle || "";
  const impactTitle = aboutData?.sections?.impact?.title || "Our Impact";
  const impactSubtitle = aboutData?.sections?.impact?.subtitle || "";
  const servicesTitle = aboutData?.sections?.service?.title || "Our Services";
  const servicesPoints = aboutData?.sections?.service?.points || [];
  const whatWeDoPoints = aboutData?.sections?.whatWeDo?.points || [];
  const aboutCompanyTitle = aboutData?.sections?.aboutCompany?.title || "About Ooshas";
  const aboutCompanySubtitle = aboutData?.sections?.aboutCompany?.subtitle || "";
  const contentPoints = aboutData?.sections?.content?.points || [];

  // Extract mission, vision, and values from content points
  const missionData = contentPoints.find(item => item.title === "Our Mission") || {};
  const visionData = contentPoints.find(item => item.title === "Our Vision") || {};
  const valuesData = contentPoints.find(item => item.title === "Our Core Values") || {};

  // Service icons mapping
  const iconComponents = {
    phone: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    "user-round-pen": (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    "book-check": (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    "id-card": (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
    newspaper: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    school: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  };

  // What We Do icons mapping
  const whatWeDoIcons = {
    "user-round-pen": <GraduationCap className='h-12 w-12 mb-2' />,
    "school": <GraduationCap className='h-12 w-12 mb-2' />,
    "id-card-lanyard": <GraduationCap className='h-12 w-12 mb-2' />,
    "settings": <GraduationCap className='h-12 w-12 mb-2' />
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/contactus", {
        subject: "contact form",
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        description: data.message,
        destination: data.destination


      })
      toast.success("Message sent successfully!")
      reset()
    }
    catch (err) {
      toast.error("Failed to submit the form. Please try again later.")
    }
  }

  return (
    <div className='bg-[#fbfbfb] relative'>
      {/* Hero Section */}
      <section className="relative flex items-center h-[600px] " style={{
        backgroundColor: '#f46c44', borderTop: 'none', boxShadow: 'none', isolation: 'isolate', zIndex: 1, backgroundImage: `url(${"/about-bg.jpeg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>

        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2  items-center ">
          <div className="text-white space-y-6 p-6 sm:pt-0 pt-12">
            <h1 className="text-xl lg:text-6xl font-bold text-[#f46c44] tracking-tight">
              {aboutData?.title || "About"}
            </h1>
            <p className="text-sm lg:text-lg max-w-2xl font-medium text-gray-800">
              Ooshas Global: Your Launchpad to Global Education. We empower students
              to achieve their dreams of studying abroad with expert coaching for:
              IELTS, TOEFL, PTE, GRE, GMAT, SAT.
            </p>
            <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">

              {/* Button 1 */}
              <button
                onClick={() => setOpenForm(true)}
                className="
      w-full sm:w-auto
      text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-[#f46c44]
      rounded-4xl shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)]
      text-sm lg:text-base font-semibold
      hover:bg-primary hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)]
      flex items-center justify-center gap-2
      transition-all hover:opacity-90 cursor-pointer
    "
              >
                Get Free Counselling
              </button>

              {/* Button 2 */}
              <Link href={"/login"} className="w-full sm:w-auto">
                <button
                  className="
        w-full sm:w-auto
        text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-black
        rounded-4xl shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)]
        text-sm lg:text-base font-semibold
        transition-all hover:bg-primary hover:text-white hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)]
        cursor-pointer
      "
                >
                  Check Your Eligibility
                </button>
              </Link>

            </div>
          </div>
          <div className="h-full w-full">
            <div className='relative flex items-center justify-center h-[100%] w-full  overflow-hidden mr-10'>
              <img className='h-full w-full object-cover' src="/about-hero.png" alt="" />

            </div>
          </div>
        </div>
      </section>

      {/* Succeed with the world's most trusted */}
      <section className=" lg:py-5 mt-10 lg:mt-28 " style={{ isolation: 'isolate', zIndex: 0, position: 'relative' }}>
        <div className="max-w-7xl mx-auto px-2">
          <div className="text-center mb-8">
            <h2 className="text-xl lg:text-[2.6rem] font-bold mb-2" style={{ color: '#FF6B35' }}>
              Succeed with the world&apos;s most trusted
            </h2>
            <h2 className="text-xl lg:text-[2.6rem] font-bold" style={{ color: '#FF6B35' }}>
              higher education specialist
            </h2>
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="my-12  bg-[#f4f3f1] max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto pl-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 items-center">
            <div className='py-10'>
              <h2 className=" text-xl lg:text-5xl font-bold text-gray-700 mb-6">{aboutCompanyTitle}</h2>
              <p className="text-gray-700 text-sm lg:text-base font-medium leading-relaxed mb-10">
                {aboutCompanySubtitle || "We specialize in helping students achieve their dreams of studying abroad. Our comprehensive support includes university selection, application assistance, visa guidance, and pre-departure preparation. With years of experience and a proven track record, we are committed to making your study abroad journey smooth and successful."}
              </p>
              <p className="text-gray-700 text-sm lg:text-base font-semibold leading-relaxed mb-6">
                Our team of experienced counselors and education experts work tirelessly to provide personalized guidance to each student, ensuring they find the perfect fit for their academic and career goals.
              </p>
              <a href="#" className="text-sm lg:text-base font-semibold hover:opacity-80 transition inline-flex items-center gap-2" style={{ color: '#FF6B35' }}>
                Read More →
              </a>
            </div>
            <div className="relative w-full min-h-[550px] h-full overflow-hidden hidden lg:block ">
              <div
                className="w-full h-full "
                style={{
                  backgroundImage:
                    "url('/about-company.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center right",
             
                 
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-8 lg:py-12 my-4 lg:my-6 bg-[#f4f3f1]">

        {/* Mission */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row lg:justify-center items-start md:items-center gap-6 md:gap-12 pb-4">

            <div className="md:w-1/4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-gray-700">
                {missionData.title || "Our Mission"}
              </h2>
            </div>

            <div className="md:w-3/4">
              <p className="text-sm sm:text-base font-semibold text-gray-600 leading-relaxed">
                {missionData.subtitle ||
                  "To empower students worldwide by providing seamless access to international education through innovative technology and expert mentorship. We are committed to making quality education accessible to all, helping students achieve their academic and career aspirations."}
              </p>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-b border-gray-400 my-4 lg:my-6"></div>

        {/* Vision */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 justify-center items-start md:items-center">

            <div className="md:w-1/4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-gray-700">
                {visionData.title || "Our Vision"}
              </h2>
            </div>

            <div className="md:w-3/4">
              <p className="text-sm sm:text-base font-semibold text-gray-600 leading-relaxed">
                {visionData.subtitle ||
                  "To be the most trusted global platform for student recruitment, bridging the gap between talent and opportunity. We envision a world where every student has access to world-class education opportunities, regardless of their background or location."}
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* What We Do Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto ">
          <div className="mb-8">
            <span className="bg-[#FF6B35] text-white px-6 py-3 inline-block font-bold text-xl lg:text-3xl" style={{ borderTopRightRadius: '50px' }}>What we do</span>
            <div className="h-1 bg-[#FF6B35] mt-0"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
            {whatWeDoPoints.slice(0, 4).map((point, index) => (
              <div
                key={index}
                className={`group p-8 shadow-sm border border-gray-200 min-h-[280px] transition-colors duration-300 cursor-pointer ${index === 1 || index === 2
                  ? 'bg-white hover:bg-[#4A4A4A]'
                  : 'bg-white hover:bg-[#4A4A4A]'
                  } ${index === 0 ? 'rounded-tr-[50px]' :
                    index === 1 ? 'rounded-bl-[50px]' :
                      index === 2 ? 'rounded-tr-[50px]' :
                        'rounded-tl-[50px]'
                  }`}
              >
                <DynamicLucideIcon
                  name={point.icon.split("")[0].toUpperCase() + point.icon.split("").slice(1).join("")}
                  className="w-10 lg:w-16 h-16"
                />
                <h3 className={`font-bold text-base lg:text-2xl mb-2 transition-colors duration-300 ${index === 1 || index === 2
                  ? 'text-[#616262] group-hover:text-white '
                  : 'text-[#616262] group-hover:text-white'
                  }`}>
                  {point.title}
                </h3>
                <p className={`text-sm lg:text-base font-semibold leading-relaxed transition-colors duration-300 ${index === 1 || index === 2
                  ? 'text-gray-600 group-hover:text-gray-300'
                  : 'text-gray-600 group-hover:text-gray-300'
                  }`}>
                  {point.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story Behind Section */}
      <section className="lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-xl md:text-[2.6rem] font-bold text-[#616262] mb-2">
                {storyTitle.split("||")[0]}
              </h3>
              <h3 className="text-xl md:text-[2.6rem] font-bold mb-6 underline" style={{ color: '#FF6B35' }}>
                {storyTitle.split("||")[1]}
              </h3>
              <div className="text-gray-600 text-sm lg:text-base leading-relaxed font-semibold space-y-4">
                {storySubtitle.split('. ').map((sentence, index) => (
                  sentence.trim() && <p key={index}>{sentence.trim()}.</p>
                ))}
              </div>
            </div>
            <div
              className="
                relative w-full
                h-[320px] sm:h-[420px] md:h-[500px]
                lg:h-[600px]
                lg:-right-32
                hidden
                lg:block
              "
            >
              <div
                className="
                  absolute inset-0
                  lg:static
                  w-full h-full
                "
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600')",
                  backgroundSize: "cover",
                  backgroundPosition: "center right",
                  WebkitMaskImage: "url('images/about-hero-shape-3.png')",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                  WebkitMaskPosition: "right center",
                  maskImage: "url('images/about-hero-shape-3.png')",
                  maskRepeat: "no-repeat",
                  maskSize: "100% 100%",
                  maskPosition: "right center",
                }}
              />
              <motion.div
                className="
                  absolute
                  hidden
                  lg:block
                  bottom-4 left-1/2 -translate-x-1/2
                  w-[220px] h-[280px]
                  sm:w-[260px] sm:h-[340px]
                  md:w-[300px] md:h-[380px]
                  lg:top-50 lg:-left-20
                  lg:w-100 lg:h-110
                  lg:translate-x-0 lg:bottom-auto
                "
                initial={{ y: 200, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.4 }}
                style={{
                  backgroundImage:
                    "url('https://img.freepik.com/premium-photo/cute-smiling-girl-student-holding-notebooks-looking-cheerful-camera-studying-college-university-standing-blue-background_1258-70144.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  WebkitMaskImage: "url('images/about-hero-shape-front-3.png')",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                  WebkitMaskPosition: "right center",
                  maskImage: "url('images/about-hero-shape-front-3.png')",
                  maskRepeat: "no-repeat",
                  maskSize: "100% 100%",
                  maskPosition: "right center",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-8 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6 md:flex-row items-center relative z-10">

        {/* Left Orange Border (desktop only) */}
        <div
          className="absolute w-8 bg-[#f46c44] hidden lg:block z-0"
          style={{ left: "calc(50% - 50vw)", top: "-1px", height: "200px" }}
        ></div>

        {/* Right Orange Border (desktop only) */}
        <div
          className="absolute w-8 bg-[#f46c44] hidden lg:block z-0"
          style={{ right: "calc(50% - 50vw + 20px)", top: "408px", height: "200px" }}
        ></div>

        {/* Stats Grid */}
        <div className="w-full md:w-1/2 grid grid-cols-2 bg-[#f46c44] text-white min-h-[260px] md:min-h-[480px] border border-gray-300 overflow-hidden relative">

          {/* Item */}
          <div className="p-3 sm:p-4 md:p-5 border-r border-white/40 flex flex-col justify-center items-center text-center relative">
            <h4 className="text-xl sm:text-3xl md:text-7xl font-extrabold">
              10<span className="ml-1">+</span>
            </h4>
            <p className="text-xs sm:text-sm md:text-base xl:text-lg uppercase font-bold mt-1 md:mt-2">
              Countries
            </p>
            <div className="absolute bottom-0 left-3 right-3 h-px bg-white"></div>
          </div>

          <div className="p-3 sm:p-4 md:p-5 flex flex-col justify-center items-center text-center relative">
            <h4 className="text-xl sm:text-3xl md:text-7xl font-extrabold">
              900<span className="ml-1">+</span>
            </h4>
            <p className="text-xs sm:text-sm md:text-base xl:text-lg uppercase font-bold mt-1 md:mt-2">
              Universities
            </p>
            <div className="absolute bottom-0 left-3 right-3 h-px bg-white"></div>
          </div>

          <div className="p-3 sm:p-4 md:p-5 border-r border-white/40 flex flex-col justify-center items-center text-center">
            <h4 className="text-xl sm:text-3xl md:text-7xl font-extrabold">
              150k<span className="ml-1">+</span>
            </h4>
            <p className="text-xs sm:text-sm md:text-base xl:text-lg uppercase font-bold mt-1 md:mt-2">
              Courses
            </p>
          </div>

          <div className="p-3 sm:p-4 md:p-5 flex flex-col justify-center items-center text-center">
            <h4 className="text-xl sm:text-3xl md:text-7xl font-extrabold">
              90k<span className="ml-1">+</span>
            </h4>
            <p className="text-xs sm:text-sm md:text-base xl:text-lg uppercase font-bold mt-1 md:mt-2">
              Students Joined
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 relative z-10">
          <h2 className="text-xl sm:text-3xl lg:text-6xl font-bold mb-3 md:mb-4 text-[#626362]">
            {impactTitle}
          </h2>

          <div className="text-gray-700 font-semibold text-sm sm:text-base leading-relaxed space-y-3 md:space-y-4">
            {impactSubtitle.split(". ").map((sentence, index) =>
              sentence.trim() ? <p key={index}>{sentence.trim()}.</p> : null
            )}
          </div>
        </div>

      </section>

      {/* Our Services Section */}
      <section className="py-8 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Title */}
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-left text-[#626362] mb-6 md:mb-12">
            {servicesTitle}
          </h2>

          {/* Grid Box */}
          <div className="bg-white border border-[#626362] overflow-hidden mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {servicesPoints.map((service, index) => (

                <div
                  key={index}
                  className={`
              p-4 sm:p-6 lg:p-8 
              min-h-[160px] md:min-h-[200px]
              bg-[#f1f1f1] border-[#626362]

              /* Borders (only apply on desktop properly) */
              lg:${index % 3 !== 2 ? "border-r" : ""}
              lg:${index < 3 ? "border-b" : ""}

              /* Tablet borders */
              md:${index % 2 !== 1 ? "border-r" : ""}
              md:${index < servicesPoints.length - 2 ? "border-b" : ""}

              /* Mobile borders */
              border-b last:border-b-0
            `}
                >

                  {/* Icon */}
                  <div className="text-orange-500 mb-2 flex justify-start sm:justify-center">
                    <DynamicLucideIcon
                      name={
                        service.icon.charAt(0).toUpperCase() +
                        service.icon.slice(1)
                      }
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-700 mb-2 text-left sm:text-center">
                    {service.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base font-medium text-gray-700 text-left sm:text-center">
                    {service.subtitle}
                  </p>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <UniversitiesSlider />

      {/* Book Your Online Counselling Session */}
      <section className="py-8 lg:py-12 bg-gray-600 relative overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=800&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(1px)",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-12 relative z-10">

          <div className="flex flex-col gap-6 md:gap-10 lg:flex-row lg:justify-between lg:items-start">

            {/* Left Content */}
            <div className="w-full lg:w-35/80 text-left lg:text-left">
              <h2 className="text-xl sm:text-3xl lg:text-6xl font-bold text-white leading-tight">
                Book Your Online <br />
                Counselling <br />
                Session
              </h2>
            </div>

            {/* Form */}
            <div className="bg-white w-full lg:w-40/80 p-4 sm:p-6 lg:py-12 rounded-lg shadow-md">

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">

                {/* Name */}
                <input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="Name *"
                  className="w-full text-sm sm:text-base px-2 py-2 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
                />

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Mobile Number *"
                    {...register("phone", {

                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
                    })}
                    className={`w-full text-sm sm:text-base px-2 py-2 border-b focus:outline-none focus:border-b-2
                ${errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#FF6B35]"
                      }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Email Address *"
                  className="w-full text-sm sm:text-base px-2 py-2 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
                />

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Country to Study
                  </label>
                  <select
                    {...register("destination")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  >
                    <option value="">Select Destination</option>
                    <option value="usa">Study in USA</option>
                    <option value="uk">Study in UK</option>
                    <option value="canada">Study in France</option>
                    <option value="australia">Study in Italy</option>
                    <option value="germany">Study in Germany</option>
                    <option value="france">Study in Dubai</option>
                  </select>
                </div>



                {/* Checkbox */}
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1" required />
                  <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700 leading-tight">
                    I agree to the terms and conditions
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full text-white px-6 py-2.5 rounded-lg font-semibold text-sm sm:text-base hover:opacity-90 transition active:scale-95"
                  style={{ backgroundColor: "#FF6B35" }}
                >
                  Submit
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>
      {openForm && <MultiStepForm onClose={() => setOpenForm(false)} />}

    </div>
  );
}