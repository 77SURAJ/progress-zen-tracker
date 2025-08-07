import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroSection } from "@/components/marketing/HeroSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";
import { Navigation } from "@/components/marketing/Navigation";
import { ScrollProgress } from "@/components/marketing/ScrollProgress";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden">
      <ScrollProgress />
      <Navigation />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <HeroSection />
        <FeaturesSection />
        <ProductShowcase />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Index;