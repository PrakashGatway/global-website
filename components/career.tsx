"use client";

import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  Linkedin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/app/axiosInstance";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

export default function CareerPage({ careerData }) {
  // Extract data from the response
  const heroTitle = careerData?.sections?.hero?.title;
  const pageDescription = careerData?.description;
  const cultureTitle = careerData?.sections?.culture?.title;
  const cultureSubtitle = careerData?.sections?.culture?.subtitle;
  const workingTitle = careerData?.sections?.workingWith?.title;
  const workingSubtitle = careerData?.sections?.workingWith?.subtitle;
  const vacanciesTitle = careerData?.sections?.Vacancies?.title;
  const vacancies = careerData?.sections?.Vacancies?.Vacancies;

  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const [resumeUrl, setResumeUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axiosInstance.post("/upload/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setValue("resumeUrl", res.data.url);

      // ✅ save uploaded file URL
      setResumeUrl(res.data.url);

      // ✅ IMPORTANT — register uploaded resume as valid
      setValue("resumeUrl", res.data.url);

      toast.success("Resume uploaded successfully ✅");
    } catch (err) {
      setResumeUrl(null);
      toast.error("Resume upload failed / File must be < 1MB");
    } finally {
      setUploading(false);
    }
  };

  // Helper function to split titles with "||"
  const splitTitle = (title) => {
    if (!title) return { first: "", second: "" };
    const parts = title.split("||");
    return {
      first: parts[0]?.trim() || "",
      second: parts[1]?.trim() || "",
    };
  };

  const cultureTitleParts = splitTitle(cultureTitle);
  const workingTitleParts = splitTitle(workingTitle);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const resumeFile = watch("resume");

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("contactus", {
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        description: "Career Application",
        extraDetails: {
          interviewTime: data.interviewTime,
          resume: data.resumeUrl,
          position: data.type,
        },
      });
      reset();
      toast.success("Application submitted! We will contact you soon.");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedVacancy) {
      setValue("type", selectedVacancy.title);
    }
  }, [selectedVacancy, setValue]);

  return (
    <main className="bg-[#fffaf6] overflow-hidden">
      <section className="bg-[#f46c44] py-10 lg:py-32 lg:text-center px-4 lg:px-0 text-white relative overflow-hidden">
        {/* Decorative Arrow on Left Side */}

        <h1 className="text-2xl md:text-6xl font-bold">{heroTitle}</h1>
        <p className="mt-4 max-w-5xl mx-auto text-base md:text-lg font-medium">
          {pageDescription}
        </p>
      </section>

      <section className="max-w-7xl mx-auto py-4 lg:py-20 grid md:grid-cols-2 gap-14 items-center relative">
        <Image
          src="https://t4.ftcdn.net/jpg/00/35/30/85/360_F_35308534_WGRVXlymcjQqoRXzeWEfVCOfBHBq9YdW.jpg"
          width={750}
          height={480}
          loading="lazy"
          className="rounded-tr-[100px] object-cover px-2 hidden lg:block"
          alt=""
        />

        <div>
          <h2 className="lg:text-[50px] text-2xl font-semibold text-orange-500 px-4">
            {cultureTitleParts.first}{" "}
            <span className="text-gray-700">{cultureTitleParts.second}</span>
          </h2>

          <p className="mt-4 text-base lg:text-lg text-gray-700 leading-relaxed px-4">
            {cultureSubtitle}
          </p>
        </div>
      </section>

      {/* ================= SECTION 2 ================= */}
      <section className="max-w-7xl mx-auto px-4 lg:py-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <h2 className="lg:text-[50px] text-2xl font-semibold text-orange-500">
            {workingTitleParts.first}{" "}
            <span className="text-gray-700">{workingTitleParts.second}</span>
          </h2>

          <p className="mt-4 text-base lg:text-lg text-gray-700 leading-relaxed">
            {workingSubtitle}
          </p>
        </div>

        <Image
          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?cs=srgb&dl=pexels-fauxels-3184291.jpg&fm=jpg"
          width={850}
          height={380}
          className="rounded-tl-[100px] object-cover"
          alt=""
          loading="lazy"
        />
      </section>

      {/* ================= VACANCIES ================= */}
      <section className="lg:py-20 py-10 lg:text-center relative overflow-hidden">
        <h2 className="lg:text-3xl text-xl font-semibold text-gray-700 mb-12 px-4 lg:px-0">
          {vacanciesTitle}
        </h2>

        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {vacancies && vacancies.length > 0 ? (
            vacancies.map((vacancy, index) => {
              // Split description into bullet points
              const descriptionLines = vacancy.description
                .split("||")
                .map((line) => line.trim())
                .filter(Boolean);

              return (
                <div
                  key={index}
                  className="bg-[#f46c44] text-white rounded-tr-[100px] pb-25 pt-10 shadow-[0_3px_5px_rgba(0,0,0,0.45)] relative"
                >
                  {/* TITLE */}
                  <h3 className="lg:text-3xl text-lg font-semibold mb-4 px-4">
                    {vacancy.title}
                  </h3>

                  {/* DESCRIPTION LIST */}
                  <div className="px-6">
                    <ul className="list-disc list-inside space-y-2 text-sm lg:text-lg opacity-90 text-left line-clamp-3">
                      {descriptionLines.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>

                  {/* APPLY BUTTON */}
                  <button
                    onClick={() => setSelectedVacancy(vacancy)}
                    className="mt-10 bg-white text-orange-500 py-2 absolute font-medium w-full left-0 bottom-0 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 py-12">
              <p className="text-gray-600 text-lg">
                No current openings available. Please check back later!
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedVacancy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3 sm:px-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="
          bg-white w-full max-w-2xl
          max-h-[90vh] overflow-y-auto
          rounded-lg shadow-xl relative
          p-4 sm:p-6
        "
            >
              {/* CLOSE */}
              <button
                onClick={() => setSelectedVacancy(null)}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-500 hover:text-black text-lg sm:text-xl"
              >
                ✕
              </button>

              {/* TITLE */}
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#f46c44] mb-3 sm:mb-4 pr-6">
                {selectedVacancy.title}
              </h3>

              {/* DESCRIPTION */}
              <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base mb-4 sm:mb-6">
                {selectedVacancy.description.split("||").map((line, i) => (
                  <li key={i}>{line.trim()}</li>
                ))}
              </ul>

              {/* ACTION */}
              <button
                onClick={() => {
                  setSelectedVacancy(null);
                  document
                    .querySelector("#application-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="
            w-full sm:w-auto
            bg-[#f46c44] text-white
            px-5 sm:px-6 py-2.5
            text-sm sm:text-base
            rounded
            hover:opacity-90
            transition active:scale-95
          "
              >
                Proceed to Apply
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FORM ================= */}
      <section id="application-form" className="py-20 relative overflow-hidden">
        {/* BACKGROUND */}
        <div className="max-w-7xl mx-auto bg-[#fff3ec] py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* HEADING */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-orange-500 leading-tight">
              Boost Your Career!
              <span className="text-gray-700 block lg:inline">
                {" "}
                Find the Perfect Role with Ooshas Global
              </span>
            </h2>

            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white mt-8 sm:mt-10 p-5 sm:p-6 md:p-8 shadow-lg flex flex-col gap-2 text-left"
            >
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters",
                  },
                })}
                className="border-0 border-b-2 border-gray-300 p-2 focus:border-orange-500 outline-none
focus:outline-none
focus:ring-0"
                placeholder="Name*"
              />

              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}

              <input
                {...register("phone", {
                  required: "Mobile number required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter valid 10 digit number",
                  },
                })}
                placeholder="Mobile Number*"
                className="border-b-2 border-gray-300 p-2 focus:border-orange-500 outline-none
focus:outline-none
focus:ring-0"
              />

              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}

              <input
                {...register("email", {
                  required: "Email required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email Address*"
                className="border-b-2 border-gray-300 p-2 focus:border-orange-500 outline-none
focus:outline-none
focus:ring-0"
              />

              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}

              <input
                {...register("city", {
                  required: "City required",
                })}
                placeholder="State, City"
                className="border-b-2 border-gray-300 p-2 focus:border-orange-500 outline-none
focus:outline-none
focus:ring-0"
              />

              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city.message}</p>
              )}

              <select
                {...register("interviewTime", {
                  required: "Please select interview time",
                })}
                className="border-b-2 border-gray-300 p-2"
              >
                <option value="">Select Time for Interview</option>
                <option>Morning (9 AM - 12 PM)</option>
                <option>Afternoon (12 PM - 4 PM)</option>
                <option>Evening (4 PM - 7 PM)</option>
              </select>

              {errors.interviewTime && (
                <p className="text-red-500 text-xs">
                  {errors.interviewTime.message}
                </p>
              )}

              <input type="hidden" {...register("type")} />

              <input
                type="hidden"
                value={resumeUrl || ""}
                {...register("resumeUrl", {
                  required: "Resume required",
                })}
              />

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  {/* ICON */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4a2 2 0 012-2h6l4 4v10a2 2 0 01-2 2H7z"
                    />
                  </svg>
                  Upload Resume*
                </label>

                <label className="flex items-center justify-between border-b-2 border-gray-300 py-3 cursor-pointer hover:border-orange-500 transition">
                  <span className="text-sm text-gray-600 truncate max-w-[70%]">
                    {resumeFile?.[0]?.name || "Choose your resume (PDF/DOC)"}
                  </span>

                  <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-md">
                    Browse
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>

                {/* ✅ ERROR HERE */}
                {errors.resumeUrl && (
                  <p className="text-red-500 text-xs">
                    {errors.resumeUrl.message}
                  </p>
                )}

                {/* SUCCESS TEXT */}
                <span className="text-sm text-gray-600 truncate">
                  {uploading
                    ? "Uploading..."
                    : resumeUrl
                      ? "✅ Resume uploaded"
                      : "file must be less than 1MB"}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-gray-500">
                <input type="checkbox" className="mr-2" />I agree to receive
                updates and offers from Ooshas Global.
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="bg-orange-500 text-white py-3 font-semibold w-full sm:w-40 mx-auto hover:bg-orange-600 transition-colors cursor-pointer"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Join Our Exclusive Study Abroad Network */}
      <section className="py-10 bg-[#FF6B35] relative overflow-visible">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Join Our Exclusive Study Abroad Network
            </h2>
            <p className="text-white text-lg mb-8 opacity-90">
              Get updates on what&apos;s happening around in the study abroad
              space, important notifications on events and journeys of other
              students
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <input
                type="email"
                placeholder="Email"
                className="w-full sm:w-[500px] px-6 py-3 rounded-none outline-none text-gray-800 bg-white border border-gray-300"
              />
              <button className="bg-white text-[#FF6B35] w-full sm:w-[200px] px-6 py-3 rounded-none font-bold hover:bg-gray-100 transition-all whitespace-nowrap">
                I AM IN
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="Telegram"
              >
                <Send size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
