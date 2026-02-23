import UniversityCard from '@/components/UniversityCard'
import { Divide, Facebook, Instagram, Linkedin, PhoneIcon, Send, Twitter, Youtube } from 'lucide-react'
import Image from 'next/image'

import FAQSection from '@/components/faqPage'
import { DynamicLucideIcon } from '@/components/DynamicLucideIcon'
import ImageTestimonial from './ImageTestimonial'

export default async function CountryDetails({ Universityres, Faqres, Pageres, imageData }) {
  const pageData = Pageres?.data;


  console.log(pageData)
  const rows = [
    ["Total Number of Universities", "100+ (Public & Private)"],
    ["Oldest University", "University of Bologna (Established in 1088)"],
    ["Top-Ranked Universities", "30+ universities featured in QS World Rankings"],
    ["Language of Instruction", "Italian & English (many programs offered in English)"],
    ["Tuition Fees (Public Universities)", "€500 €4,000 per year"],
    ["Intake Months", "Primarily September/October, some programs in February"],
    ["Popular Fields of Study", "Arts, Design, Architecture, Engineering, Medicine, Business"],
    ["Scholarships Available", "Yes Government, university-specific, and international grants"],
  ];

  const row = [
    {
      category: "Tuition Fees",
      details: "Undergraduate and Postgraduate Fee Structure",
      button: "View Tuition Costs >",
    },
    {
      category: "Student Visas",
      details: "Visa Requirements & Application Process",
      button: "Visa Guidelines >",
    },
    {
      category: "Scholarships",
      details: "Available Scholarships & Eligibility",
      button: "Explore Scholarships >",
    },
    {
      category: "Financial Aid",
      details: "Grants, Loans & Financial Support",
      button: "Financial Aid Options >",
    },
  ];

  // Split scholarships into left and right columns
  const scholarshipItems = pageData?.sections?.scholarships?.items || [];
  const midPoint = Math.ceil(scholarshipItems.length / 2);
  const leftScholarships = scholarshipItems.slice(0, midPoint).map(item => item.title) || [
    "British Chevening Scholarships for International Scholarships",
    "Erasmus Mundus Joint Masters Degree Scholarship",
    "Rhodes Scholarship",
    "Commonwealth Scholarship and Fellowship Plan",
  ];

  const rightScholarships = scholarshipItems.slice(midPoint).map(item => item.title) || [
    "A.S Hornby Educational Trust Scholarship",
    "Felix Scholarships",
    "Charles Wallace India Trust Scholarships (CWIT)",
    "Dr. Manmohan Singh Scholarships",
  ];

  const testimonials = [
    {
      name: "Rohan Sharma",
      university: "Harvard University",
      text: "Achieved admission in my preferred German university with clear, structured expert guidance.",
      image: "https://t4.ftcdn.net/jpg/04/67/95/73/360_F_467957383_3yRd5rVS1KcK6mjVNXaNwnGkxe2JOqDu.jpg",
      align: "image-left",
    },
    {
      name: "Priya Mehta",
      university: "Yale University",
      text: "Application and documentation process felt simple, transparent, and professionally handled.",
      image: "https://www.shutterstock.com/image-photo/happy-pretty-gen-z-latin-600nw-2440430295.jpg",
      align: "image-right",
    },
    {
      name: "Aman Verma",
      university: "Brown University",
      text: "Achieved admission in my preferred German university with clear, structured expert guidance.",
      image: "https://t4.ftcdn.net/jpg/05/76/75/39/360_F_576753965_UPYWF1GHjZuQfQo0Qupv776ubn5uWaiJ.jpg",
      align: "image-left",
    },
    {
      name: "Neha Kapoor",
      university: "Princeton University",
      text: "Proper counselling helped me confidently choose the right German university for my career.",
      image: "https://www.shutterstock.com/image-photo/happy-pretty-gen-z-latin-600nw-2440430295.jpg",
      align: "image-right",
    },
  ];

  const videos = [
    {
      name: "Dev Malhotra – Germany",
      text: "Accurate advice and quick responses kept the entire admission process perfectly streamlined.",
      image: "https://media.istockphoto.com/id/1444077739/photo/college-study-and-education-student-man-portrait-with-back-to-school-backpack-and-portfolio.jpg?s=612x612&w=0&k=20&c=PAQmqKzYd3OiKhlfrT1DVMQNkGu-drX4rtJ5p6y7D8c=",
    },
    {
      name: "Dev Malhotra – Germany",
      text: "Accurate advice and quick responses kept the entire admission process perfectly streamlined.",
      image: "https://media.istockphoto.com/id/534428407/photo/education-is-the-movement-from-darkness-to-light.jpg?s=612x612&w=0&k=20&c=ngvofAm0Rmdsvob5eedpoMrT0PWy5A3jsBbGIBfmkkA=",
    },
    {
      name: "Dev Malhotra – Germany",
      text: "Accurate advice and quick responses kept the entire admission process perfectly streamlined.",
      image: "https://media.istockphoto.com/id/1175415593/photo/excited-student-having-break-between-classes-near-university.jpg?s=612x612&w=0&k=20&c=0o6CvDpEcUP2B95SqltvFOCmZqB-joI1TxEmX900ADo=",
    },
  ];





  return (
    <>
      <section>
        {/* Hero Section */}
        <div
          className="w-full h-[80vh] relative flex items-center justify-start"
          style={{
            backgroundImage: `url(${pageData?.sections?.hero?.heroImagee || "/images/country-bg.jpeg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 h-70 top-40"></div>

          {/* Content */}
          <div className="relative z-10 w-full h-full flex flex-col justify-center px-4 md:px-8 lg:px-16">

            {/* 🎈 Balloon */}
            <div
              className="
                absolute
                left-6 top-20
                sm:left-12 sm:top-24
                lg:left-15 lg:top-auto
              "
            >
              <img
                src="/images/country-balloon.png"
                className="w-10 sm:w-12 lg:w-15 balloon-animation"
                alt=""
              />
            </div>

            {/* TEXT BLOCK */}
            <div
              className="
                absolute
                top-60 left-6
                sm:left-12 sm:top-40
                lg:top-50 lg:left-40
              "
            >
              {/* Heading */}
              <h1 className="
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                font-bold text-white
                text-left
                mb-6 max-w-xl lg:max-w-xl
              ">
                {pageData?.sections?.hero?.title || "Study in Germany"}

              </h1>

              {/* Button */}
              <div className='flex gap-2'>
                <a href={pageData?.sections?.hero?.ctaLink1 || "/contact"}>
                  <button className="
                  bg-yellow-400 hover:bg-yellow-500
                  transition duration-300
                  rounded-full
                  px-5 sm:px-6 md:px-4
                  py-3 md:py-4
                  flex items-center gap-3
                  font-bold text-gray-900
                  text-sm md:text-base lg:text-lg
                  shadow-lg
                ">
                    <PhoneIcon size={20} />
                    <span>{pageData?.sections?.hero?.ctaText1 || "Talk to an Expert Counsellor for FREE"}</span>
                  </button>
                </a>

                <a href={pageData?.sections?.hero?.ctaLink2 || "/contact"}>
                  <button className="
                  bg-yellow-400 hover:bg-yellow-500
                  transition duration-300
                  rounded-full
                  px-5 sm:px-6 md:px-8
                  py-3 md:py-4
                  flex items-center gap-3
                  font-bold text-gray-900
                  text-sm md:text-base lg:text-lg
                  shadow-lg
                ">
                    <PhoneIcon size={20} />
                    <span>{pageData?.sections?.hero?.ctaText2 || "Talk to an Expert Counsellor for FREE"}</span>
                  </button>
                </a>

              </div>

            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div
            className="
              absolute bottom-0 right-0
              w-[260px] sm:w-[420px] md:w-[600px]
              lg:w-[900px]
            "
          >
            <img
              src={pageData?.sections?.hero?.heroImage || "/images/country-hero.png"}
              className="w-full h-full object-contain"
              alt=""
            />
          </div>
        </div>
      </section>

      <section className="pr-10 py-16 relative overflow-hidden">
        <div className="mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* ================= LEFT FORM ================= */}
          <div className="bg-white border border-gray-300 p-8 lg:px-4 shadow-sm">
            <h2 className="text-orange-500 text-2xl font-semibold mb-8 pl-12 tracking-wide">
              GET IN TOUCH
            </h2>

            <div className="space-y-8 pl-10">
              <input
                type="text"
                placeholder="Name"
                className="w-lg border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-lg border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent"
              />

              <input
                type="text"
                placeholder="Mobile"
                className="w-lg border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent"
              />

              <select className="w-lg border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent">
                <option>Nearest Center</option>
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Chandigarh</option>
              </select>

              <textarea
                placeholder="Queries"
                rows={3}
                className="focus:outline-none focus:border-orange-500 bg-transparent resize-none"
              />

              <a className='' href={pageData?.sections?.formSection?.ctaLink1 || "/contact"}>
                <button className="bg-secondary hover:bg-[#6d1403] text-white px-8 py-3 rounded-full font-semibold transition mb-4 ">
                  {"CONTACT Us"}
                </button>
              </a>
              <div className='w-lg border-b-2 border-gray-400'></div>
            </div>
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="relative z-10">
            <h4 className="text-red-600 text-3xl font-medium mb-2">
              {pageData?.sections?.formSection?.title?.split('||')[0]?.trim() || "Overview of"}
            </h4>

            <h2 className="text-[#123b73] text-4xl lg:text-5xl font-bold mb-6 relative inline-block">
              {pageData?.sections?.formSection?.title?.split('||')[1]?.trim() || "Study in Germany"}
              <span className="absolute right-0 -bottom-4 w-16 h-1 bg-red-600"></span>
            </h2>

            <p className="text-gray-700 leading-relaxed text-lg mb-6 w-xl">
              {pageData?.sections?.formSection?.subtitle || "Germany is one of the most popular study destinations, known for its world-class education, globally recognized universities, and affordable study options."}
            </p>

            <a href={pageData?.sections?.formSection?.ctaLink1 || "/contact"}>
              <button className="bg-secondary hover:bg-[#6d1403] text-white px-6 py-3 rounded-full font-semibold transition">
                {pageData?.sections?.formSection?.ctaText1 || "Read More >>"}
              </button>
            </a>
          </div>
        </div>

        {/* ================= RIGHT SIDE TOWER IMAGE ================= */}
        <div className="hidden lg:block absolute right-10 -bottom-50 h-full w-[300px]">
          <Image
            src="/images/tower.png"
            alt="Germany Tower"
            fill
            className="object-contain object-right w-30 h-50"
          />
        </div>
      </section>

      <section className="w-full bg-[#ef6a42] py-20 px-6">
        <div className="max-w-5xl mx-auto text-left">

          {/* Heading */}
          <h2 className="text-white text-4xl md:text-5xl font-bold relative inline-block">
            {pageData?.sections?.whyChooseUs?.title || "Why Choose Germany ?"}
            <span className="block w-16 h-1 bg-yellow-400 absolute left-0 mt-3"></span>
          </h2>

          {/* Paragraph */}
          <p className="text-white text-lg md:text-xl mt-8 leading-relaxed">
            {pageData?.sections?.whyChooseUs?.subtitle || "Germany is one of the top study destinations in the world, known for its high-quality education, globally recognized degrees, and affordable tuition fees."}
          </p>

          {/* Button */}
          <div className="mt-10 text-center">
            <a href={pageData?.sections?.whyChooseUs?.ctaLink1 || "/contact"}>
              <button className="bg-secondary hover:bg-[#5a1002] text-white  px-8 py-3 rounded-full text-lg font-semibold transition">
                {pageData?.sections?.whyChooseUs?.ctaText1 || "Read More >>"}
              </button>
            </a>
          </div>

        </div>
      </section>

      <section className="w-full py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[#123b73] relative inline-block">
              {pageData?.sections?.whyStudy?.title || "Why Study in Germany ?"}
              <span className="absolute right-0 -bottom-3 w-20 h-1 bg-red-600"></span>
            </h2>
          </div>

          <div className="">

            {/* ================= LEFT CONTENT ================= */}
            <div>
              <p className="text-[#123b73] text-lg mb-10 leading-relaxed">
                {pageData?.sections?.whyStudy?.subTitle || "Germany is one of the most preferred study destinations for international students due to its world-class education system and strong career opportunities."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                {(pageData?.sections?.whyStudy?.items || []).map((item, index) => (

                  <div key={index} className="flex items-start gap-4 bg-gray-200 p-4 rounded-xl">
                    <div className="text-[#8b1d04]">
                      <DynamicLucideIcon name={item.icon} size={34} />
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-[#123b73]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                ))}
              </div>
            </div>



          </div>

        </div>
      </section>

      <section className="w-full min-h-screen px-30 bg-white lg:pt-20 lg:pb-62 relative">
        <div className='max-w-7xl ml-6'>
          {/* Title Section */}
          <div className="mb-8 md:mb-12 w-4xl">
            <h1 className="text-4xl relative md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              {pageData?.sections?.lifeIn?.title || "Life in Germany"}
              <span className="w-25 h-1.5 absolute right-80 -bottom-4 bg-red-600 rounded-full"></span>
            </h1>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
            {/* Left Section - Benefits List */}
            <div className="flex flex-col  gap-5 md:gap-6">
              {(pageData?.sections?.lifeIn?.items || []).map((item, index) => (
                <div key={index} className="flex items-center gap-4 w-120 relative z-1">
                  {/* Left Border Accent */}
                  <div className="w-60 h-20 bg-secondary absolute -z-1 -top-2 -left-2"></div>

                  {/* Benefit Box */}
                  <div className="flex-1 bg-[#f46c44] hover:bg-orange-600 transition-colors rounded-tr-[50px] px-6 md:px-3 py-4 md:py-5 text-white  text-base ">
                    <h1 className='text-3xl font-semibold' >{item.title}</h1>
                    <p className='text-sm text-white'>{item?.description}</p>

                  </div>
                </div>
              ))}
            </div>

            {/* Right Section - Images */}
            <div className="flex flex-col gap-4 absolute right-0 top-50">
              {/* Yellow Accent Bar */}

              {/* Top Image - Woman with Laptop */}
              <div className="relative w-full h-48 md:h-56 lg:h-140 shadow-md z-1">
                <div className="w-70 h-10 bg-yellow-400 absolute -top-5 right-20 -z-1"></div>

                <img
                  src={pageData?.sections?.lifeIn?.image || ""}
                  alt="Woman working on laptop"
                  className="w-170 h-full object-cover "
                />
              </div>

            </div>

          </div>
        </div>
        {/* Bottom Image - Munich Cityscape */}
        <img
          src={pageData?.sections?.lifeIn?.buttomImage || "/images/life-germany-img-1.png"}
          alt="Munich cityscape"
          className="w-[700px] h-[600px] object-contain absolute left-130 bottom-0 z-11"
        />
      </section>

      <section className="relative w-full bg-[#ef6a42] py-10">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 items-center">

          {/* ================= LEFT IMAGE ================= */}
          <div className="relative w-full -left-50 h-[400px] lg:h-[450px]">
            <Image
              src={pageData?.sections?.choosingUs?.image || "/images/country-university-img.png"}
              alt="Germany University"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="px-8 py-16 lg:px-4 text-white">

            <h4 className="text-3xl md:text-5xl font-light mb-2">
              {pageData?.sections?.choosingUs?.title?.split('||')[0]?.trim() || "Choosing the Right"}
            </h4>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold relative inline-block mb-6 ">
              {pageData?.sections?.choosingUs?.title?.split('||')[1]?.trim() || "University in Germany"}
              <span className="absolute left-0 -bottom-4 w-20 h-1 bg-yellow-400"></span>
            </h2>

            <p className="text-lg md:text-xl leading-relaxed max-w-xl">
              {pageData?.sections?.choosingUs?.subtitle || "Germany offers exceptional educational opportunities, but choosing the right university requires more than just rankings."}
            </p>

          </div>

        </div>

        {/* ================= BOTTOM YELLOW ACCENT ================= */}
        <div className="absolute bottom-12 left-20 w-74 h-6 bg-yellow-300"></div>

      </section>

      <div className='w-full bg-[#ef6a42] px-8 pb-10 mx-auto'>
        <UniversityCard university={Universityres?.data?.result} />
      </div>

    

      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto">

         

          {/* Table Wrapper */}
          <div className="overflow-x-auto">
            {pageData?.sections?.contentSection?.items?.map((item, i) => (
              <>
              <div key={i}>
               {/* Heading */}
          <div className=" m-10 ">
            <h2 className="text-primary text-3xl md:text-4xl font-bold relative inline-block">
            <span className='text-red-600'>{item.title.split("||")[0]}</span> 
           <br /> <span>{item.title.split("||")[1]}</span> 
            <span className=' border-b-4 border-red-600'>{item.title.split("||")[2]}</span> 


            </h2>
          </div>
              <div
                
                className=""
                dangerouslySetInnerHTML={{
                  __html: item.description
                }}
              />
              </div>
              </>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#ef6a42] py-20 px-6">
        <div className="max-w-6xl mx-auto text-white">

          {/* Heading */}
          <div className="mb-10">
            <p className="text-5xl font-light mb-2">
              {pageData?.sections?.scholarships?.title?.split('||')[0]?.trim() || "scholarships to"}
            </p>

            <h2 className="text-5xl md:text-6xl font-bold relative inline-block">
              {pageData?.sections?.scholarships?.title?.split('||')[1]?.trim() || "Study in germany"}
              <span className="absolute right-0 -bottom-4 w-16 h-1 bg-yellow-400"></span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-3xl text-lg leading-relaxed">
              {pageData?.sections?.scholarships?.subTitle || "Germany provides various scholarships for international students, including DAAD and university-funded options."}
            </p>
          </div>

          {/* Scholarship Lists */}
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-6 mt-12">

            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {leftScholarships.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-yellow-400 text-black rounded-full p-2">
                    <DynamicLucideIcon name="CircleDollarSign" size={18} />
                  </div>

                  <p className="border-b border-white pb-1 hover:opacity-80 cursor-pointer">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {rightScholarships.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-yellow-400 text-black rounded-full p-2">
                    <DynamicLucideIcon name="CircleDollarSign" size={18} />
                  </div>

                  <p className="border-b border-white pb-1 hover:opacity-80 cursor-pointer">
                    {item}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <ImageTestimonial
        title={Pageres?.imageTestimonials?.title}

        subtitle={Pageres?.imageTestimonials?.subtitle}
        items={imageData}
      />

      <section className="bg-[#f3f3f3] py-20 px-20">
        <div className="mx-auto">

          {/* ===== HEADING ===== */}
          <div className="mb-16">
            <h2 className="text-xl lg:text-5xl mb-2">
              <span className="text-red-700">
                {pageData?.sections?.videoTestimonials?.title?.split('||')[0]?.trim() || "Video"}
              </span>{" "} <br />
              <span className="text-primary font-bold relative">
                {pageData?.sections?.videoTestimonials?.title?.split('||')[1]?.trim() || "Testimonials"}
                <span className="absolute right-0 bottom-0 w-25 h-[2px] lg:h-1 bg-red-700"></span>
              </span>
            </h2>
          </div>

          {/* ===== CARDS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((item, index) => (
              <div key={index} className="relative">

                {/* IMAGE */}
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-[520px] object-cover object-top rounded-3xl"
                  />
                </div>

                {/* INFO CARD */}
                <div className="absolute left-[213.5px] -translate-x-1/2 bottom-[0px] w-full bg-white rounded-2xl border border-gray-500 shadow-md px-4 py-5 text-left">
                  <h3 className="font-bold text-primary mb-2">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    "{item.text}"
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="relative bg-[#ee6a43] overflow-hidden">

        {/* ===== MAIN CONTENT ===== */}
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 items-center">

          {/* LEFT SIDE */}
          <div className="text-white relative z-10">

            {/* Graduation Cap */}
            <img
              src="/images/country-cap.png"
              alt=""
              className="w-28 mb-4 absolute -top-15 -left-13 z-1"
            />

            {/* HEADING */}
            <h2 className="text-5xl font-semibold leading-tight relative mb-4">
              {pageData?.sections?.cta?.title || "Start Your Global Education Journey"}

              <div className="w-56 h-2 bg-yellow-400 mt-2 rounded-full absolute right-50"></div>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 text-lg max-w-xl text-white/90">
              Explore top universities, expert guidance, and seamless
              admission support with Ooshas Global.
            </p>

            {/* BUTTON + SOCIAL */}
            <div className="flex items-center gap-6 mt-8 flex-wrap">

              <a href="/contact">
                <button className="bg-[#7a1e0e] px-8 py-3 rounded-full font-medium shadow-md hover:scale-105 transition">
                  Contact US
                </button>
              </a>

              {/* SOCIAL ICONS */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Facebook size={18} />
                </div>
                <div className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Instagram size={18} />
                </div>
                <div className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Twitter size={18} />
                </div>
                <div className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Youtube size={18} />
                </div>
                <div className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Send size={18} />
                </div>
                <div className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Linkedin size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT GRAPHIC */}
          <div className="hidden lg:block relative h-[380px]">

            {/* London Eye */}
            <img
              src="/images/circle stand.png"
              alt=""
              className="absolute right-45 -bottom-3 w-[90px]"
            />

            <img
              src="/images/circle.png"
              alt=""
              className='w-100 absolute right-[24.5px] -bottom-12 animate-spin [animation-duration:60s]'
            />

          </div>
        </div>

        {/* CITY SILHOUETTE */}
        <img
          src="/images/country-building-img.png"
          alt=""
          className="absolute bottom-0 right-0 w-1/2"
        />

        {/* YELLOW STRIP */}
        <div className="absolute bottom-0 left-0 w-1/2 h-3 bg-yellow-400"></div>

      </section>

      <FAQSection Faqres={Faqres?.data?.data} />
    </>
  )
}