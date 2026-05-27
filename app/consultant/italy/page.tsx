"use client";
import axiosInstance from "@/app/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  course: string;
};

export default function ItalyLanding() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "", course: "" });
  const [heroForm, setHeroForm] = useState<LeadForm>({ name: "", email: "", phone: "", course: "" });
  const [submitted, setSubmitted] = useState(false);
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPopupOpen(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const closePopup = () => setPopupOpen(false);

  const handleSubmit = async (
    e: React.FormEvent,
    isHero = false
  ) => {
    e.preventDefault();

    try {
      const currentForm = isHero ? heroForm : form;
      const payload = {
        fullName: currentForm.name,
        email: currentForm.email,
        phone: currentForm.phone,
        destination: "Italy",
        subject: "Study Abroad Enquiry",
        type: "italy-landing",
        source: "website",
        city: currentForm.city || "",
        description: `Course Interest: ${currentForm.course}`,
      };
      await axiosInstance.post("/contactus", payload);
      toast.success("Form submitted successfully");
      if (isHero) {
        setHeroSubmitted(true);

        setTimeout(() => {
          setHeroSubmitted(false);

          setHeroForm({
            name: "",
            email: "",
            phone: "",
            course: "",
          });
        }, 2000);
      }
      else {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setPopupOpen(false);

          setForm({
            name: "",
            email: "",
            phone: "",
            course: "",
          });
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const faqs = [
    { q: "Are Bachelor's programs available in English in Italy?", a: "Yes, many Italian universities offer Bachelor's and Master's programs fully taught in English across engineering, business and design." },
    { q: "Are scholarships available for Indian students?", a: "Yes, Italian universities and the government offer multiple scholarships including tuition waivers and DSU regional grants up to 100%." },
    { q: "Can I study in Italy without IELTS?", a: "A few universities accept alternatives like MOI or English-medium 12th certificates. Our counsellors will guide you based on your profile." },
    { q: "What is the cost of studying in Italy?", a: "Public university tuition typically ranges from €900 to €4,000 per year, with affordable living costs compared to other European countries." },
    { q: "Is MBA a good option in Italy?", a: "Absolutely. Italy hosts globally ranked B-schools such as SDA Bocconi, MIP Politecnico di Milano and LUISS." },
  ];

  const studyPrograms = [
    {
      id: 1,
      title: "Engineering",
      icon: "/svg/engineering.svg",
      subjects: [
        "Mechanical Engineering",
        "Aerospace Engineering",
        "Civil Engineering",
        "Environmental Engineering",
        "Automation & Robotics Engineering",
      ],
    },

    {
      id: 2,
      title: "Technology & IT",
      icon: "/svg/technology.svg",
      subjects: [
        "Artificial Intelligence (AI)",
        "Cybersecurity",
        "Data Science & Analytics",
        "Software Engineering",
        "Cloud Computing & Engineering",
      ],
    },

    {
      id: 3,
      title: "Design & Arts",
      icon: "/svg/creativity.svg",
      subjects: [
        "Fashion Design",
        "Luxury Brand Management",
        "Product Design",
        "Architecture",
        "Interior Design",
      ],
    },

    {
      id: 4,
      title: "Business & Management",
      icon: "/svg/research.svg",
      subjects: [
        "Master of Business Administration (MBA)",
        "Finance & Banking",
        "International Business",
        "Luxury Management",
        "Marketing & Brand Management",
      ],
    },

    {
      id: 5,
      title: "Hospitality & Tourism",
      icon: "/svg/hotel.svg",
      subjects: [
        "Hospitality Management",
        "Tourism Management",
        "Event Management",
        "Hotel & Resort Management",
        "Food & Beverage Management",
      ],
    },

    {
      id: 6,
      title: "Science & Humanities",
      icon: "/svg/people.svg",
      subjects: [
        "Mechanical Engineering",
        "Aerospace Engineering",
        "Civil Engineering",
        "Environmental Engineering",
        "Automation & Robotics Engineering",
      ],
    },
  ];

  const universities = [
    {
      id: 1,
      name: "University of Padua",
      image: "/lan/padua.webp",
      logo: "https://best.dctv.unipd.it/wp-content/uploads/2025/05/unipd_logo.png",
      address: "Via 8 Febbraio 1848, 2 35122 Padova (PD), Italy",
    },
    {
      id: 2,
      name: "University of Sapienza",
      image: "/lan/speniza.webp",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Uniroma1.svg/1280px-Uniroma1.svg.png",
      address: "Piazzale Aldo Moro, 5, 00185 Rome (RM), Italy",
    },
    {
      id: 3,
      name: "University of Bologna",
      image: "/lan/blogna.webp",
      logo: "https://www.interculturalticket.eu/sites/default/files/member-logo/2020-07/BOOK_logo_alma.4d13d572b5ab.png",
      address: "Via Zamboni, 33, 40126 Bologna (BO), Italy",
    },
    {
      id: 4,
      name: "University of Turin",
      image: "/lan/torino.webp",
      logo: "https://international.upf.pf/wp-content/uploads/2025/09/logo-universita-degli-studi-di-torino.png",
      address: "Via Giuseppe Verdi, 8, 10124 Torino (TO), Italy",
    },
    {
      id: 5,
      name: "University of Florence",
      image: "/lan/florence.webp",
      logo: "https://study-eu.s3.eu-west-1.amazonaws.com/uploads/university/university-of-florence-logo.png",
      address: "Piazza di San Marco, 4, 50121 Firenze (FI), Italy",
    },
    {
      id: 6,
      name: "University of Milan",
      image: "/lan/milano.webp",
      logo: "https://4euplus.eu/cuni_new_web/dist/images/4eu/logo_detail_milano_2x.png?v=1.1.1",
      address: "Via Festa del Perdono, 7, 20122 Milano (MI), Italy",
    },
  ];

  return (
    <div className={`min-h-screen bg-white text-[#0b2545]`}>
      <header className={`sticky top-0 z-40 bg-white transition-all duration-300 ${scrolled ? 'shadow-[0_2px_10px_rgba(11,37,69,0.08)]' : 'shadow-none py-1'}`}>
        <div className="max-w-7xl overflow-hidden mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
          <div className="items-center text-end gap-2">
            <Link href="/">
              <Image
                src="/images/newlogo3.png"
                alt="Logo"
                width={900}
                height={100}
                className={`object-contain w-28 m-auto py-1 lg:w-32 `}
                priority
              />
            </Link>
          </div>

          <a href="tel:+918302092630">
            <button
              className="inline-flex justify-center items-center gap-2 bg-[#f46c44] hover:bg-[#ea6c46] text-white font-semibold px-5 py-2.5 rounded shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.25)] transition-all"
            >
              📞 <span>+91 8302092630</span>
            </button>
          </a>
        </div>
      </header>

      {/* HERO SECTION WITH BACKGROUND IMAGE + FORM */}
      <section id="home" className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/2.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/30" />
        </div>

        <div className="relative max-w-7xl mx-auto p-2 sm:px-4 py-12 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-between">
          {/* Left Content */}
          <div className="">

            <h1 className="mt-5 text-3xl sm:text-5xl font-bold leading-tight">
              <span className="text-white">Study in <span className="text-[#F46C44]">Italy</span> <br /> for Indian Students</span>
            </h1>
            <p className="mt-3 text-base sm:text-xl text-white max-w-xl">
              Applying for Upcoming Intake in Italy
            </p>


            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-1 gap-1.5 text-white font-medium">
              {[
                "Assured Admission in Italy",
                "Get Up to 100% Scholarships",
                "100% Visa Assistance",
                "English Taught Programs Available",
                "GET 360 DEGREE SOLUTION"
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold">✓</span>
                  {b}
                </li>
              ))}
            </ul>

            {/* <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#process"
                className="border-2 border-white text-white hover:bg-[#f46c44] hover:text-white px-7 py-3 rounded-full font-semibold text-center transition-colors"
              >
                Explore Process
              </a>
            </div> */}

            <div className="mt-8 flex gap-2 sm:gap-4 text-white">
              <div className="bg-white/10 text-center backdrop-blur-md border border-white/20 rounded-2xl p-3">
                <div className="text-xl sm:text-4xl font-medium">50+</div>
                <div className="text-xs sm:text-sm mt-1">University Partners</div>
              </div>
              <div className="bg-white/10 text-center backdrop-blur-md border border-white/20 rounded-2xl p-3">
                <div className="text-xl sm:text-4xl font-medium">10k+</div>
                <div className="text-xs sm:text-sm mt-1">Careers Transformed</div>
              </div>
              <div className="bg-white/10 text-center backdrop-blur-md border border-white/20 rounded-2xl p-3">
                <div className="text-xl sm:text-4xl font-medium">70+</div>
                <div className="text-xs sm:text-sm mt-1">Italian Universities</div>
              </div>
            </div>
          </div>

          {/* Right Side - Lead Form */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md min-h-[400px] p-1.5 bg-[#f46c44]">

              <div className="relative bg-white shadow-2xl overflow-hidden">

                {/* Top Header */}
                <div className="absolute rounded-br-3xl top-0 left-0 bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/80 px-4 py-2">
                  <h3 className="text-white text-base font-medium">
                    Book Your Free Consultation
                  </h3>
                </div>

                {/* Stats */}
                <div className="mt-10 flex items-center justify-center gap-8 py-3 border-b border-gray-200 text-[#0b2545] font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📚</span>
                    <span>100 + Courses</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl">👨‍🎓</span>
                    <span>10K + Counseled</span>
                  </div>
                </div>

                {heroSubmitted ? (
                  <div className="py-10 px-6 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto">
                      ✓
                    </div>

                    <h4 className="mt-4 text-2xl font-bold text-[#0b2545]">
                      Thank You!
                    </h4>

                    <p className="text-sm text-gray-500 mt-2">
                      Our counsellor will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => handleSubmit(e, true)}
                    className="p-5 space-y-3"
                  >
                    {/* Name + Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>

                        <input
                          required
                          value={heroForm.name}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, name: e.target.value })
                          }
                          placeholder="Enter Full Name*"
                          className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                          Mobile No. <span className="text-red-500">*</span>
                        </label>

                        <input
                          required
                          type="tel"
                          value={heroForm.phone}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, phone: e.target.value })
                          }
                          placeholder="Enter Mobile No.*"
                          className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                        />
                      </div>
                    </div>

                    {/* Email + Degree */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                          Email Id <span className="text-red-500">*</span>
                        </label>

                        <input
                          required
                          type="email"
                          value={heroForm.email}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, email: e.target.value })
                          }
                          placeholder="Enter Email Id*"
                          className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                          Degree <span className="text-red-500">*</span>
                        </label>

                        <input
                          required
                          value={heroForm.course}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, course: e.target.value })
                          }
                          placeholder="Enter Degree*"
                          className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                        />
                      </div>
                    </div>

                    {/* State */}
                    <div>
                      <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                        City <span className="text-red-500">*</span>
                      </label>

                      <input
                        required
                        value={heroForm?.city}
                        onChange={(e) =>
                          setHeroForm({ ...heroForm, city: e.target.value })
                        }
                        placeholder="Enter City*"
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                      />
                    </div>

                    {/* Branch */}
                    <div>
                      <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                        State {""}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={heroForm?.state}
                        onChange={(e) =>
                          setHeroForm({ ...heroForm, state: e.target.value })
                        }
                        placeholder="Enter State*"
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                      />

                    </div>

                    {/* Checkbox */}
                    <div className="flex items-start gap-2 text-sm text-[#0b2545]">
                      <input type="checkbox" required className="mt-1" />

                      <p className="leading-5">
                        I agree to receive information from Ooshas Global.
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full bg-[#F46C44] hover:bg-[#bf341f] transition-all text-white font-bold py-2.5 rounded-md text-xl shadow-lg"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>
      {/* Top Universities Section */}
      <section className="relative py-12 to-white overflow-hidden">

        <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
          <div className="text-center max-w-5xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0b2545] leading-tight">
              Applying For{" "}
              <span className="text-[#f46c44]">
                Top Universities in Italy
              </span>
            </h2>
            <p className="mt-2 text-base text-[#0b2545]/80 font-medium sm:leading-8">
              Applying to top universities in Italy is a step towards quality
              education and a vibrant cultural experience. It usually takes
              around 3–6 months and includes course selection, eligibility
              evaluation, and admission guidance.
            </p>
          </div>

          {/* University Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university, index) => (
              <div className="duration-300 hover:scale-105 transition-all hover:-translate-y-1 cursor-pointer" key={index}>
                <div className="bg-[#efefef] p-2 max-w-[450px] mx-auto">
                  <div className="overflow-hidden">
                    <img
                      src={university.image}
                      alt={university.name}
                      className="w-full h-[220px] object-cover"
                    />
                    <div className="flex -mt-20 ml-2">
                      <div className="bg-white p-2 shadow-xl">
                        <img
                          src={university.logo}
                          alt="logo"
                          className="h-12 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 px-2">
                    <h3 className="text-xl font-medium text-black">
                      {university.name}
                    </h3>

                    <p className="text-[#444] mt-2 text-sm leading-relaxed">
                      {university.address}
                    </p>

                    {/* Bottom CTA */}
                    <div onClick={() => setPopupOpen(true)} className="flex pb-2 items-center justify-between mt-4 group cursor-pointer">
                      <span className="text-[#F46C44] text-lg font-semibold tracking-wide">
                        Enquiry Now
                      </span>

                      <span className=" right-0 text-[#F46C44] text-4xl group-hover:translate-x-2 transition-all duration-300">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
        {/* Scholarship Banner Section */}
      </section>
      <section>
        <div className="relative max-w-7xl overflow-hidden mx-auto px-2 -mt-40 sm:-mt-12 rounded-3xl">

          {/* Image */}
          <img
            src="/cta.png"
            alt=""
            className="object-cover  sm:object-right w-full h-[600px] sm:h-[420px] md:h-[500px]"
          />

          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-black/30" /> */}

          {/* Content */}
          <div className="absolute bottom-16 flex items-center">
            <div className="px-6 sm:px-10 md:px-14 z-10 w-full">
              <div className="max-w-2xl">

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-tight">
                  Grab upto{" "}
                  <span className="">
                    100% Scholarship
                  </span>
                </h2>

                {/* Description */}
                <p className="mt-4 text-sm sm:text-base text-white leading-7 sm:leading-8 max-w-xl">
                  Find the opportunities for Scholarships in Italy with our
                  comprehensive guidance to ensure your academic convenience
                </p>

                {/* Button */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={() => setPopupOpen(true)}
                    type="button"
                    className="bg-gray-800 hover:bg-[#e15d37] text-white px-6 py-3 rounded-full text-base font-medium hover:scale-105 transition-all duration-300"
                  >
                    Connect with Experts →
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
      {/* Top Demanding Courses Section */}
      <section className="relative py-12 bg-gradient-to-b from-white to-[#fff7f3] overflow-hidden">

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0b2545] leading-tight">
              Top Demanding{" "}
              <span className="text-[#f46c44]">
                Courses in Italy
              </span>
            </h2>
            <p className="mt-3 text-base text-[#0b2545]/80 font-medium leading-8">
              Explore the most in-demand courses in Italy that offer strong
              career opportunities, international exposure, and affordable
              world-class education.
            </p>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studyPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-[#f5f5f5] p-2 shadow transition-all duration-300"
              >
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center bg-white justify-center p-1 min-h-[220px]">
                    <img
                      src={program.icon}
                      alt={program.title}
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div className="p-1 col-span-2 bg-white flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-[#F46C44] mb-2">
                      {program.title}
                    </h3>
                    <ul className="space-y-1">
                      {program.subjects.map((subject, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-[#2d2d2d] text-sm font-medium leading-relaxed"
                        >
                          <span className="text-[#F46C44] text-sm leading-none mt-1">
                            ✓
                          </span>
                          <span>{subject}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button onClick={() => setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e45c36] text-white px-6 py-2.5 rounded-full text-xs sm:text-base font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_16px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
              Connect with Experts to Choose the Right Course →
            </button>
          </div>
        </div>
      </section>
      {/* Study Support Section */}
      <section className="relative py-12">

        <div className="relative max-w-7xl mx-auto px-4">

          {/* Heading */}
          <div className="text-center max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0b2545] leading-tight">
              From Admission to Visa –{" "}
              <span className="text-[#f46c44]">
                Study in Italy with Expert Support
              </span>
            </h2>
            <p className="mt-3 text-lg text-[#0b2545]/80 font-medium leading-8">
              Ooshas Global provides complete end-to-end support for your Italy study
              journey — from university selection and admission guidance to visa
              filing and post-arrival assistance.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="sm:sticky sm:top-24">

              <img
                src="/3.png"
                alt="Study in Italy Support"
                className="w-full  object-cover"
              />
            </div>
            <div>
              <div className="space-y-2">

                {[
                  {
                    title: "Profile Evaluation & Course Shortlisting",
                    desc: "Academic background and career goals are carefully reviewed to shortlist the best universities and courses in Italy.",
                    icon: "📋",
                  },
                  {
                    title: "University Application Support",
                    desc: "Complete assistance for applications, SOPs, LORs, and document submission as per university requirements.",
                    icon: "🏛️",
                  },
                  {
                    title: "Offer Letter & Admission Confirmation",
                    desc: "Expert guidance for offer acceptance, admission confirmation, and fee procedures.",
                    icon: "📄",
                  },
                  {
                    title: "Scholarship & Financial Guidance",
                    desc: "Support for scholarships, tuition fee planning, and overall education budget management.",
                    icon: "💶",
                  },
                  {
                    title: "Visa Documentation Preparation",
                    desc: "Accurate preparation and verification of all required visa documents for a smooth approval process.",
                    icon: "🛂",
                  },
                  {
                    title: "Italy Student Visa Filing",
                    desc: "Complete support for embassy appointments, visa filing, and interview preparation.",
                    icon: "✈️",
                  },
                  {
                    title: "Pre-Departure & Post-Arrival Support",
                    desc: "Accommodation, travel planning, airport pickup guidance, and settlement support in Italy.",
                    icon: "🏠",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group bg-white border p-2 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex gap-2">

                      {/* Icon */}
                      <div className="min-w-[40px] h-[40px] text-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>

                      {/* Text */}
                      <div>
                        <h3 className="text-lg font-semibold text-[#0b2545]">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-[#0b2545]/80">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-5 mt-10">
                <button onClick={() => setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-2.5 rounded-full text-base font-semibold shadow-[0_10px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_15px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
                  Connect with Experts →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-12 bg-gradient-to-b from-[#fff8f5] to-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0b2545] leading-tight">
              Why Students Choose{" "}
              <span className="relative inline-block text-[#f46c44]">
                Ooshas Global
              </span>
            </h2>

            <p className="mt-3 text-base text-[#0b2545]/80 font-medium leading-8">
              We provide complete support for students planning to study in Italy —
              from university selection and scholarships to visa approval and
              settlement assistance.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {[
              {
                icon: "/svg/res.svg",
                title: "Student Profile Analysis",
                desc: "We carefully evaluate your academic background, career goals, and interests to create a personalized Italy study plan.",
              },
              {
                icon: "/svg/classroom.svg",
                title: "Course & University Selection",
                desc: "Get expert guidance in choosing the best-fit universities and courses based on your profile and future career goals.",
              },
              {
                icon: "/svg/consultant.svg",
                title: "Admission Assistance",
                desc: "Complete support for applications, SOPs, documentation, and university admissions without confusion or delays.",
              },
              {
                icon: "/svg/tuition.svg",
                title: "Scholarship Assistance",
                desc: "We help students identify scholarship opportunities and maximize funding chances for affordable education in Italy.",
              },
              {
                icon: "/svg/mentoring.svg",
                title: "IELTS Coaching",
                desc: "Professional IELTS guidance with mock tests and personalized coaching to help you meet language requirements.",
              },
              {
                icon: "/svg/passport.svg",
                title: "Study Visa Assistance",
                desc: "End-to-end visa filing support including documentation, embassy appointments, and interview preparation.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#f5f5f5] p-2 shadow transition-all duration-300"
              >
                <div className="grid grid-cols-3 gap-2 h-full">
                  <div className="flex items-center bg-white justify-center p-1 h-full">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div className="p-3 col-span-2 bg-white flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-[#F46C44] mb-2">
                      {item.title}
                    </h3>
                    <p className="font-medium">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">

            <div className="inline-flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-5">
                <button onClick={() => setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-2.5 rounded-full text-base font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_18px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
                  Book Your FREE Counselling →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section
        id="faq"
        className="relative py-12 overflow-hidden bg-black"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/bg.jpg')",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4">

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="">
              <p className="text-white/80 font-medium text-lg">
                Answers You Need To Know
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">
                <span className="text-white">
                  Frequently Asked
                </span>{" "}
                <span className="text-[#f46c44]">
                  Questions
                </span>
              </h2>

              {/* Description */}
              <p className="mt-3 text-white/70 leading-8 font-medium max-w-xl">
                Get clear answers to all your admission-related questions for
                Italian universities. With expert guidance and complete support,
                your study journey to Italy becomes smooth and stress-free.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-5 mt-4">

                <button onClick={() => setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_18px_45px_rgba(244,108,68,0.45)] hover:scale-105 transition-all duration-300">
                  Book Appointment →
                </button>
              </div>
            </div>
            <div className="space-y-2">

              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="group border border-white/10 bg-white/5 backdrop-blur-xl rounded overflow-hidden shadow-[0_10px_35px_-15px_rgba(0,0,0,0.45)] hover:border-[#f46c44]/10 transition-all duration-300"
                >
                  {/* Question */}
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === i ? null : i)
                    }
                    className="w-full flex justify-between items-center gap-3 p-2 px-3 text-left"
                  >
                    <span className="text-white text-base font-semibold leading-8">
                      {f.q}
                    </span>

                    <div
                      className={`min-w-[30px] h-[30px] rounded flex items-center justify-center bg-[#f46c44]/10 text-[#f46c44] text-3xl font-light transition-all duration-300 ${openFaq === i
                        ? "rotate-180 bg-[#f46c44] text-white"
                        : ""
                        }`}
                    >
                      +
                    </div>
                  </button>

                  {/* Answer */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${openFaq === i
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-2 text-white/80 text-[15px] leading-8">
                        {f.a}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Footer */}
      <footer className="relative overflow-hidden ">
        <div
          className="absolute inset-0 bg-cover z bg-center"
          style={{
            backgroundImage:
              "url('https://cdn.sanity.io/images/uqxwe2qj/production/4ee9fb18bdc214aefebf7859557a6611125c3841-760x426.png?q=80&auto=format&fit=clip&w=760')",
          }}
        />

        {/* Red Overlay */}
        <div className="absolute inset-0 bg-[#F46C44]/90" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight max-w-7xl mx-auto">
            Want Guaranteed Admissions at Top Italian Universities for
            MBA, Masters & Bachelor in Upcoming Intake?
          </h2>
          <div className="mt-6 space-y-2 text-white text-base">
            <p>BOOK NOW for a FREE Counselling Session !!</p>
            <p>Register Now to Get Free Profile Evaluation</p>
            <p>Choose from 70+ Universities</p>
            <p>Hurry Up! Admission Open for Upcoming Intake.</p>
          </div>

          {/* Button */}
          <div className="mt-10">
            <button onClick={() => setPopupOpen(true)} type="button" className="bg-white hover:bg-gray-200 hover:scale-102 text-[#b91c1c] font-semibold text-xl px-6 py-3 rounded-full shadow-lg transition-all">
              Book Your Seat Now
            </button>
          </div>
        </div>
      </footer>

      {popupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/60 backdrop-blur-[1px]"
          onClick={closePopup}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-h-[95vh] overflow-y-auto scrollbar-hide max-w-lg p-1.5 bg-[#f46c44]"
          >
            <div className="relative bg-white shadow-2xl overflow-hidden">
              <button
                onClick={closePopup}
                aria-label="Close"
                className="absolute top-4 bg-gray-100 right-4 z-20 w-9 h-9 rounded-full shadow-md hover:bg-[#f46c44] hover:text-white text-[#0b2545] flex items-center justify-center transition-all"
              >
                ✕
              </button>


              <div className="absolute rounded-br-3xl top-0 left-0 bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/80 px-4 py-2">
                <h3 className="text-white text-base font-medium">
                  Book Your Free Consultation
                </h3>
              </div>

              {/* Stats */}
              <div className="flex mt-10 items-center justify-center gap-8 py-3 border-b border-gray-200 text-[#0b2545] font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <span>100 + Courses</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl">👨‍🎓</span>
                  <span>10K + Counseled</span>
                </div>
              </div>

              {/* Success State */}
              {submitted ? (
                <div className="py-12 px-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto">
                    ✓
                  </div>

                  <h4 className="mt-4 text-2xl font-bold text-[#0b2545]">
                    Thank You!
                  </h4>

                  <p className="text-sm text-gray-500 mt-2">
                    Our counsellor will contact you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => handleSubmit(e, false)}
                  className="p-5 space-y-3"
                >

                  {/* Name + Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div>
                      <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>

                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Enter Full Name*"
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                        Mobile No. <span className="text-red-500">*</span>
                      </label>

                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="Enter Mobile No.*"
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                      />
                    </div>
                  </div>

                  {/* Email + Degree */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div>
                      <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                        Email Id <span className="text-red-500">*</span>
                      </label>

                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="Enter Email Id*"
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                        Degree <span className="text-red-500">*</span>
                      </label>

                      <input
                        required
                        value={form.course}
                        onChange={(e) =>
                          setForm({ ...form, course: e.target.value })
                        }
                        placeholder="Enter Degree*"
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                      City <span className="text-red-500">*</span>
                    </label>

                    <input
                      required
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      placeholder="Enter City*"
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                      State <span className="text-red-500">*</span>
                    </label>

                    <input
                      required
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      placeholder="Enter State*"
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-start gap-2 text-sm text-[#0b2545]">
                    <input type="checkbox" required className="mt-1" />

                    <p className="leading-5">
                      I agree to receive information from Ooshas Global.
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-[#F46C44] hover:bg-[#bf341f] transition-all text-white font-bold py-3 rounded-md text-lg shadow-lg"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}