"use client";

import axiosInstance from "@/app/axiosInstance";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";


export default function MultiStepForm({ onClose }: any) {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm();

  const next = async () => {
    let valid = true;

    if (step === 1) valid = await trigger("purpose");
    if (step === 2) valid = await trigger("education");
    if (step === 3) valid = await trigger("timeline");
    

    if (valid) setStep((s) => Math.min(s + 1, 4));
  };

  const education = watch("education");
const timeline = watch("timeline");

const prevEducation = useRef();
const prevTimeline = useRef();



useEffect(() => {
  // move only when value actually changes
  if (
    step === 2 &&
    education &&
    prevEducation.current !== education
  ) {
    prevEducation.current = education;
    setTimeout(() => setStep(3), 200);
  }
}, [education, step]);

useEffect(() => {
  if (
    step === 3 &&
    timeline &&
    prevTimeline.current !== timeline
  ) {
    prevTimeline.current = timeline;
    setTimeout(() => setStep(4), 200);
  }
}, [timeline, step]);



  const back = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data)=>{
    try{
        const res = await axiosInstance.post("contactus" , {
            fullName : data.name,
            email : data.email,
            city : data.city,
            phone : data.phone,
            description : data.message || "no message",
            extraDetails: {
                purpose : data.purpose,
                education : data.education,
                timeline : data.timeline


            }
        })

        alert("Message Successfully")
        reset()
        

    }
    catch(error){
        alert("Failed to send message")
    }
  }

  const progress = (step / 4) * 100;

  useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "auto";
  };
}, []);


  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.25 }}
  className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
>
      <motion.form
  onSubmit={handleSubmit(onSubmit)}
  initial={{ opacity: 0, scale: 0.9, y: 40 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 40 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative"
>

          {/* Close Button */}
    <button
      type="button"
      onClick={onClose}
      className="absolute top-3 font-bold right-4 text-xl text-gray-800 hover:text-black cursor-pointer "
    >
      ✕ 
    </button>

        {/* Progress */}
        <p className="text-sm mb-2">Step {step} of 4</p>
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Study Abroad Consultation</h2>

            {["Study Abroad", "Global Universities", "Scholarships", "Just Exploring" , "Student Visa"].map((item) => (
              <label
                key={item}
                className="block border p-3 rounded-lg mb-3 cursor-pointer"
              >
                <input
                  type="radio"
                  value={item}
                  {...register("purpose", { required: "Select one option" })}
                  className="mr-2"
                />
                {item}
              </label>
            ))}

            {errors.purpose && (
              <p className="text-red-500 text-sm">{String(errors.purpose.message)}</p>
            )}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Education Level</h2>

            {["Class 9","Class 10", "Class 11", "Class 12", "College Student"].map((item) => (
              <label key={item} className="block border p-3 rounded-lg mb-3 cursor-pointer">
                <input
                  type="radio"
                  value={item}
                  {...register("education", { required: "Select education level" })}
                  className="mr-2"
                />
                {item}
              </label>
            ))}

            {errors.education && (
              <p className="text-red-500 text-sm">{String(errors.education.message)}</p>
            )}
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Intake Timeline</h2>

            {["Within 3 months", "3-6 months", "6-12 months", "Not decided"].map((item) => (
              <label key={item} className="block border p-3 rounded-lg mb-3 cursor-pointer">
                <input
                  type="radio"
                  value={item}
                  {...register("timeline", { required: "Select timeline" })}
                  className="mr-2"
                />
                {item}
              </label>
            ))}

            {errors.timeline && (
              <p className="text-red-500 text-sm">{String(errors.timeline.message)}</p>
            )}
          </>
        )}



        {/* STEP 5 */}
        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Contact Details</h2>

            <input
              placeholder="Full Name"
              {...register("name", { required: "Name required" })}
              className="w-full border p-3 rounded-lg mb-3"
            />
            {errors.name && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}

            <input
              placeholder="Email"
              {...register("email", { required: "Email required" })}
              className="w-full border p-3 rounded-lg mb-3"
            />

            <input
              placeholder="Phone"
              {...register("phone", { required: "Phone required" })}
              className="w-full border p-3 rounded-lg mb-3"
            />

            <input
              placeholder="City"
              {...register("city")}
              className="w-full border p-3 rounded-lg mb-3"
            />
            <input
              placeholder="Message"
              {...register("message")}
              className="w-full border p-3 rounded-lg mb-3"
            />
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className="px-4 py-2 bg-gray-200 rounded-full"
            >
              Back
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={next}
              className="ml-auto px-6 py-2 bg-orange-500 text-white rounded-full"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-6 py-2 bg-green-500 text-white rounded-full"
            >
              Submit
            </button>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
}
