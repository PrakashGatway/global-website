"use client"
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "9875863347"; // 👉 your number (with country code)
  const message = "Hello, I want to know more!";


  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const pathname = usePathname()

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api") || pathname.startsWith("/consultant")) {
    return null
  }

  return (

    <button
      onClick={() => window.open(whatsappLink, "_blank")}

      rel="noopener noreferrer"
      className="
        fixed right-3 bottom-6 z-50
        bg-green-500 text-white
        w-12 h-12 sm:w-14 sm:h-14
        flex items-center justify-center
        rounded-full shadow-lg
        hover:scale-110 hover:bg-green-600
        transition-all
      "
    >
      <FaWhatsapp className="text-xl sm:text-2xl" />
    </button>
  );
}