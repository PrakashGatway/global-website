"use client"

import { CheckCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ThankYou = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center max-w-lg w-full"
            >
                {/* Animated checkmark circle */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto mb-8 w-24 h-24 rounded-full bg-[#F46C44] flex items-center justify-center shadow-lg shadow-secondary/30"
                >
                    <CheckCircle className="w-12 h-12 text-secondary-foreground" strokeWidth={2.5} />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight"
                >
                    Thank You!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-muted-foreground mb-3"
                >
                    Your form has been submitted successfully.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-muted-foreground mb-10"
                >
                    We've received your information and will get back to you shortly.
                </motion.p>

                {/* Decorative divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="h-1 w-20 mx-auto rounded-full bg-[#F46C44] mb-10"
                />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => router.push("/")}
                        className="gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => router.back()}
                        className="gap-2 hover:bg-[#F46C44]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ThankYou;