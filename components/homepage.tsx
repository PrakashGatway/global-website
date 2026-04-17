"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NewTag } from "./tag";
import Image from "next/image";
import UniversitySliderClient, { CountryCardGrid } from "@/components/PageComponent/Unversity";
import AboutTabsSection from "@/components/PageComponent/TrustTabs";
import VideoTestimonialsSlider from "@/components/PageComponent/VideoTestimonial";
import ImageTestimonial from "@/components/ImageTestimonial";
import VideoInSvgShape from "@/components/PageComponent/VideoShape";

import axiosInstance, { baseUrl, serverInstance } from "@/app/axiosInstance";
import Blogs from "./blog";
import BlogGrid from "./blogGrid";
import { useKeenSlider } from "keen-slider/react";
import MultiStepForm from "./PopupForm";
import { useCallback, useEffect, useState } from "react";
import FAQSection from "./faqPage";
import { useGlobal } from "@/src/statecontext";
import { usePathname, useRouter } from "next/navigation";
import { HowGawayHelps } from "./PageComponent/DistinationSliders";
import { Destinationhome } from "./dummydestination";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DynamicLucideIcon } from "./DynamicLucideIcon";
import { ModernSelect } from "./ui/select";

import "keen-slider/keen-slider.min.css";
import StudentVisaStories from "./Studentvisa";
import UniversityCard from "./UniversityCard";
import StudyDestinations from "./homepageCom/CountryCards";

export default function Homepage({
  homePage,
  destinationData,
  countryData,
  imageData,
  Faqres,
  videoRes,
  blogres,
  unires,
}: any) {
  const [openForm, setOpenForm] = useState(false);
  const [countries, setCountries] = useState([]);
  console.log(countryData, "country data")

  function AutoSlidePlugin(slider) {
    let timeout;
    let mouseOver = false;

    function clearNextTimeout() {
      clearTimeout(timeout);
    }

    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;

      timeout = setTimeout(() => {
        slider.next();
      }, 2500);
    }

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });

      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });

      nextTimeout();
    });

    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  }

  const [sliderRefblog] = useKeenSlider(
    {
      loop: true,
      mode: "snap",
      slides: {
        perView: 1,
        spacing: 10,
      },
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 2, spacing: 15 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3, spacing: 20 },
        },
      },
    },
    [AutoSlidePlugin], // ✅ updated name here
  );

  const filtervisa = imageData.filter((item) => item.target === "visa");

  let destination = [
    (slider) => {
      let timeout;
      let mouseOver = false;

      function clearNextTimeout() {
        clearTimeout(timeout);
      }

      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 3000); // ⏱️ auto slide every 3s
      }

      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });

      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
  ];

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "snap",
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 2, spacing: 20 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3.2, spacing: 24 },
        },
      },
    },
    destination,
  );
  const [sliderRefD] = useKeenSlider(
    {
      loop: true,
      mode: "snap",
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 2, spacing: 20 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3, spacing: 0 },
        },
      },
    },
    destination,
  );

  const navigate = useRouter();

  const startYear = 2011; // 👈 apna starting year yaha daalo
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - startYear;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: `${data.fullname}`,
        email: data.email,
        phone: data.phone,
        destination: data.country,
        subject: "Study Abroad Enquiry",
        type: "website-form",
        source: "website",
        city: data.city,
        description: `State: ${data.state}, Intake: ${data.month}`,
      };

      const res = await axiosInstance.post("/contactus", payload);
      toast.success("Form submitted successfully");
      navigate.push("/thank-you");

      reset();
    } catch (error) {
      toast.error("Submit Error:", error);
    }
  };

  useEffect(() => {
    register("country");
  }, [register]);

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        "/countries?isFeatured=Yes&limit=300",
      );
      const data = response.data.data;
      let formatData = data.map((country) => ({
        label: country.name,
        value: country.code,
      }));
      setCountries(formatData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const { openPopup } = useGlobal();


  // console.log("home page",homePage)

  // const Tag = `h${homePage?.hero?.tag || 1}`; // fallback to h1 if undefined


  return (
    <main className="bg-white">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="
    relative overflow-hidden
    bg-white
    bg-no-repeat bg-cover bg-bottom
    pt-12 lg:pt-20 
  "
      >
        {/* mobile overlay only */}
        <div className="absolute inset-0 bg-white/50 md:bg-transparent pointer-events-none" />

        <div className="relative z-10 w-7xl max-w-screen mx-auto px-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-left lg:text-left"
            >
              <motion.span
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl sm:text-4xl lg:text-4xl leading-tight"
              >

                {homePage?.hero?.title ?
                  <>
                    <NewTag
                      data={homePage?.hero?.tag}
                      css="block text-[#ea6c46]"
                    >
                      {homePage?.hero?.title.split("||")[0]?.trim()}{" "}
                      <span className="relative inline-block font-bold text-primary">
                        {homePage?.hero?.title.split("||")[1]?.trim()}
                      </span>
                    </NewTag>
                  </>
                  : null}
              </motion.span>

              <span
                className="mt-6 text-base font-medium lg:text-lg text-primary mx-auto text-justify lg:mx-0 lg:mb-10"
                dangerouslySetInnerHTML={{
                  __html: homePage?.hero?.subtitle
                }}
                suppressHydrationWarning
              />

              {/* CTA BUTTONS */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <a
                  onClick={openPopup}
                  className="
              text-white px-6 sm:px-8 py-2.5 sm:py-3 bg-[#f46c44] rounded-full shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)]
              text-sm lg:text-base font-semibold
              hover:bg-primary hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)]
              flex items-center justify-center gap-2
              transition-all hover:opacity-90 cursor-pointer
            "
                  rel="noopener noreferrer"
                >
                  {homePage?.hero?.ctaText1 || "Get Free Counselling"}
                </a>

                <a
                  onClick={openPopup}
                  // href={homePage?.hero?.ctaLink2}
                  className="
              text-primary px-6 sm:px-8 py-2.5 sm:py-3 border border-primary rounded-full 
              lg:text-base text-sm font-semibold
              transition-all hover:bg-[#f46c44] hover:border-none hover:text-white hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)]
              inline-flex items-center justify-center
            "
                  rel="noopener noreferrer"
                >
                  {homePage?.hero?.ctaText2 || "Check Your Eligibility"}
                </a>
              </motion.div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative flex items-center justify-center">
                {/* Animated Circle */}
                <div className="absolute -right top-51 -translate-y-1/2  animate-spin [animation-duration:180s] hidden lg:block">
                  <img
                    src="/images/hero-bg-round.png"
                    alt="circle"
                    className="w-[540px] max-w-none"
                  />
                </div>

                {/* Hero Image */}
                {homePage?.hero?.heroImage && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="relative z-1  -bottom-10"
                  >
                    <Image
                      src={homePage?.hero?.heroImage.trim()}
                      width={450}
                      height={900}
                      alt="cap"
                      className="lg:w-[420px] w-[200px]"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="py-6 px-4 bg-white mt-3">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card */}
          {homePage?.stats?.item?.map((stat, index) => (
            <div key={index} className="group bg-[#e9e9e9] rounded-2xl px-4 py-6 flex items-center gap-3 hover:bg-[#F46C44] 
            transition duration-300">
              <DynamicLucideIcon
                name={stat?.icon}
                className="w-12 h-12 text-[#8B4513] stroke-[1.2px] group-hover:text-white transition"
              />
              <div>
                <p className="text-gray-600 text-sm sm:text-lg group-hover:text-white transition">
                  {stat?.title}
                </p>
                <h3 className="text-[#123b73] font-bold text-sm sm:text-lg group-hover:text-white transition">
                  {stat?.stats}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F46C44] overflow-hidden relative">
        <div className="px-4 max-w-[1440px] mx-auto sm:px-8 lg:px-20 flex flex-col lg:flex-row gap-10 lg:gap-2 justify-around items-center">
          {/* LEFT IMAGE (Hidden on Mobile) */}
          <motion.div className="relative z-10 -bottom-0 lg:-bottom-8 -left-24 hidden lg:block">
            <img
              src="/images/home-enquiry.png"
              alt={homePage?.formSection?.title || "Enquiry Image"}
              className="w-[320px] lg:w-175"
            />
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className=" p-6 sm:p-8 lg:p- rounded-2xl w-full lg:w-auto "
          >
            <NewTag
              data={homePage?.formSection?.teg}
              css="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-white"
            >
              {homePage?.formSection?.title.split("||")[0]?.trim()}{" "}
              <span className="relative inline-block mt-3 font-bold text-white">
                {homePage?.formSection?.title.split("||")[1]?.trim()}
              </span>
            </NewTag>

            {/* <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-white">
              <span>{homePage?.formSection?.title}</span>
            </h2> */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 lg:w-180"
            >
              {/* Full Name */}
              <motion.div>
                <label className="text-sm lg:text-sm font-medium text-white mb-1 block">
                  Full Name
                </label>

                <input
                  {...register("fullname", {
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  type="text"
                  className="w-full focus:outline-none border-2 border-white rounded-lg p-2 lg:px-4 lg:py-2.5 text-sm lg:text-sm text-white"
                />

                {errors.fullname && (
                  <p className="text-red-200 text-sm sm:text-sm mt-1">
                    {errors.fullname.message}
                  </p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div>
                <label className="text-sm lg:text-sm font-medium text-white mb-1 block">
                  Email ID
                </label>

                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(com|in|org|net|edu|gov|co|io)$/i,
                      message:
                        "Enter a valid email with proper domain (e.g. .com, .in)",
                    },
                  })}
                  type="email"
                  className="w-full focus:outline-none border-2 border-white rounded-lg p-2 lg:px-4 lg:py-2.5 text-sm lg:text-sm text-white"
                />

                {errors.email && (
                  <p className="text-red-200 text-sm sm:text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              {/* Phone */}
              <motion.div>
                <label className="text-sm lg:text-sm font-medium text-white mb-1 block">
                  Mobile Number
                </label>

                <input
                  {...register("phone", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid 10 digit number",
                    },
                  })}
                  type="tel"
                  maxLength={10}
                  inputMode="numeric"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  className="w-full focus:outline-none border-2 border-white rounded-lg p-2 lg:px-4 lg:py-2.5 text-sm lg:text-sm text-white"
                />

                {errors.phone && (
                  <p className="text-red-200 text-sm sm:text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </motion.div>

              {/* Country */}
              <motion.div>
                <label className="text-sm lg:text-sm font-medium text-white mb-1 block">
                  Country to Study
                </label>

                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border border-white rounded-lg px-3 py-2 text-sm lg:text-sm bg-transparent text-white focus:outline-none"
                    >
                      <option value="" className="text-black">
                        Country to Study
                      </option>
                      <option value="usa" className="text-black">
                        Study In USA
                      </option>
                      <option value="uk" className="text-black">
                        Study In UK
                      </option>
                      <option value="france" className="text-black">
                        Study In France
                      </option>
                      <option value="germany" className="text-black">
                        Study In Germany
                      </option>
                      <option value="italy" className="text-black">
                        Study In Italy
                      </option>
                      <option value="dubai" className="text-black">
                        Study In Dubai
                      </option>
                    </select>
                  )}
                />
              </motion.div>

              {/* Program */}
              <motion.div>
                <label className="text-sm lg:text-sm font-medium text-white mb-1 block">
                  State
                </label>

                <input
                  {...register("state")}
                  type="text"
                  className="w-full border-2 border-white rounded-lg p-2 lg:px-4 lg:py-2.5 text-sm lg:text-sm focus:outline-none text-white"
                />
              </motion.div>

              {/* City */}
              <motion.div>
                <label className="text-sm lg:text-sm font-medium text-white mb-1 block">
                  City
                </label>

                <input
                  {...register("city")}
                  type="text"
                  className="w-full border-2 border-white rounded-lg p-2 lg:px-4 lg:py-2.5 text-sm lg:text-sm focus:outline-none text-white"
                />
              </motion.div>

              {/* Submit */}
              <motion.div className="md:col-span-2 mt-4 flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-auto text-sm lg:text-lg bg-secondary hover:bg-primary text-white font-semibold p-2 lg:px-4 lg:py-2.5 rounded-lg"
                >
                  Submit
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </section>

      <Destinationhome homePage={homePage} />

      {/* <motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="bg-[#F46C44] py-10 relative overflow-hidden"
>
  <div className=" px-6">
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-8 lg:mb-16 max-w-7xl mx-auto"
    >
      <h3 className="text-white text-xl relative inline-block mt-4 mb-2">
        <span className="font-light lg:text-4xl">
          {homePage?.whyUs?.title.split("||")[0]}
        </span>
        <br />
        <span className="font-bold lg:text-5xl">
          {homePage?.whyUs?.title.split("||")[1]}
           <span className="absolute right-0 -bottom-1.5  w-25 h-[2px] lg:h-1 bg-yellow-400"></span>
        </span>

       
      </h3>

      <p className=" text-gray-100">{homePage?.whyUs.subTitle}</p>
    </motion.div>

   

    <div className="space-y-8 lg:space-y-12">

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

  {[0,1,2,3,4].map((index,i)=>(
    
    <motion.div
      key={index}
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: i * 0.15 }}
      viewport={{ once: true }}

      className={`bg-white rounded-3xl py-6 px-2 flex items-center gap-5 shadow-sm
      ${index === 3 ? "md:col-start-1 md:col-span-1 md:col-start-1 md:translate-x-1/2" : ""}
      ${index === 4 ? "md:col-start-3 md:-translate-x-1/2" : ""}
      `}
    >

      {index === 0 && <NutOffIcon className="w-50 h-35 text-primary stroke-1" />}
      {index === 1 && <BadgeIcon className="w-50 h-35 text-primary stroke-1" />}
      {index === 2 && <TargetIcon className="w-50 h-35 text-primary stroke-1" />}
      {index === 3 && <PanelsTopLeftIcon className="w-50 h-35 text-primary stroke-1" />}
      {index === 4 && <PanelsTopLeftIcon className="w-50 h-35 text-primary stroke-1" />}

      <div>
        <h4 className="text-lg font-semibold text-black">
          {homePage?.whyUs?.items?.[index]?.title}
        </h4>
        <p className="text-[#1f3a5f] mt-2 text-sm">
          {homePage?.whyUs?.items?.[index]?.description}
        </p>
      </div>

    </motion.div>

  ))}

</div>




</div>
  </div>
</motion.section> */}

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white relative overflow-hidden w-full py-12 sm:py-10 "
      >
        <div className="absolute -right-20 top-[0%] opacity-30 pointer-events-none hidden lg:block"></div>

        <div className="max-w-7xl mx-auto">
          <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-2 items-center w-full min-h-[500px]">
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative w-full h-full min-h-[420px] sm:min-h-[500px] lg:min-h-[550px] flex justify-center lg:justify-start hidden lg:block"
              >
                <img
                  src="/images/trust-img.png"
                  alt=""
                  className="w-[450px] h-[540px]"
                />

                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="
              absolute -left-8 sm:left-25 bottom-25
              w-24 h-24 sm:w-28 sm:h-28 lg:w-28 lg:h-28
              rounded-full bg-white
              border-[3px] border-orange-600
              shadow-2xl z-40
              flex flex-col items-center justify-center
            "
                >
                  <span className="text-3xl sm:text-4xl font-bold text-red-700">
                    {experienceYears}
                  </span>

                  <span className="text-[10px] sm:text-sm text-gray-500 text-center font-semibold leading-tight">
                    Years of
                    <br />
                    Experience
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ x: 80, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="text-left lg:text-left"
              >
                <motion.span
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg sm:text-3xl lg:text-4xl font-bold leading-tight mb-3"
                >

                  <NewTag
                    data={homePage?.trustedPartners?.tag}
                    css="block text-[#ea6c46]"
                  >
                    {homePage?.trustedPartners?.title.split("||")[0]?.trim()}{" "}
                    <span className="relative inline-block mt-3 font-bold text-primary">
                      {homePage?.trustedPartners?.title.split("||")[1]?.trim()}
                    </span>
                  </NewTag>

                </motion.span>

                <motion.span
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-sm font-medium sm:text-base text-gray-600 mb-6 leading-relaxed mx-auto lg:mx-0"
                  dangerouslySetInnerHTML={{
                    __html: homePage?.trustedPartners?.subtitle
                  }}
                />

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <AboutTabsSection
                    tabs={homePage?.trustedPartners?.items || []}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="lg:py-5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden ">
          <div className="mb-12">
            <h2 className="text-xl mb-2">
              <span className="text-[#F46C44] lg:text-4xl font-light">
                {homePage?.topUniversities?.title?.split("||")[0]?.trim()}
              </span>{" "}
              <br />
              <span className="text-primary font-bold relative lg:text-5xl">
                {homePage?.topUniversities?.title?.split("||")[1]?.trim()}
                <span className="absolute right-0 bottom-0  w-25 h-[2px] lg:h-1 bg-[#F46C44]"></span>
              </span>
            </h2>
            <div
              className="text-gray-800 text-sm lg:text-base font-medium max-w-3xl leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: homePage?.topUniversities?.subtitle || "",
              }}
            ></div>
          </div>

          <div ref={sliderRefD} className="keen-slider items-start">
            {destinationData.map((item) => (
              <div key={item._id} className="keen-slider__slide p-4">
                <Link href={`/universities/group/${item.slug}`}>
                  <div className="border border-gray-300 bg-white overflow-hidden hover:shadow-lg transition duration-300">
                    {/* Image */}
                    <img
                      src={
                        item.cardImage ||
                        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop"
                      }
                      className="w-full h-[160px] sm:h-[180px] md:h-[200px] object-cover"
                    />

                    {/* Content */}
                    <div className="p-6 text-center">
                      <h3 className="lg:text-xl text-base  font-bold text-[#1c3f73] mb-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 text-sm lg:text-sm line-clamp-1">
                        {item.subTitle ||
                          "Explore top universities for your study abroad journey."}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <UniversitySliderClient universities={homePage.universities} />

      <section className="max-w-7xl mx-auto  py-5 px-4 lg:px-4">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-primary">
            <span className="text-[#F46C44] font-light block text-xl lg:text-4xl">
              {homePage.studyDestinations.title.split("||")[0]}
            </span>
            <span className="font-bold text-xl lg:text-5xl relative">
              {" "}
              {homePage.studyDestinations.title.split("||")[1]}
              <span className="absolute right-0 -bottom-1 w-25 h-[2px] lg:h-1 bg-[#F46C44]"></span>
            </span>
          </h2>
        </div>

        <CountryCardGrid countries={countryData} />
        {/* Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-4  justify-center">
          <div className="flex flex-col gap-4">
            <Link href={"/destination/study-in-usa"}>
              <div className="h-40 sm:h-40 lg:h-42 w-full lg:w-92  rounded-2xl overflow-hidden relative">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq9YEcbNP0_0y_IsCGgsJpR0TiUPSzmOrqOQ&s"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 "></div>
                <p className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                  <span className="bg-gray-800/90 lg:px-8 px-4 font-bold text-sm lg:text-base py-2 rounded-lg">
                    United States
                  </span>
                </p>
              </div>
            </Link>

            <div className="flex gap-4">
              <Link href={"/destination/study-in-germany"}>
                <div className="w-full lg:w-44 h-40 sm:h-52 rounded-2xl overflow-hidden relative ">
                  <img
                    src="https://t3.ftcdn.net/jpg/08/46/08/14/360_F_846081410_Bpyzy1kMxtWtN27vDttJyfDbb6kyBjUX.jpg"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 "></div>
                  <p className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                    <span className="bg-gray-800/90 lg:px-8 px-4 font-bold text-sm lg:text-base py-2 rounded-lg">
                      Germany
                    </span>
                  </p>
                </div>
              </Link>

              <Link href={"/destination/study-in-uk"}>
                <div className="w-full lg:w-44 h-40 sm:h-52 rounded-2xl overflow-hidden relative ">
                  <img
                    src="https://media.istockphoto.com/id/616242056/photo/british-flag-big-ben-and-houses-of-parliament-london.jpg?s=612x612&w=0&k=20&c=3c5ZpafAsXAevRDs0dlTwn8wuErDjlYVqw1Cj0oRwMc="
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0"></div>
                  <p className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                    <span className="bg-gray-800/90 lg:px-8 px-4 font-bold text-sm lg:text-base py-2 rounded-lg">
                      UK
                    </span>
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full lg:w-92 h-24 lg:h-25 rounded-2xl overflow-hidden relative ">
              <img
                src="https://img.freepik.com/premium-photo/ferry-boat-docked-along-vancouver-canada_67340-61.jpg?semt=ais_rp_50_assets&w=740&q=80"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 "></div>
              <p className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                <span className="bg-gray-800/90 lg:px-8 px-4 font-bold text-sm lg:text-base py-2 rounded-lg">
                  Canada
                </span>
              </p>
            </div>

            <div className="w-full lg:w-92 h-40 lg:h-40 rounded-2xl overflow-hidden relative ">
              <img
                src="https://www.thoughtco.com/thmb/4F27YhigMVRDW6iLBig5RfkJ8sA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-695249926-0975932adac24c079cbb252e1aa8f122.jpg"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 "></div>
              <p className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                <span className="bg-gray-800/90 lg:px-8 px-4 font-bold text-sm lg:text-base py-2 rounded-lg">
                  France
                </span>
              </p>
            </div>

            <div className="w-full lg:w-92 h-24 lg:h-25 rounded-2xl overflow-hidden relative ">
              <img
                src="https://i.redd.it/ireland-flag-redesign-v0-7ygkbozb9ijb1.jpg?width=2340&format=pjpg&auto=webp&s=2b74022723fa3e516424b050e55bc845a9f00c56"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 "></div>
              <p className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                <span className="bg-gray-800/90 lg:px-8 px-4 font-bold text-sm lg:text-base py-2 rounded-lg">
                  Ireland
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="w-full lg:w-44 h-40 sm:h-52 rounded-2xl overflow-hidden relative ">
                <img
                  src="https://image.made-in-china.com/2f0j00wauBvDflsgpr/Country-National-Flag-of-Australia-3X5FT-Digital-Printing-100d-Polyester-Australian-Flag.webp"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 "></div>
                <p className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                  <span className="bg-gray-800/90 lg:px-8 px-4 font-bold text-sm lg:text-base py-2 rounded-lg">
                    Australia
                  </span>
                </p>
              </div>

              <div className="w-full lg:w-44 h-40 sm:h-52 rounded-2xl overflow-hidden relative ">
                <img
                  src="https://images.unsplash.com/photo-1603798994946-5ea9dbacf20e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWklMjBmbGFnfGVufDB8fDB8fHww"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 "></div>
                <p className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                  <span className="bg-gray-800/90 lg:px-8 px-4 font-bold text-sm lg:text-base py-2 rounded-lg">
                    Dubai
                  </span>
                </p>
              </div>
            </div>

            <div className="h-40 lg:h-42 w-full lg:w-92  rounded-2xl overflow-hidden relative">
              <img
                src="https://t4.ftcdn.net/jpg/19/10/05/75/360_F_1910057533_eg7g1trT07bvBHccH9DTOEwY7kXnG95Y.jpg"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 "></div>
              <p className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                <span className="bg-gray-800/90 lg:px-8 px-4 font-bold text-sm lg:text-base py-2 rounded-lg">
                  Italy
                </span>
              </p>
            </div>
          </div>
        </div> */}
      </section>

      <section className="w-full py-6 lg:py-16 px-1 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl p-4 md:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 relative">
              {/* Left Panel */}
              <div
                className="bg-[#F46C44] overflow-hidden rounded-2xl p-4 md:p-8 flex flex-col justify-center 
        lg:min-w-[280px] lg:max-w-[320px] 
        h-auto lg:h-[380px] 
        z-10 lg:mt-24"
              >
                <h2 className="  text-white text-primary">
                  <span className=" font-light block text-xl lg:text-4xl">
                    {homePage?.servicesection?.title.split("||")[0]}
                  </span>
                  <span className="font-bold text-xl lg:text-2xl relative">
                    {" "}
                    {homePage?.servicesection?.title.split("||")[1]}
                    <span className="absolute hidden sm:block sm:right-0 -bottom-2 w-25 h-[2px] lg:h-1 bg-yellow-500"></span>
                  </span>
                </h2>
              </div>

              {/* Border Box (Desktop only) */}
              <div className="hidden lg:block absolute h-[83%] w-[90%] border-2 shadow border-[#F46C44] left-40 -bottom-10 rounded-4xl z-0"></div>

              {/* Services Grid */}
              <div className="flex-1 lg:pl-6 bg-white relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 bg-white">
                  {homePage?.servicesection?.services?.map((service) => (
                    <div
                      key={service.title}
                      className="group rounded-2xl bg-gray-100 p-4 md:p-6 hover:shadow-lg transition-all duration-300 text-center"
                    >
                      {/* Icon */}
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-3 md:mb-4 mx-auto">
                        <img src={service.icon || "https://cdn-icons-png.flaticon.com/512/5474/5474438.png"} alt="" />
                      </div>

                      {/* Title */}
                      <h3 className="text-base md:text-lg font-bold text-primary mb-1 md:mb-2">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <span
                        className="text-sm md:text-sm text-muted-foreground leading-relaxed line-clamp-4 md:line-clamp-5"
                        dangerouslySetInnerHTML={{
                          __html: service.subTitle || "",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#F46C44] py-10 ">
        <h2 className=" max-w-7xl mx-auto  text-primary text-white mb-10 px-4 lg:px-0">
          <span className=" font-light block text-xl lg:text-4xl">
            {homePage?.topUniversity?.title.split("||")[0]}
          </span>
          <span className="font-bold text-xl lg:text-5xl relative">
            {" "}
            {homePage?.topUniversity?.title.split("||")[1]}
            <span className="absolute right-0 -bottom-1 w-25 h-[2px] lg:h-1 bg-yellow-500"></span>
          </span>
        </h2>
        <UniversityCard university={unires} />
      </div>

      <section className="py-12 sm:py-2 lg:py-10 px-2 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className=" text-xl   mb-6 ">
            <span className="text-[#F46C44] lg:text-4xl font-light">
              {homePage?.blogs?.title.split("||")[0]}
            </span>{" "}
            <br />
            <span className="text-primary font-bold relative lg:text-4xl">
              {homePage?.blogs?.title.split("||")[1]}

              <span className="absolute right-0 bottom-0  w-full lg:w-25 h-[2px] lg:h-1 bg-[#F46C44]"></span>
            </span>
          </h2>

          {/* 🔥 SLIDER (replaces grid) */}
          <div ref={sliderRefblog} className="keen-slider relative z-[10]">
            {blogres.length > 0 ? (
              blogres.map((post) => (
                <div key={post._id} className="keen-slider__slide p-2">
                  {/* 🔴 SAME CARD UI */}
                  <div
                    className="
                  relative bg-white border border-[#FF6B35]
                  rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                  transition-all duration-300 hover:shadow-xl
                "
                  >
                    {/* ORANGE SHAPE */}
                    <div
                      className="
                    absolute -top-2 -left-[6.5px]
                    w-28 h-28 sm:w-36 sm:h-36 lg:w-35 lg:h-35
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-[20px] lg:rounded-tl-[70px]
                    bg-[#FF6B35] -z-10
                  "
                    />

                    {/* IMAGE */}
                    <div
                      className="
                    relative overflow-hidden bg-gray-300
                    h-[200px] sm:h-[220px] lg:h-[220px]
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[65px]
                  "
                    >
                      <img
                        src={
                          post.coverImage ||
                          "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
                        }
                        alt={post.title}
                        className="w-full h-[220px] object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg";
                        }}
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-3 text-center">
                      <p className="text-gray-800 text-sm sm:text-base font-medium mb-3 line-clamp-2">
                        {post.shortDescription}
                      </p>

                      <button
                        onClick={() => goToBlog(post.slug)}
                        className="
                        text-white px-6 lg:w-50 py-2 mx-auto
                        bg-[#1f2937]
                        rounded-tr-4xl
                        shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)]
                        text-sm sm:text-sm font-semibold
                        hover:bg-[#FF6B35]
                        hover:shadow-[-6px_6px_5px_0px_rgba(0,0,0,0.60)]
                        flex items-center justify-center gap-2
                        transition-all
                      "
                      >
                        Read More »
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-lg w-full">
                No blogs found
              </p>
            )}
          </div>
        </div>
      </section>

      {/* <ImageTestimonial
        title={homePage?.imageTestimonials?.title}

        subtitle={homePage?.imageTestimonials?.subtitle}
        items={imageData}
      /> */}

      <VideoTestimonialsSlider
        title={homePage?.videoTestimonials?.title || "Video || Testimonials"}
        subtitle={homePage?.videoTestimonials?.subtitle}
        items={videoRes}
        tag={homePage?.videoTestimonials?.tag}
      // Auto-play is enabled by default
      />

      <StudentVisaStories
        stories={filtervisa}
        title={homePage?.visa?.title}
        subtitle={homePage?.visa?.subtitle}
        tag={homePage?.visa?.tag}
      />

      <FAQSection Faqres={Faqres} />
      <AnimatePresence>
        {openForm && <MultiStepForm onClose={() => setOpenForm(false)} />}
      </AnimatePresence>
    </main>
  );
}
