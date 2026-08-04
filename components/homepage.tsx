"use client";

import Link from "next/link";
import { NewTag } from "./tag";
import Image from "next/image";
// import UniversitySliderClient, { CountryCardGrid } from "@/components/PageComponent/Unversity";
// import AboutTabsSection from "@/components/PageComponent/TrustTabs";

import axiosInstance from "@/app/axiosInstance";
import { useKeenSlider } from "keen-slider/react";
// import MultiStepForm from "./PopupForm";
import { startTransition, useCallback, useEffect, useState } from "react";
// import FAQSection from "./faqPage";
import { useGlobal } from "@/src/statecontext";
import { usePathname, useRouter } from "next/navigation";
import { Destinationhome } from "./dummydestination";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DynamicLucideIcon } from "./DynamicLucideIcon";
// import UniversityCard from "./UniversityCard";

import dynamic from "next/dynamic";
import { CountryCardGrid } from "@/components/PageComponent/Unversity";
import VisaDetails from "./dashboard/VisaDetails/visaDetails";
import { SingleSlider } from "./SingleSlider";

const UniversitySliderClient = dynamic(
  () => import("@/components/PageComponent/Unversity").then(
    mod => mod.default
  ),
  {
    loading: () => <p>Loading...</p>,
  }
);

const AboutTabsSection = dynamic(
  () => import("@/components/PageComponent/TrustTabs"),
  {
    loading: () => <p>Loading...</p>,
  }
);

const FAQSection = dynamic(
  () => import("./faqPage"),
  {
    loading: () => <p>Loading...</p>,
  }
);

const MultiStepForm = dynamic(
  () => import("./PopupForm"),
  {
    loading: () => <p>Loading...</p>,
  }
);

const UniversityCard = dynamic(
  () => import("./UniversityCard"),
  {
    loading: () => <p>Loading...</p>,
  }
);

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
  const router = useRouter()

  const getDrivePreviewUrl = (url) => {
    const match = url?.match(/\/d\/([^/]+)/);
    return match
      ? `https://drive.google.com/file/d/${match[1]}/preview`
      : url;
  };

  const goToBlog = (slug) => {
    router.push(`/blog/${slug}`);
  };

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

  const visaCards = [
    {
      id: 1,
      name: "Abhiram Vovvaldas",
      country: "France",
      visa: "France Study Visa",
      flag: "https://flagcdn.com/w80/fr.png",
      image: "/visa1.webp",
    },
    {
      id: 2,
      name: "Venkatapathi Atluri",
      country: "Germany",
      visa: "Germany Study Visa",
      flag: "https://flagcdn.com/w80/de.png",
      image: "/visa2.webp",
    },
    {
      id: 3,
      name: "Gauri Sinha",
      country: "Dubai",
      visa: "Dubai Study Visa",
      flag: "https://flagcdn.com/w80/ae.png",
      image: "/visa3.webp",
    },
    {
      id: 4,
      name: "Krishna Bhatia",
      country: "Ireland",
      visa: "Ireland Study Visa",
      flag: "https://flagcdn.com/w80/ie.png",
      image: "/visa4.webp",
    },
  ];

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

  const [visacontent, setVisaContent] = useState([]);

  const fetchVisa = () => {
    const filtervisa = imageData.filter((item) => item.target === "visa");
    setVisaContent(filtervisa);
  }

  useEffect(() => {
    fetchVisa();
  }, [imageData])


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
          slides: { perView: 3, spacing: 10 },
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

  const { openPopup } = useGlobal();


  // //console.log("home page",homePage)

  // const Tag = `h${homePage?.hero?.tag || 1}`; // fallback to h1 if undefined
  const statImages = [
    "/student-hero.png",
    "/school-hero.png",
    "/acceptance-hero.png",
    "/experience-hero.png",
    "/offer-hero.png",
  ];

  return (
    <main className="bg-white">
      <section
        className="overflow-hidden
          pt-12 lg:pt-20 "
        style={{
          backgroundImage: `url(${"/bg-hero.jpeg"})`,
          backgroundSize: "100% 100%",


        }}
      >

        <div className="absolute inset-0 bg-white/50 md:bg-transparent pointer-events-none" />

        <div className="relative z-10 w-7xl max-w-screen mx-auto px-6 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-7 items-center gap-2">

            <div
              className="flex flex-col gap-1 lg:col-span-4 -mt-10"
            >
              <span
                className="text-3xl sm:text-4xl leading-[48px]"
              >

                {homePage?.hero?.title ?
                  <>
                    <NewTag
                      data={homePage?.hero?.tag}
                      css="block text-primary font-bold"
                    >
                      {homePage?.hero?.title.split("||")[0]?.trim()}{" "}
                      <span className="relative  font-bold text-[#ea6c46]">
                        {homePage?.hero?.title.split("||")[1]?.trim()}
                      </span>
                    </NewTag>
                  </>
                  : null}
              </span>

              <span
                className="mt-2 text-base font-medium lg:text-base leading-[26px]  text-black mx-auto "
                dangerouslySetInnerHTML={{
                  __html: homePage?.hero?.subtitle
                }}
                suppressHydrationWarning
              />

              <div
                className="flex mt-4 flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={openPopup}
                  className="
              text-white px-6 sm:px-8 py-2.5 sm:py-3 bg-[#f46c44] rounded-full 
              text-sm lg:text-base font-semibold
              hover:bg-white hover:text-black 
              hover:border hover:border-orange-500
              flex items-center justify-center gap-2
               
            "
                // rel="noopener noreferrer"
                >
                  {homePage?.hero?.ctaText1 || "Get Free Counselling"}
                </button>

                <button
                  onClick={openPopup}
                  // href={homePage?.hero?.ctaLink2}
                  className="
              text-white bg-primary px-6 sm:px-6 py-2.5 sm:py-2 border border-primary rounded-full 
              lg:text-base text-sm font-semibold
               hover:bg-white hover:border hover:border-primary hover:text-primary
              inline-flex items-center justify-center
            "
                // rel="noopener noreferrer"
                >
                  {homePage?.hero?.ctaText2 || "Check Your Eligibility"}
                </button>
              </div>
            </div>


            <div
              className="flex justify-center lg:col-span-3 lg:justify-end"
            >
              <div className=" flex items-center justify-center">

                <div className="absolute  top-41 right-18 -translate-y-1/2  animate-spin [animation-duration:180s] hidden lg:block">
                  <Image
                    src="/images/hero-bg-round.webp"
                    alt="circle"
                    width={400}
                    height={540}
                    priority
                    className="scale-120"

                  />
                </div>


                {homePage?.hero?.heroImage && (
                  <div
                    className="relative z-1 lg:right-22  lg:bottom-0"
                  >
                    <Image
                      src={homePage?.hero?.heroImage.trim()}
                      width={400}
                      height={900}
                      alt="cap"
                      loading="lazy"
                      className="lg:w-[320px] w-[300px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" bg-white shadow-xl -mt-2 relative z-10 overflow-hidden ">
        <div className="max-w-7xl mx-auto grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card */}
          {homePage?.stats?.items?.map((stat, index) => (
            <div key={index} className="  rounded-2xl px-4 py-6  flex items-center gap-3 
            ">
              <Image
                src={statImages[index % statImages.length]}
                alt={stat.title}
                width={48}
                height={48}
                className={` ${index === 3 ? "w-16 h-16" : "w-12 h-12"}`}
              />
              <div>
                <p className="text-black text-sm sm:text-lg font-bold group-hover:text-white transition">
                  {stat?.stats}
                </p>
                <h3 className="text-gray-600 font-medium text-sm sm:text-sm group-hover:text-white transition">
                  {stat?.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F46C44] overflow-hidden relative">
        <div className="px-4 max-w-[1440px] mx-auto sm:px-8 lg:px-20 flex flex-col lg:flex-row gap-10 lg:gap-2 justify-around items-center">
          {/* LEFT IMAGE (Hidden on Mobile) */}
          <div className="relative z-10 -bottom-0 lg:-bottom-8 -left-24 hidden lg:block">
            <Image
              src="/images/home-enquiry.webp"
              alt="Connect With Our Expert Team"
              width={383}
              height={400}
              sizes="(max-width: 768px) 100vw, 383px"
            />
          </div>

          {/* RIGHT FORM */}
          <div
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
              <div>
                <label htmlFor="fullname" className="text-sm lg:text-sm font-medium text-white mb-1 block">
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
                  id="fullname"
                  name="fullname"
                  type="text"
                  className="w-full focus:outline-none border-2 border-white rounded-lg p-2 lg:px-4 lg:py-2.5 text-sm lg:text-sm text-white"
                />

                {errors.fullname && (
                  <p className="text-red-200 text-sm sm:text-sm mt-1">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="text-sm lg:text-sm font-medium text-white mb-1 block">
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
                  id="email"
                  name="email"
                  type="email"
                  className="w-full focus:outline-none border-2 border-white rounded-lg p-2 lg:px-4 lg:py-2.5 text-sm lg:text-sm text-white"
                />

                {errors.email && (
                  <p className="text-red-200 text-sm sm:text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="text-sm lg:text-sm font-medium text-white mb-1 block">
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
                  id="phone"
                  name="phone"
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
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="text-sm lg:text-sm font-medium text-white mb-1 block">
                  Country to Study
                </label>

                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="country"
                      name="country"
                      className="w-full border border-white rounded-lg px-3 py-2 text-sm lg:text-sm bg-transparent text-white focus:outline-none"
                    >
                      <option value="" className="text-black">
                        Country to Study
                      </option>
                      {["USA", "UK", "France", "Germany", "Italy", "Dubai", "New Zealand", "Australia"].map((c) => (
                        <option className="text-black" key={c} value={c.toLowerCase()}>
                          Study In {c}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              {/* Program */}
              <div>
                <label htmlFor="state" className="text-sm lg:text-sm font-medium text-white mb-1 block">
                  State
                </label>

                <input
                  {...register("state")}
                  type="text"
                  id="state"
                  name="state"
                  className="w-full border-2 border-white rounded-lg p-2 lg:px-4 lg:py-2.5 text-sm lg:text-sm focus:outline-none text-white"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="text-sm lg:text-sm font-medium text-white mb-1 block">
                  City
                </label>

                <input
                  {...register("city")}
                  type="text"
                  id="city"
                  name="city"
                  className="w-full border-2 border-white rounded-lg p-2 lg:px-4 lg:py-2.5 text-sm lg:text-sm focus:outline-none text-white"
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2 mt-4 flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-auto text-sm lg:text-lg bg-secondary hover:bg-primary text-white font-semibold p-2 lg:px-4 lg:py-2.5 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Destinationhome homePage={homePage} />

      {/* <section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="bg-[#F46C44] py-10 relative overflow-hidden"
>
  <div className=" px-6">
    <div
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
    </div>

   

    <div className="space-y-8 lg:space-y-12">

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

  {[0,1,2,3,4].map((index,i)=>(
    
    <div
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

    </div>

  ))}

</div>




</div>
  </div>
</section> */}

      <section
        className="bg-white relative overflow-hidden w-full py-6 sm:py-5 "
      >
        <div className="absolute -right-20 top-[0%] opacity-30 pointer-events-none hidden lg:block"></div>

        <div className="max-w-7xl mx-auto">
          <div className="w-full px-4 sm:px-6 lg:px-0 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-2 items-center w-full min-h-[500px]">
              <div

                className="relative w-full h-full min-h-[420px] sm:min-h-[500px] lg:min-h-[550px] flex justify-center lg:justify-start hidden lg:block"
              >
                <Image
                  src="/images/trust-img.webp"
                  alt="trust section image"
                  width={450}
                  height={540}
                  loading="lazy"
                  className="w-[450px] h-[540px]"
                />

                <div
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
                </div>
              </div>

              <div
                className="text-left lg:text-left"
              >
                <span
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight lg:mb-3"
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

                </span>

                <span
                  className="text-base  font-medium sm:text-base text-gray-600 mb-6 leading-relaxed mx-auto lg:mx-0 "
                  dangerouslySetInnerHTML={{
                    __html: homePage?.trustedPartners?.subtitle
                  }}
                />

                <div
                >
                  <AboutTabsSection
                    tabs={homePage?.trustedPartners?.items || []}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:py-14 px-4 lg:px-0 overflow-hidden bg-[#faf5f2]">
        <div className="max-w-7xl mx-auto overflow-hidden ">
          <div className="py-4 lg:py-4  text-left">
            <h2 className="text-xl ">
              <span className="text-[#F46C44] lg:text-4xl font-light">
                {homePage?.topUniversities?.title?.split("||")[0]?.trim()}
              </span>{" "}

              <br />  <span className="text-primary font-bold relative text-2xl lg:text-4xl">
                {homePage?.topUniversities?.title?.split("||")[1]?.trim()}
              </span>
            </h2>
            {homePage?.topUniversities?.subtitle && <div
              className="text-gray-800 text-sm lg:text-base font-medium max-w-3xl leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: homePage?.topUniversities?.subtitle || "",
              }}
            ></div>}
          </div>

          <div ref={sliderRefD} className="keen-slider items-start ">
            {destinationData.map((item) => (
              <div key={item._id} className="keen-slider__slide ">
                <Link href={`/universities/group/${item.slug}`}>
                  <div className="border border-gray-300 bg-white overflow-hidden hover:shadow-lg transition duration-300 ">
                    {/* Image */}
                    <Image
                      src={
                        item.cardImage ||
                        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop"
                      }
                      alt={item.title}
                      width={400}
                      height={300}
                      loading="lazy"
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

    <div className="lg:my-14"> <SingleSlider/></div>

      <section className="bg-[#faf5f2] py-5 lg:py-5 px-4 lg:px-0 ">
        {/* Heading */}
        <div className="text-left  max-w-7xl mx-auto py-4">
          <h2 className="text-primary">
            <span className="text-[#F46C44] font-light  text-2xl lg:text-4xl">
              {homePage.studyDestinations.title.split("||")[0]}
            </span>
            <br />  <span className="font-bold text-xl lg:text-4xl relative">
              {" "}
              {homePage.studyDestinations.title.split("||")[1]}
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

      <section className="w-full py-12 lg:py-5 px-4 md:px-0 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-left lg:py-4">
            <h2 className="text-primary">
              <span className="font-light  text-2xl lg:text-4xl mb-2 text-[#F46C44]">
                {homePage?.serviceSection?.title.split("||")[0]}
              </span>
              <br /> <span className="font-bold text-2xl lg:text-4xl">
                {homePage?.serviceSection?.title.split("||")[1]}
              </span>
            </h2>
          </div>

          {/* Steps Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-4 py-4">
            {homePage?.serviceSection?.services?.map((service) => (
              <div
                key={service.title}
                className="group relative overflow-hidden bg-white border border-gray-200 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[#F46C44] hover:shadow-[0_20px_45px_rgba(244,108,68,0.12)]"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-orange-50 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* Icon */}


                {/* Heading */}
                <div className="flex gap-2 items-center">
                  <div className="relative mb-6 flex h-full w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF4EF] to-[#FFE8DF] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 p-2">
                    <img
                      src={
                        service.icon ||
                        "https://cdn-icons-png.flaticon.com/512/5474/5474438.png"
                      }
                      alt={service.title}
                      className="h-9 w-9 object-contain"
                    />
                  </div>
                  <div className="relative mb-4">
                    <h3 className="text-xl font-bold leading-snug text-[#1F2937] transition-colors duration-300 group-hover:text-[#F46C44]">
                      {service.title}
                    </h3>
                  </div>
                </div>


                {/* Description */}
                <div
                  className="relative text-[15px] leading-7 text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: service.subTitle || "",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-5 ">
        <div className="bg-[#F46C44]">
          <h2 className=" max-w-7xl mx-auto  text-primary text-white py-4 lg:py-5 px-4 lg:px-0">
            <span className=" font-light block text-2xl lg:text-4xl">
              {homePage?.topUniversity?.title.split("||")[0]}
            </span>
            <span className="font-bold text-2xl lg:text-5xl relative">
              {" "}
              {homePage?.topUniversity?.title.split("||")[1]}
            </span>
          </h2>
          <UniversityCard university={unires} />
        </div>
      </div>

      <section className="py-5 px-2 lg:px-0 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          <h2 className=" text-2xl   py-5 ">
            <span className="text-[#F46C44] lg:text-4xl font-light">
              {homePage?.blogs?.title.split("||")[0]}
            </span>{" "}
            <br />
            <span className="text-primary font-bold relative lg:text-4xl">
              {homePage?.blogs?.title.split("||")[1]}

            </span>
          </h2>

          {/* 🔥 SLIDER (replaces grid) */}
          <div ref={sliderRefblog} className="keen-slider relative z-[10]">
            {blogres.length > 0 ? (
              blogres.map((post) => (
                <div key={post._id} className="keen-slider__slide">
                  {/* 🔴 SAME CARD UI */}
                  <div
                    className="
                  relative bg-white border border-[#FF6B35]
                  rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                  transition-all duration-300 hover:shadow-xl
                "
                  >
                    <div
                      className="
                    absolute -top-1 -left-[3px] shadow-xl
                    w-28 h-28 sm:w-36 sm:h-36 lg:w-35 lg:h-35
                    bg-[#FF6B35] -z-10
                  "
                    />

                    {/* IMAGE */}
                    <div
                      className="" >
                      <img
                        src={
                          post.coverImage ||
                          "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
                        }
                        width="1000"
                        height="1000"
                        alt={post.title}
                        className="w-full h-[210px] object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
                        }}
                      />



                    </div>

                    {/* CONTENT */}
                    <div className="p-4 pt-2 text-start">

                      <h3 onClick={() => goToBlog(post.slug)} className="text-gray-900 hover:text-[#FF6B35] cursor-pointer text-lg font-medium mb-1 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium mb-2 line-clamp-2">
                        {post.shortDescription}
                      </p>
                      <button
                        onClick={() => goToBlog(post.slug)}
                        className="font-medium text-sm text-blue-900 hover:translate-x-2 cursor-pointer border p-1.5 px-3 transition-all duration-300"
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

      {/* <VideoTestimonialsSlider
        title={homePage?.videoTestimonials?.title || "Video || Testimonials"}
        subtitle={homePage?.videoTestimonials?.subtitle}
        items={videoRes}
        tag={homePage?.videoTestimonials?.tag}
   
      /> */}

      {/* <section className="bg-white py-12 px-4 md:px-2">
  <div className="max-w-7xl mx-auto bg-[#f46c44] px-2  p-6 md:p-12">

    <div className="mb-4">
       <h2 className=" text-xl   mb-2 ">
            <span className="text-white lg:text-4xl font-light">
              {homePage?.videoTestimonials?.title.split("||")[0]}
            </span>{" "}
            <br />
            <span className="text-primary font-bold relative lg:text-4xl">
              {homePage?.videoTestimonials?.title.split("||")[1]}

            </span>
          </h2>

      <p className="text-white text-sm md:text-base " dangerouslySetInnerHTML={{
        __html : homePage?.videoTestimonials?.subtitle
      }}>
        
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
  {videoRes?.map((item) => {

    return (
      <div
        key={item?._id}
        className="relative overflow-hidden group h-[400px]"
      >
       {playingVideo === item?._id ? (
 <div className="relative w-full h-full">
  {videoLoading && (
    <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
  )}

  <iframe
    src={item?.videoUrl}
    className="w-full h-full border-0"
    allow="autoplay; fullscreen"
    allowFullScreen
    onLoad={() => setVideoLoading(false)}
  />
</div>
) : (
  <>
    <img
      src={item?.image}
      alt={item?.name}
      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

    <div className="absolute bottom-6 left-6 z-10">
      <button
        onClick={() => {
          setPlayingVideo(item?._id);
          setVideoLoading(true);
        }}
        className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center mb-4 text-white backdrop-blur-sm"
      >
        ▶
      </button>

      <h3 className="text-white text-lg font-semibold">
        {item?.name}
      </h3>

      <p className="text-white/70 text-sm">
        {item?.designation}
        {item?.university && `, ${item?.university}`}
      </p>
    </div>
  </>
)}
      </div>
    );
  })}
</div>


  </div>
</section> */}

      {/* <StudentVisaStories
        stories={visacontent}
        title={homePage?.visa?.title}
        subtitle={homePage?.visa?.subtitle}
        tag={homePage?.visa?.tag}
      />  */}

      <section className="">
        <VisaDetails />

      </section>

      <FAQSection Faqres={Faqres} />
      {openForm && <MultiStepForm onClose={() => setOpenForm(false)} />}
    </main>
  );
}
