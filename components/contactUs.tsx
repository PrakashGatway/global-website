"use client"
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import Image from "next/image";
import { useForm } from "react-hook-form";
import axiosInstance from "../app/axiosInstance";
import {toast} from "react-hot-toast"
import Link from "next/link";
import FAQSection from "@/components/faqPage";

export default function ContactUsPage({ contactData ,Faqres }) {
  // Extract data from the response
  const heroTitle = contactData?.sections?.hero?.title || "";
  const heroSubtitle = contactData?.sections?.hero?.subtitle || "";
  const getInTouchTitle = contactData?.sections?.getInTouch?.title 
  const getInTouchSubtitle = contactData?.sections?.getInTouch?.subtitle 
  const sendMessageTitle = contactData?.sections?.sendMessage?.title 
  const sendMessageSubtitle = contactData?.sections?.sendMessage?.subtitle 
  const sendMessagePoints = contactData?.sections?.sendMessage?.points || [];

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
     
      <section className="relative flex items-center" style={{ backgroundColor: '#f46c44', borderTop: 'none', boxShadow: 'none', isolation: 'isolate', zIndex: 1 }}>
     
        <div className="w-full mx-auto grid lg:grid-cols-2 gap-12 items-center sm:pl-30">
          <div className="text-white space-y-6 p-6 sm:pt-0 pt-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight">
              {contactData?.title || "Contact Us"}
            </h1>
            <p className="text-lg max-w-2xl font-medium text-white">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="#contact-form">
                <button
                  className="
                    text-white px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1f2937]
                    rounded-tr-4xl shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)] text-base font-semibold
                    hover:bg-black hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)] 
                    flex items-center justify-center gap-2
                    transition-all hover:opacity-90
                  "
                >
                  Contact Now
                </button>
              </Link>

              <Link href="/login">
                <button
                  className="
                    text-black/80 px-6 sm:px-8 py-2.5 sm:py-3 bg-white
                    rounded-tr-4xl shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)] text-base  font-semibold
                    transition-all hover:bg-black hover:text-white hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)] 
                  "
                >
                  Check Your Eligibility
                </button>
              </Link>
            </div>
          </div>
          <div className="h-full w-full">
            <div className='relative flex items-center justify-center h-[106%] w-full rounded-bl-[55%] overflow-hidden mr-10'>
              <img className='h-full w-full object-cover' src="https://buffer.com/resources/content/images/2025/03/social-media-image-sizes.png" alt="" />
              <div className='absolute bottom-0 right-0 h-[5.7%] w-full bg-[#f46c44] z-11'>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 mt-35 relative" style={{ isolation: 'isolate', zIndex: 0, position: 'relative' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-[3.6rem] font-bold mb-2" style={{ color: '#FF6B35' }}>
              {getInTouchTitle.split("||")[0]}
            </h2>
            <h2 className="text-4xl lg:text-[3.6rem] font-bold" style={{ color: '#FF6B35' }}>
              {getInTouchTitle.split("||")[1]}
            </h2>
            <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
              {getInTouchSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Contact Card 1 */}
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#FF6B35] w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Phone Support</h3>
              <p className="text-gray-600 text-center mb-4">Call us for immediate assistance</p>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-center" style={{ color: '#FF6B35' }}>+1 (555) 123-4567</p>
                <p className="text-lg font-semibold text-center" style={{ color: '#FF6B35' }}>+1 (555) 987-6543</p>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">Mon-Sat: 9 AM - 8 PM</p>
            </motion.div>

            {/* Contact Card 2 */}
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#FF6B35] w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Email Support</h3>
              <p className="text-gray-600 text-center mb-4">Send us your queries</p>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-center" style={{ color: '#FF6B35' }}>info@ooshasglobal.com</p>
                <p className="text-lg font-semibold text-center" style={{ color: '#FF6B35' }}>support@ooshasglobal.com</p>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">Response within 24 hours</p>
            </motion.div>

            {/* Contact Card 3 */}
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#FF6B35] w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Visit Our Office</h3>
              <p className="text-gray-600 text-center mb-4">Meet us in person</p>
              <p className="text-center text-gray-700">
                123 Education Street,<br />
                New York, NY 10001<br />
                United States
              </p>
              <p className="text-sm text-gray-500 text-center mt-4">By appointment only</p>
            </motion.div>

            {/* Contact Card 4 */}
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#FF6B35] w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Working Hours</h3>
              <p className="text-gray-600 text-center mb-4">We're here for you</p>
              <div className="space-y-1 text-center">
                <p className="text-gray-700">Monday - Friday: 9 AM - 7 PM</p>
                <p className="text-gray-700">Saturday: 10 AM - 5 PM</p>
                <p className="text-gray-700">Sunday: 11 AM - 4 PM</p>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">Emergency support available</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 bg-[#f9f5f2]">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
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
                    <option value="usa">Study in USA</option>
                    <option value="uk">Study in UK</option>
                    <option value="canada">Study in France</option>
                    <option value="australia">Study in Italy</option>
                    <option value="germany">Study in Germany</option>
                    <option value="france">Study in Dubai</option>
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
      <section className="py-20 max-w-7xl mx-auto px-2">
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
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-100">
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
                  <div>
                    <h4 className="font-bold text-gray-700">Head Office</h4>
                    <p className="text-gray-600">123 Education Street, New York, NY 10001</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700">Branch Office</h4>
                    <p className="text-gray-600">456 Learning Avenue, San Francisco, CA 94107</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700">International Office</h4>
                    <p className="text-gray-600">789 Knowledge Road, London, UK EC1V 2NX</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Emergency Contact</h3>
                <p className="text-gray-600 mb-4">For urgent matters outside business hours:</p>
                <div className="space-y-2">
                  <p className="font-semibold" style={{ color: '#FF6B35' }}>Emergency: +1 (555) 999-8888</p>
                  <p className="text-sm text-gray-500">Available 24/7 for enrolled students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: '#FF6B35' }}>
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
      </section>
      <FAQSection Faqres = {Faqres} />
    </div>
  );
}