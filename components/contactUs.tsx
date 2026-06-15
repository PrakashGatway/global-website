"use client"
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import Image from "next/image";
import { useForm } from "react-hook-form";
import axiosInstance from "../app/axiosInstance";
import { toast } from "react-hot-toast"
import Link from "next/link";
import FAQSection from "@/components/faqPage";
import { DynamicLucideIcon } from "./DynamicLucideIcon";
import { NewTag } from "./tag";
import { url } from "inspector";

export default function ContactUsPage({ contactData, Faqres }) {
  const heroTitle = contactData?.sections?.hero?.title || "";
  const heroSubtitle = contactData?.sections?.hero?.subtitle || "";
  const getInTouchTitle = contactData?.sections?.getInTouch?.title
  const getInTouchpoint = contactData?.sections?.getInTouch?.points || [];
  const OfficeLocation = contactData?.sections?.OfficeLocation?.points || [];
  const getInTouchSubtitle = contactData?.sections?.getInTouch?.subtitle
  const sendMessageTitle = contactData?.sections?.sendMessage?.title
  const sendMessageSubtitle = contactData?.sections?.sendMessage?.subtitle
  const sendMessagePoints = contactData?.sections?.sendMessage?.points || [];
  // console.log(getInTouchpoint)
  // Icon mapping for sendMessage points
  const pointIcons = {
    message: <MessageSquare className="h-6 w-6" style={{ color: '#FF6B35' }} />
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/contactus", {
        subject: "Contact Form",
        type: "Website",
        fullName: data.Name,
        email: data.email,
        phone: data.phone,
        destination: data.destination,
        description: "form",
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Message sent successfully ✅");
        reset();
      } else {
        toast.error("Failed to send message ❌");
      }
    } catch (error) {
      toast.error("Failed to send message ❌");
    }
  };

  return (
    <div className='bg-[#fffaf7]'>

      <section
  className="relative bg-[#f46c44] min-h-[580px] py-30 -mt-20 z-50"
  style={{
    backgroundImage: `url("/contact-hero.png")`,
    backgroundSize: "80%",
    backgroundPosition: "right center",
    backgroundRepeat: "no-repeat",
    
  }}
>
  <div className=" px-6 lg:px-35 lg:pt-14 relative">

    

     
         
       <div className="relative z-30 text-white py-16 lg:py-0">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6">
          {contactData?.title || "Contact"}
        </h1>

        <p className="text-lg lg:text-xl max-w-xl mb-8 leading-relaxed">
          {heroSubtitle}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="#contact-form">
            <button
              className="
                bg-[#1f2937]
                text-white
                px-8 py-3
                rounded-full
                font-semibold
                shadow-lg
                hover:bg-black
                transition-all
              "
            >
              Contact Now
            </button>
          </Link>

          <Link href="/login">
            <button
              className="
                bg-white
                text-[#1f2937]
                px-8 py-3
                rounded-full
                font-semibold
                shadow-lg
                hover:bg-black
                hover:text-white
                transition-all
              "
            >
              Check Your Eligibility
            </button>
          </Link>
        </div>
      </div>
     
     
     

  

      {/* Mobile Image */}
     

  
  </div>
</section>

      {/* Contact Information Section */}
      <section className="py-20 mt-5 relative z-1" style={{ isolation: 'isolate', zIndex: 0, position: 'relative' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className=" mb-12">

            <NewTag
              data={contactData?.sections?.getInTouch?.tag || 2}
              css="block text-[#ea6c46] text-2xl sm:text-3xl md:text-4xl font-semibold inline-block"
            >
              {getInTouchTitle?.split("||")[0]?.trim()}{" "}
              <span className="relative block font-bold text-primary">
                {getInTouchTitle?.split("||")[1]?.trim()}
              </span>
            </NewTag>
            <p className="text-gray-600 text-lg mt-2 max-w-3xl">
              {getInTouchSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {getInTouchpoint.map((point, idx) => (
              <motion.div
                key={idx}
                className="group relative bg-white/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Gradient Hover Border */}
                {/* <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-[#FF6B35]/20 to-orange-400/20 blur-xl"></div> */}

                {/* Icon */}
                <div className="relative z-10 flex justify-center mb-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-md group-hover:bg-[#FF6B35] group-hover:text-white transition-all duration-300">
                    <DynamicLucideIcon
                      name={`${point?.icon}`}
                      size={32}
                      className="stroke-[1.8px]"
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">
                  {point?.title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-gray-500 text-center mb-4">
                  {point?.subtitle}
                </p>

                {/* Content */}
                <div className="space-y-2 text-center">
                  {/* Phone */}
                  {point?.Number?.split("||").map((num, i) => (
                    <a
                      key={i}
                      href={`tel:${num.trim()}`}
                      className="block text-base font-medium text-[#FF6B35] hover:underline"
                    >
                      {num}
                    </a>
                  ))}

                  {/* Email */}
                  {point?.email?.split("||").map((mail, i) => (
                    <a
                      key={i}
                      href={`mailto:${mail}`}
                      className="block text-base font-medium text-[#FF6B35] hover:underline"
                    >
                      {mail}
                    </a>
                  ))}

                  {/* Location */}
                  {point?.Location && (
                    <a
                      href={`https://www.google.com/maps?q=${encodeURIComponent(
                        point.Location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-base font-medium text-[#FF6B35] hover:underline"
                    >
                      {point.Location}
                    </a>
                  )}
                  {idx == 3 && (
                    <button>
                      <Link
                        href="#contact-form"
                        rel="noopener noreferrer"
                        className="block text-base font-medium text-[#FF6B35] hover:underline"
                      >
                        Book Now
                      </Link>
                    </button>
                  )}


                  {/* Timing */}
                  {point?.timing?.split("||").map((time, i) => (
                    <p key={i} className="text-sm text-gray-600">
                      {time}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 bg-[#f9f5f2]">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                {sendMessageTitle}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {sendMessageSubtitle}
              </p>

              <div className="space-y-6">
                {sendMessagePoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-4">
                    {pointIcons[point.icon] || <MessageSquare className="h-6 w-6" style={{ color: '#FF6B35' }} />}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">{point.title}</h4>
                      <p className="text-gray-600">{point.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Name *
                  </label>
                  <input
                    {...register("Name", { required: "First name is required" })}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    maxLength={10}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number"
                      }
                    })}
                    type="tel"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Country to Study
                  </label>
                  <select
                    {...register("destination")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  >
                    <option value="">Select Destination</option>
                  {["USA", "UK", "France", "Germany", "Italy", "Dubai", "New Zealand", "Australia"].map((c) => (
                    <option key={c} value={c.toLowerCase()}>
                      Study In {c}
                    </option>
                  ))}
                  </select>
                </div>



                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms-contact"
                    {...register("terms", { required: "You must agree to the terms" })}
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="terms-contact" className="text-sm text-gray-700">
                    I agree to receive updates and promotional materials from Ooshas Global
                  </label>
                  {errors.terms && (
                    <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white px-6 py-4 rounded-lg font-bold text-lg transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                  style={{ backgroundColor: '#FF6B35', borderTopRightRadius: '25px' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section className="py-20 max-w-7xl mx-auto px-2">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-[3.6rem] font-bold mb-4" style={{ color: '#FF6B35' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Find quick answers to common questions about our services and processes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              question: "What is the best time to start my study abroad application?",
              answer: "We recommend starting your application process at least 12-18 months before your intended start date. This gives you ample time for test preparation, university selection, and visa processing."
            },
            {
              question: "Do you help with scholarship applications?",
              answer: "Yes, we provide comprehensive guidance on scholarship applications. Our team helps identify suitable scholarships, prepare applications, and write compelling essays to maximize your chances of receiving financial aid."
            },
            {
              question: "How long does the visa process take?",
              answer: "Visa processing times vary by country. Typically, student visas take 4-8 weeks to process, but we recommend starting the visa application 3-4 months before your intended travel date."
            },
            {
              question: "What if my English test scores are low?",
              answer: "We offer personalized test preparation services and can help you improve your scores. We also work with universities that offer conditional admission or pathway programs for students with lower English scores."
            },
            {
              question: "Do you provide accommodation assistance?",
              answer: "Yes, we offer comprehensive post-admission support including accommodation assistance. We help you find suitable housing options near your university campus."
            },
            {
              question: "What is your success rate for visa applications?",
              answer: "We maintain a 95% success rate for student visa applications through careful preparation, thorough documentation, and mock interview sessions with our visa experts."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Didn't find your question? Contact us directly
          </p>
          <Link href="#contact-form">
            <button
              className="text-white px-8 py-3 font-bold transition-all inline-flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: '#FF6B35', borderTopRightRadius: '25px' }}
            >
              <MessageSquare className="h-5 w-5" />
              Ask a Question
            </button>
          </Link>
        </div>
      </section> */}

      {/* Map Section */}
      {/* <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white p-1 rounded-lg shadow-lg overflow-hidden">
                <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.8454158773734!2d75.77696207543933!3d26.908400676649833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db40cd42722ff%3A0xcfc3ab392fa9adf7!2sGateway%20Abroad%20Education%20%7C%20Study%20Abroad%20Consultants%20%7C%20IELTS%20GRE%20GMAT%20SAT%20TOEFL%20PTE%20Coaching%20%7C%20Spoken%20English%20Class!5e0!3m2!1sen!2sin!4v1769668716534!5m2!1sen!2sin"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Office Locations</h3>
                <div className="space-y-4">
                  {OfficeLocation.map((point, idx) => (
                    <div key={idx}>
                      <h4 className="font-bold text-gray-700">{point.title}</h4>
                      <p className="text-gray-600">{point.subtitle}</p>
                    </div>

                  ))}

                </div>
              </div>


            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20" style={{ backgroundColor: '#FF6B35' }}>
        <div className="max-w-7xl mx-auto px-2 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white text-xl mb-10 max-w-3xl mx-auto">
            Join thousands of successful students who have achieved their study abroad
            dreams with Ooshas Global.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="#contact-form">
              <button className="bg-white text-[#FF6B35] px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-all" style={{ borderTopRightRadius: '25px' }}>
                Schedule Free Consultation
              </button>
            </Link>
            <button className="bg-transparent border-2 border-white text-white px-10 py-4 font-bold text-lg hover:bg-white hover:text-[#FF6B35] transition-all" style={{ borderTopRightRadius: '25px' }}>
              Download Brochure
            </button>
          </div>
        </div>
      </section> */}

      <CTASection />

      <FAQSection Faqres={Faqres} />
    </div>
  );
}



const CTASection = ({ data }: { data?: any }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="relative bg-[#ee6a43] overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-0">

        {/* Text */}
        <div className="text-white relative z-10">
          {/* <Tag data={data?.tag} text={data?.title} css={"text-xl sm:text-3xl md:text-4xl font-semibold leading-tight"}/> */}
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight">
            {data?.title || "Start Your Global Education Journey"}
          </h2>
          <span
            className="mt-4 text-sm sm:text-base lg:text-lg max-w-xl text-white/90"
            dangerouslySetInnerHTML={{
              __html: data?.subtitle || "Explore top universities, expert guidance, and seamless admission support with Ooshas Global.",
            }}
          />
          <div className="mt-6 sm:mt-8">
            <Link href="#contact-form">
              <button className="bg-white text-[#FF6B35] px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-all" style={{ borderTopRightRadius: '25px' }}>
                Schedule Free Consultation
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative circle — only on lg */}
        <div className="hidden lg:flex relative h-[380px] items-center justify-center">
          <img
            src="/images/circle stand.png"
            alt=""
            className="absolute z-10 w-[90px] -bottom-[2%]"

          />
          <img
            src="/images/circle.png"
            alt=""
            className="w-80 xl:w-96 animate-spin [animation-duration:60s] absolute -bottom-[10%]"
          />
        </div>
      </div>

      <img
        src="/images/country-building-img.png"
        alt=""
        className="absolute bottom-0 right-0 w-2/3 sm:w-1/2 object-contain pointer-events-none"
      />
      <div className="absolute bottom-0 left-0 w-full sm:w-1/2 h-2 sm:h-3 bg-yellow-400" />
    </section>
  )
}