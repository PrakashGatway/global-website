
import UniversityCard from '@/components/UniversityCard'
import { PhoneIcon , GraduationCap,
  Globe,
  Briefcase,
  Target,
  BadgeCheck,
  DollarSign,
  Linkedin,
  Send,
  Youtube,
  Twitter,
  Instagram,
  Facebook, } from 'lucide-react'
import Image from 'next/image'
import { serverInstance } from '../axiosInstance'
import FAQSection from '@/components/faqPage'



export default async function CountryDetails({Universityres , Faqres}){

    const benefits = [
    'High Quality of Life',
    'Safe & Secure Country',
    'Living Costs €800-1,000/Month',
    'Post-Study & Festivals',
    'Strong Job Market'
  ]


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


   const leftScholarships = [
    "British Chevening Scholarships for International Scholarships",
    "Erasmus Mundus Joint Masters Degree Scholarship",
    "Rhodes Scholarship",
    "Commonwealth Scholarship and Fellowship Plan",
  ];

  const rightScholarships = [
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



    


    return(
        <>
        <section>
  {/* Hero Section */}
  <div
    className="w-full h-[80vh] relative flex items-center justify-start"
    style={{
      backgroundImage: 'url("/images/country-bg.jpeg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/50 h-60 top-40"></div>

    {/* Content */}
    <div className="relative z-10 w-full h-full flex flex-col justify-center px-4 md:px-8 lg:px-16">

      {/* 🎈 Balloon */}
      <div
        className="
          absolute
          left-6 top-20
          sm:left-12 sm:top-24
          lg:left-30 lg:top-auto
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
          lg:top-50 lg:left-60
        "
      >
        {/* Heading */}
        <h1 className="
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          font-bold text-white
          text-left
          mb-6 max-w-xl lg:max-w-2xl
        ">
          Study in Germany
        </h1>

        {/* Button */}
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
          <span>Talk to an Expert Counsellor for FREE</span>
        </button>
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
        src="/images/country-hero.png"
        className="w-full h-full object-contain"
        alt=""
      />
    </div>
  </div>
</section>



         <section className="pr-10  py-16 relative overflow-hidden">
      <div className=" mx-auto grid lg:grid-cols-2 gap-12 items-center">

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
              className=" focus:outline-none focus:border-orange-500 bg-transparent resize-none"
            />

           
              <button className="bg-secondary hover:bg-[#6d1403] text-white px-8 py-3 rounded-full font-semibold transition">
                CONTACT ME
              </button>
              <div className='w-lg border-b-2 border-gray-400'></div>
            
          </div>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="relative z-10">
          <h4 className="text-red-600 text-3xl font-medium mb-2">
            Overview of
          </h4>

          <h2 className="text-[#123b73] text-4xl lg:text-5xl font-bold mb-6 relative inline-block">
            Study in Germany
            <span className="absolute right-0 -bottom-4 w-16 h-1 bg-red-600"></span>
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg mb-6 w-xl">
            Germany is one of the most popular study destinations, known for its
            world-class education, globally recognized universities, and
            affordable study options. Most public universities charge little to
            no tuition fees, allowing students to access high-quality academic
            programs across fields like engineering, technology, business, and
            computer science.
          </p>

          <button className="bg-secondary hover:bg-[#6d1403] text-white px-6 py-3 rounded-full font-semibold transition">
            Read More &gt;&gt;
          </button>
        </div>
      </div>

      {/* ================= RIGHT SIDE TOWER IMAGE ================= */}
      <div className="hidden lg:block absolute right-10 -bottom-50 h-full w-[300px]">
        <Image
          src="/images/tower.png"  // replace with your image
          alt="Germany Tower"
          fill
          className="object-contain object-right w-30 h-50"
        />
      </div>
    </section>


     <section className="w-full bg-[#ef6a42] py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-white text-4xl md:text-5xl font-bold relative inline-block">
          Why Choose Germany ?
          <span className="block w-16 h-1 bg-yellow-400 absolute right-0 mt-3"></span>
        </h2>

        {/* Paragraph */}
        <p className="text-white text-lg md:text-xl mt-8 leading-relaxed">
          Germany is one of the top study destinations in the world, known for its 
          high-quality education, globally recognized degrees, and affordable tuition 
          fees. With strong industry connections, excellent research opportunities, 
          and a thriving job market, Germany offers international students outstanding 
          career prospects. The country also provides a safe environment, multicultural 
          exposure, and numerous post-study work opportunities, making it an ideal 
          choice for ambitious students.
        </p>

        {/* Button */}
        <div className="mt-10">
          <button className="bg-secondary hover:bg-[#5a1002] text-white px-8 py-3 rounded-full text-lg font-semibold transition">
            Read More &gt;&gt;
          </button>
        </div>

      </div>
    </section>


     <section className="w-full  py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#123b73] relative inline-block">
            Why Study in Germany ?
            <span className="absolute right-0 -bottom-3 w-20 h-1 bg-red-600"></span>
          </h2>
        </div>

        {/* Divider Line */}
        

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ================= LEFT CONTENT ================= */}
          <div>

            <p className="text-[#123b73] text-lg mb-10 leading-relaxed">
              Germany is one of the most preferred study destinations for 
              international students due to its world-class education system 
              and strong career opportunities.
            </p>

            <div className="space-y-8">

              {/* Item 1 */}
              <div className="flex items-start gap-4">
                <div className="text-[#8b1d04]">
                  <GraduationCap size={34} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Tuition-Free Education
                  </h4>
                  <p className="text-[#123b73]">
                    Public universities offer low or no tuition fees.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4">
                <div className="text-[#8b1d04]">
                  <Globe size={34} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Globally Recognized Degrees
                  </h4>
                  <p className="text-[#123b73]">
                    German universities rank among the top worldwide.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-4">
                <div className="text-[#8b1d04]">
                  <Briefcase size={34} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Strong Job Market
                  </h4>
                  <p className="text-[#123b73]">
                    Excellent career opportunities after graduation.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-4">
                <div className="text-[#8b1d04]">
                  <Target size={34} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Industry-Focused Programs
                  </h4>
                  <p className="text-[#123b73]">
                    Practical learning with global companies.
                  </p>
                </div>
              </div>

              {/* Item 5 */}
              <div className="flex items-start gap-4">
                <div className="text-[#8b1d04]">
                  <BadgeCheck size={34} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Post-Study Work Visa
                  </h4>
                  <p className="text-[#123b73]">
                    Stay back and explore career options.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          

           

            <div className="relative w-[350px] h-[450px] md:w-[700px] md:h-[500px] rounded-tl-[40px] rounded-br-[40px]  ">
                 {/* Yellow Accent Box */}
            
              <Image
                src="/images/country-why-img.png"  // replace with your image
                alt="Students in Germany"
                fill
                className="object-contain rounded-tl-[40px] rounded-br-[40px]  absolute inset-0 w-full h-full"
              />
            </div>

          </div>

        </div>
      
    </section>


    
        <section className="w-full min-h-screen px-30 bg-white  lg:pt-20  lg:pb-62 relative  ">
            <div className='max-w-7xl ml-6 '>
                 {/* Title Section */}
        <div className=" mb-8 md:mb-12 w-xl">
          <h1 className="text-4xl relative md:text-5xl lg:text-6xl font-bold text-primary mb-4 ">
            Life in Germany
            <span className="w-25 h-1.5 absolute right-25 -bottom-4 bg-red-600  rounded-full"></span>
          </h1>
          
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
          {/* Left Section - Benefits List */}
          <div className="flex flex-col gap-5 md:gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 w-80 relative">
                {/* Left Border Accent */}
                <div className="w-40 h-16 bg-secondary absolute -z-1 -top-2 -left-2"></div>
                
                {/* Benefit Box */}
                <div className="flex-1  bg-[#f46c44] hover:bg-orange-600 transition-colors rounded-tr-3xl px-6 md:px-3 py-4 md:py-5 text-white font-bold text-base md:text-lg">
                  {benefit}
                </div>
              </div>
            ))}
          </div>

          {/* Right Section - Images */}
          <div className="flex flex-col gap-4 absolute right-0 top-50">
            {/* Yellow Accent Bar */}

            {/* Top Image - Woman with Laptop */}
            <div className="relative w-full h-48 md:h-56 lg:h-140   shadow-md">
            <div className="w-70 h-10 bg-yellow-400 absolute -top-5 right-20 -z-1"></div>

              <img 
                src="/images/life-germany-img-2.jpeg"
                alt="Woman working on laptop"
                className="w-170 h-full object-cover"
              />
            </div>

           
          </div>
          
        </div>
            </div>
             {/* Bottom Image - Munich Cityscape */}
            
              <img 
                src="/images/life-germany-img-1.png"
                alt="Munich cityscape"
                className="w-[700px] h-[600px] object-contain absolute left-110 bottom-0"
              />
            
       
      </section>


        <section className="relative w-full bg-[#ef6a42]  py-10">

      {/* Main Content */}
      <div className="  grid lg:grid-cols-2 items-center">

        {/* ================= LEFT IMAGE ================= */}
        <div className="relative w-full -left-50 h-[400px] lg:h-[450px]">
          <Image
            src="/images/country-university-img.png" // replace with your image
            alt="Germany University"
            fill
            className="object-contain "
            priority
          />
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="px-8 py-16 lg:px-4 text-white">

          <h4 className="text-3xl md:text-5xl font-light mb-2">
            Choosing the Right
          </h4>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold relative inline-block mb-6 w-2xl">
            University in Germany
            <span className="absolute right-0 -bottom-4 w-20 h-1 bg-yellow-400"></span>
          </h2>

          <p className="text-lg md:text-xl leading-relaxed max-w-xl">
            Germany offers exceptional educational opportunities, but choosing 
            the right university requires more than just rankings. Factors such 
            as program structure, specialization, location, industry connections, 
            and career prospects all play a vital role in making the best decision.
          </p>

        </div>

      </div>

      {/* ================= BOTTOM YELLOW ACCENT ================= */}
      <div className="absolute -bottom-6 left-20 w-74 h-6 bg-yellow-300"></div>

    </section>

            <div className='w-full bg-white' >
                <div className=" max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-18 py-20 ">

    {Universityres.data.result.map((uni) => (
            <UniversityCard 
              key={uni._id} 
              university={uni}
            />
          ))}
    </div>

            </div>
     



     <section className="w-full bg-white py-16 ">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className=" mb-10">
          <p className="text-red-500 text-xl md:text-5xl font-medium">
            How to find the best
          </p>

          <h2 className="text-primary text-3xl md:text-5xl font-bold relative inline-block">
            German university for you
            <span className="absolute right-0  -bottom-3 w-24 h-1 bg-red-600"></span>
          </h2>
        </div>

        {/* Container */}
        <div className="bg-white text-center rounded-2xl border border-gray-300 p-6 md:p-10 shadow-sm">

          <h3 className="text-[#123b73] text-start text-2xl font-semibold mb-6">
            Highlight Table
          </h3>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">

              {/* Header */}
              <thead>
                <tr className="bg-[#ef6a42] text-white text-center">
                  <th className="py-4 px-6 border border-gray-300 font-semibold">
                    Parameters
                  </th>
                  <th className="py-4 px-6 border border-gray-300 font-semibold">
                    Details
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="bg-white">
                    <td className="py-4 px-6 border border-gray-300 text-[#ef6a42] font-medium">
                      {row[0]}
                    </td>
                    <td className="py-4 px-6 border border-gray-300 text-[#123b73]">
                      {row[1]}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </section>



     <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-primary text-3xl md:text-5xl font-bold relative inline-block">
            Tuition fees, visas and financial aid
            <span className="absolute right-0  -bottom-3 w-24 h-1 bg-red-600"></span>
          </h2>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">

            {/* Header */}
            <thead>
              <tr className="bg-[#ef6a42] text-white text-center">
                <th className="py-5 px-6 text-lg font-semibold">
                  Category
                </th>
                <th className="py-5 px-6 text-lg font-semibold">
                  Details
                </th>
                <th className="py-5 px-6 text-lg font-semibold text-center">
                  Information
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {row.map((row, index) => (
                <tr key={index} className="bg-white text-center border-2 border-gray-300">

                  {/* Category */}
                  <td className="py-10 px-6 text-[#ef6a42] font-semibold text-lg border border-gray-300">
                    {row.category}
                  </td>

                  {/* Details */}
                  <td className="py-10 px-6 text-[#123b73] text-lg border border-gray-300">
                    {row.details}
                  </td>

                  {/* Button */}
                  <td className="py-10 px-6 text-center border border-gray-300">
                    <button className="bg-[#7a1b05] hover:bg-[#5e1404] text-white px-8 py-3 rounded-full font-semibold transition">
                      {row.button}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </section>



     <section className="w-full bg-[#ef6a42] py-20 px-6">
      <div className="max-w-6xl mx-auto text-white">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-5xl font-light mb-2">
            scholarships to
          </p>

          <h2 className="text-5xl md:text-6xl font-bold relative inline-block">
            Study in germany
            <span className="absolute right-0 -bottom-4 w-16 h-1 bg-yellow-400"></span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-3xl text-lg leading-relaxed">
            Germany provides various scholarships for international students,
            including DAAD and university-funded options. These may cover tuition
            fees, living costs, or both.
          </p>
        </div>

        {/* Scholarship Lists */}
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-6 mt-12">

          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {leftScholarships.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-yellow-400 text-black rounded-full p-2">
                  <DollarSign size={18} />
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
                  <DollarSign size={18} />
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


      <section className="w-full py-16 px-8 bg-background">
      <div className=" mx-auto">
        {/* Heading */}
        <div className=" max-w-7xl mx-auto mb-12 ">
          <h2 className=" text-xl lg:text-5xl  mb-2 ">
              <span  className="text-red-700" >
                Image
              </span>{" "} <br />
              <span className="text-primary font-bold relative">
                Testimonials
        <span className="absolute right-0 bottom-0  w-25 h-[2px] lg:h-1 bg-red-700"></span>

                
              </span>


            </h2>
          
        </div>

        {/* Desktop bento grid (≥1024px) */}
        <div className="hidden lg:grid grid-cols-4 gap-6 py-10">

  {testimonials.map((item, index) => {

    const isReverse = index % 2 !== 0; // 👈 second card reverse

    return (
     <div
  className={`
    flex
    ${isReverse ? "flex-col-reverse relative" : "flex-col"}
    relative
    z-1
  `}
>
  <div className={`absolute bg-orange-500 rounded-4xl    ${isReverse ? " w-50 -z-1 -bottom-[5px] h-[200px] -right-[5px] " : "h-50 -top-[55px] -left-[5px] -z-1 w-50"}`} ></div>
  {/* IMAGE */}
  <div className="overflow-hidden h-[300px] -mt-12">
    <img
      src={item.image}
      className="w-full h-full object-cover object-center rounded-4xl"
    />
  </div>

  {/* CARD */}
  <div
    className={`
      bg-white rounded-4xl  py-6
      shadow-lg border border-gray-500 flex gap-4
      relative z-10
      transform
      ${isReverse ? "-translate-y-0" : "translate-y-[-56px]"}
    `}
  >
    <img
      src='https://logos-world.net/wp-content/uploads/2021/01/Harvard-Emblem.png'
      className="w-40 h-18 object-contain mt-12"
    />

    <div>
      <h3 className="text-xl font-bold text-[hsl(0,70%,35%)]">
        {item.name}
      </h3>

      <p className="text-base text-[hsl(0,70%,35%)]">
        {item.text}
      </p>
    </div>
  </div>
</div>

    );
  })}

</div>


        {/* Tablet grid (768px–1023px) */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <div key={t.name} className="flex flex-col gap-4">
              {i % 2 === 0 ? (
                <>
                  <div className="rounded-2xl overflow-hidden border-2 border-[hsl(15,80%,50%)] aspect-[3/4]">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-card rounded-2xl p-5 shadow-md border border-border">
                    {/* <UniversityLogo name={t.university} /> */}
                    <h3 className="text-sm font-bold text-[hsl(0,70%,35%)] mb-2">{t.name}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{t.text}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-card rounded-2xl p-5 shadow-md border border-border">
                    {/* <UniversityLogo name={t.university} /> */}
                    <h3 className="text-sm font-bold text-[hsl(0,70%,35%)] mb-2">{t.name}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{t.text}</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden border-2 border-[hsl(15,80%,50%)] aspect-[3/4]">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Mobile (<768px) */}
        <div className="flex flex-col gap-6 md:hidden">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden border-2 border-[hsl(15,80%,50%)] aspect-[4/5]">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div className="bg-card rounded-2xl p-5 shadow-md border border-border">
                {/* <UniversityLogo name={t.university} /> */}
                <h3 className="text-sm font-bold text-[hsl(0,70%,35%)] mb-2">{t.name}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>




      <section className="bg-[#f3f3f3] py-20 px-20">
      <div className=" mx-auto ">

        {/* ===== HEADING ===== */}
        <div className=" mb-16">
          <h2 className=" text-xl lg:text-5xl  mb-2 ">
              <span  className="text-red-700" >
                Video
              </span>{" "} <br />
              <span className="text-primary font-bold relative">
                Testimonials
        <span className="absolute right-0 bottom-0  w-25 h-[2px] lg:h-1 bg-red-700"></span>

                
              </span>


            </h2>
        </div>

        {/* ===== CARDS ===== */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-10
          
        ">
          {videos.map((item, index) => (
            <div key={index} className="relative">

              {/* IMAGE */}
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-full
                    h-[520px]
                    object-cover
                    object-top
                    rounded-3xl
                    
                  "
                />
              </div>

              {/* INFO CARD */}
              <div className="
                absolute
                left-[213.5px]
                -translate-x-1/2
                bottom-[0px]
                w-full
                bg-white
                rounded-2xl
                border
                border-gray-500
                shadow-md
                px-4
                py-5
                text-left
              ">
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
            Start Your Global
            <br />
            Education Journey

          <div className="w-56 h-2 bg-yellow-400 mt-2 rounded-full absolute right-50"></div>

          </h2>

          {/* Yellow underline */}

          {/* DESCRIPTION */}
          <p className="mt-6 text-lg max-w-xl text-white/90">
            Explore top universities, expert guidance, and seamless
            admission support with Ooshas Global.
          </p>

          {/* BUTTON + SOCIAL */}
          <div className="flex items-center gap-6 mt-8 flex-wrap">

            <button className="
              bg-[#7a1e0e]
              px-8 py-3
              rounded-full
              font-medium
              shadow-md
              hover:scale-105
              transition
            ">
              Contact US
            </button>

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

          <img src="/images/circle.png" alt="" className='w-100 absolute right-[24.5px] -bottom-12 animate-spin [animation-duration:60s]' />

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

          <FAQSection Faqres = {Faqres.data.data} />



    
        
        </>
    )
}