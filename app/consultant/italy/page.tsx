"use client";
import axiosInstance from "@/app/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { array } from "zod";

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
        type: "website-form",
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
        }, 800);
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
        }, 800);
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

  return (
    <div className="min-h-screen bg-white text-[#0b2545]">
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
              className="inline-flex items-center gap-2 bg-[#f46c44] hover:bg-[#ea6c46] text-white font-semibold px-5 py-2.5 rounded shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.25)] transition-all"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-[#00306A]/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>

            <h1 className="mt-5 text-3xl sm:text-[2.7rem] font-semibold leading-tight">
              <span className="text-white">Study in Italy for Indian Students</span>
            </h1>
            <p className="mt-5 text-base sm:text-xl text-white max-w-xl">
              Applying for Upcoming Intake in Italy
            </p>


            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-1 gap-3 text-white font-medium">
              {[
                "Assured Admission in Italy",
                "Get Up to 100% Scholarships",
                "100% Visa Assistance",
                "English Taught Programs Available",
                "GET 360 DEGREE SOLUTION"
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#f46c44] text-white text-xs flex items-center justify-center font-bold">✓</span>
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

            <div className="mt-8 flex flex-wrap gap-6 text-white">
              <div>
                <div className="text-4xl font-medium ">50+</div>
                <div className="text-sm mt-1">University Partners</div>
              </div>
              <div className="h-12 w-px bg-[#0b2545]/10" />
              <div>
                <div className="text-4xl font-medium">10k+</div>
                <div className="text-sm mt-1">Careers Transformed</div>
              </div>
              <div className="h-12 w-px bg-[#0b2545]/10" />
              <div>
                <div className="text-4xl font-medium">70+</div>
                <div className="text-sm mt-1">Italian Universities</div>
              </div>
            </div>
          </div>

          {/* Right Side - Lead Form */}
          <div className="relative w-full max-w-md min-h-[400px] ml-auto">
            {/* Background Glow */}
            <div className="absolute -inset-3 bg-[#ff6b3d]/20 blur-2xl rounded-xl" />

            {/* Form Card */}
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">

              {/* Top Header */}
              <div className="bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/80 px-5 py-3 relative">
                <h3 className="text-white text-xl font-medium text-center uppercase tracking-wide">
                  Book Your Free Consultation
                </h3>

                {/* Plane Icon */}
                {/* <div className="absolute right-2 top-2 text-5xl opacity-90">
                  ✈️
                </div> */}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 py-3 border-b border-gray-200 text-[#0b2545] font-semibold text-sm">
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
      </section>
      {/* Top Universities Section */}
      <section className="relative py-12 to-white overflow-hidden">

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0b2545] leading-tight">
              Applying For{" "}
              <span className="text-[#f46c44]">
                Top Universities in Italy
              </span>
            </h2>
            <p className="mt-3 text-lg text-[#0b2545]/80 font-medium leading-8">
              Applying to top universities in Italy is a step towards quality
              education and a vibrant cultural experience. It usually takes
              around 3–6 months and includes course selection, eligibility
              evaluation, and admission guidance.
            </p>
          </div>

          {/* University Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((university, index) => (
              <div className="group relative overflow-hidden bg-white shadow-[0_15px_50px_-15px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_60px_-10px_rgba(244,108,68,0.45)] transition-all duration-500">

                {/* Image */}
                <div className="relative overflow-hidden h-[430px]">
                  <img
                    src="/padua.webp"
                    alt="University of Padua"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Logo */}
                  <div className="absolute top-2 left-2 bg-white p-2 rounded-sm shadow-lg">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR90DIAFyV7wcoEgx6FFqOPX82aAWa7vMWAwA&s" alt="" className="h-10" />
                  </div>

                  {/* Bottom Content */}
                  <div onClick={()=>setPopupOpen(true)} className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          University of Padua
                        </h3>
                      </div>

                      <div className="w-12 h-12 flex font-medium items-center justify-center text-white text-xl shadow-lg group-hover:translate-x-1 transition-all">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
        {/* Scholarship Banner Section */}
      </section>
      <section className=" ">
        <div className="max-w-7xl mx-auto py-2 px-4 overflow-hidden">
          <div className="relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://districtoffices.net/wp-content/uploads/2019/10/DO_Blog-Image_Meeting-1024x535-1-2000x1044.jpg')",
              }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />

            {/* Content */}
            <div className="relative z-10 w-full px-6 sm:px-12 py-12">
              <div className="max-w-2xl">

                {/* Heading */}
                <h2 className="text-4xl font-medium text-white leading-tight">
                  Grab upto{" "}
                  <span className="">
                    100% Scholarship
                  </span>
                </h2>

                {/* Description */}
                <p className="mt-2 text-base text-white leading-8 max-w-xl">
                  Find the opportunities for Scholarships in Italy with our comprehensive guidance to ensure your academic convenience
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <button onClick={()=>setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-4 py-3 rounded-md text-base font-medium hover:scale-105 transition-all duration-300">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((c) => (
              <div className="group relative bg-white rounded border border-[#f7d8cc] p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_-15px_rgba(244,108,68,0.35)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                <div className="relative z-10">

                  <h3 className="text-3xl font-medium text-black mb-6">
                    Engineering
                  </h3>

                  <ul className="space-y-2 text-[#0b2545]/80">
                    <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#f46c44] text-white text-xs flex items-center justify-center font-bold">✓</span>
                      Mechanical Engineering
                    </li>
                    <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#f46c44] text-white text-xs flex items-center justify-center font-bold">✓</span>
                      Aerospace Engineering
                    </li>
                    <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#f46c44] text-white text-xs flex items-center justify-center font-bold">✓</span>
                      Civil Engineering
                    </li>
                    <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#f46c44] text-white text-xs flex items-center justify-center font-bold">✓</span>
                      Environmental Engineering
                    </li>
                    <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#f46c44] text-white text-xs flex items-center justify-center font-bold">✓</span>
                      Automation & Robotics
                    </li>
                  </ul>
                </div>
              </div>))}

          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button onClick={()=>setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e45c36] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_16px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
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
                src="https://districtoffices.net/wp-content/uploads/2019/10/DO_Blog-Image_Meeting-1024x535-1-2000x1044.jpg"
                alt="Study in Italy Support"
                className="w-full h-[450px] object-cover"
              />
            </div>
            <div>
              <div className="space-y-3">

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
                    className="group bg-white border border-[#f7d8cc] rounded-3xl p-4 shadow-[0_10px_35px_-15px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_50px_-15px_rgba(244,108,68,0.25)] hover:-translate-y-1 transition-all duration-300"
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

                        <p className="mt-1 font-medium text-[#0b2545]/70 leading-7">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-5 mt-10">
                <button onClick={()=>setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-[0_10px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_15px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
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
                icon: "📝",
                title: "Student Profile Analysis",
                desc: "We carefully evaluate your academic background, career goals, and interests to create a personalized Italy study plan.",
              },
              {
                icon: "🏛️",
                title: "Course & University Selection",
                desc: "Get expert guidance in choosing the best-fit universities and courses based on your profile and future career goals.",
              },
              {
                icon: "📄",
                title: "Admission Assistance",
                desc: "Complete support for applications, SOPs, documentation, and university admissions without confusion or delays.",
              },
              {
                icon: "💶",
                title: "Scholarship Assistance",
                desc: "We help students identify scholarship opportunities and maximize funding chances for affordable education in Italy.",
              },
              {
                icon: "🎯",
                title: "IELTS Coaching",
                desc: "Professional IELTS guidance with mock tests and personalized coaching to help you meet language requirements.",
              },
              {
                icon: "🛂",
                title: "Study Visa Assistance",
                desc: "End-to-end visa filing support including documentation, embassy appointments, and interview preparation.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded border border-[#f7d8cc] p-6 overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.12)] hover:shadow-[0_25px_60px_-15px_rgba(244,108,68,0.35)] hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative z-10">
                  <div>
                    <img className="h-10 mb-3" src="https://cdn-icons-png.flaticon.com/512/3090/3090011.png" alt="" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-black leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-[#0b2545]/75 font-medium leading-6 text-[15px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">

            <div className="inline-flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-5">
                <button onClick={()=>setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_18px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
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
              "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwnbYK2MCt3tMOIx19cy8xYGjSuzZBpoWQzQ&s')",
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

                <button onClick={()=>setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_18px_45px_rgba(244,108,68,0.45)] hover:scale-105 transition-all duration-300">
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

          {/* Text */}
          <div className="mt-6 space-y-2 text-white text-base">
            <p>BOOK NOW for a FREE Counselling Session !!</p>
            <p>Register Now to Get Free Profile Evaluation</p>
            <p>Choose from 70+ Universities</p>
            <p>Hurry Up! Admission Open for Upcoming Intake.</p>
          </div>

          {/* Button */}
          <div className="mt-10">
            <button onClick={()=>setPopupOpen(true)} type="button" className="bg-white hover:bg-gray-200 hover:scale-102 text-[#b91c1c] font-semibold text-xl px-6 py-3 rounded-full shadow-lg transition-all">
              Book Your Seat Now
            </button>
          </div>
        </div>
      </footer>

      {/* POPUP */}
      {popupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px]"
          onClick={closePopup}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg"
          >

            {/* Form Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

              {/* Close Button */}
              <button
                onClick={closePopup}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white shadow-md hover:bg-[#f46c44] hover:text-white text-[#0b2545] flex items-center justify-center transition-all"
              >
                ✕
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/80 px-5 py-4">
                <h3 className="text-white text-xl font-semibold text-center uppercase tracking-wide">
                  Book Your Free Consultation
                </h3>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 py-3 border-b border-gray-200 text-[#0b2545] font-semibold text-sm">
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