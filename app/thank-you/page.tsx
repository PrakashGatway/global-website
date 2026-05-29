"use client"

import { Check, ArrowLeft, Home, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const ThankYou = () => {
  const router = useRouter()

  // Staggered animation variants for cleaner code
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F46C44] overflow-hidden px-4">
      {/* Floating Background Blobs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[100px] opacity-50"
          style={{
            background: i % 2 === 0 ? "#F46C44" : "#6366f1",
            width: `${250 + i * 80}px`,
            height: `${250 + i * 80}px`,
            top: `${15 + i * 35}%`,
            left: `${5 + i * 30}%`,
          }}
          animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Main Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-xl w-full bg-white backdrop-blur-xl border border-border/40 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/5"
      >
        {/* Animated Success Icon */}
        <motion.div variants={itemVariants} className="relative mx-auto w-20 h-20 mb-6">
          <motion.div
            className="absolute inset-0 bg-[#F46C44]/20 rounded-full"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <div className="relative w-full h-full bg-gradient-to-br from-[#F46C44] to-[#E0583A] rounded-full flex items-center justify-center shadow-lg shadow-[#F46C44]/30">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 15, delay: 0.2 }}
            >
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </motion.div>
          </div>
        </motion.div>

        {/* Title & Subtitle */}
        <motion.h1 
          variants={itemVariants} 
          className="text-4xl font-extrabold text-center mb-3 bg-gradient-to-r from-primary via-[#F46C44] to-[#F46C44]/80 bg-clip-text text-transparent"
        >
          Thank You!
        </motion.h1>
        <motion.p 
          variants={itemVariants} 
          className="text-center text-muted-foreground mb-6 leading-relaxed"
        >
          Your submission was successful. We've received your details and will be in touch shortly.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          <Sparkles className="w-4 h-4 text-[#F46C44]" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </motion.div>

        {/* What's Next Section (UX Boost) */}
        <motion.div 
          variants={itemVariants} 
          className="bg-muted/40 rounded-2xl p-4 mb-8 border border-border/30"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F46C44]" />
            What happens next?
          </h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {["Confirmation email sent to your inbox", "Our team reviews within 24 hours", "Personalized follow-up from our staff"].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#F46C44] mt-0.5 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="flex-1 bg-[#F46C44] hover:bg-[#E0583A] text-white shadow-lg shadow-[#F46C44]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="flex-1 hover:bg-[#F46C44]/10 hover:text-[#F46C44] hover:border-[#F46C44]/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ThankYou