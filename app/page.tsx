'use client'

import { animationTokens } from "@/app/tokens/animationTokens";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import IntegrityFooter from "./components/footer";
import IntegrityHeader from "./components/header";
import HeroText from "./components/slideOne/heroText";
import HowItWorksCards from "./components/slideThree/howItWorksCards";
import ProductDisplay from "./components/slideTwo/productDisplay";
import PurchaseInformation from "./components/slideTwo/purchaseInformation";
import { colors } from "./tokens/colors";

export default function Home() {
  const [opacity, setOpacity] = useState(0);
  const { scrollYProgress } = useScroll();

  const [firstPurchaseButtonInView, setFirstPurchaseButtonInView] = useState(false);

  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    scrollToTop();
    
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Check window width for mobile breakpoint
      const isMobile = window.innerWidth < 640; // sm breakpoint in Tailwind
      const multiplier = isMobile ? 2.5 : 1.66;
      setOpacity(latest * multiplier);
    });

    // Add resize listener to update opacity when screen size changes
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      const multiplier = isMobile ? 2.5 : 1.66;
      setOpacity(scrollYProgress.get() * multiplier);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollYProgress]);

  const styles = {
    hIWHeader: {
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center' as const,
      fontFamily: 'boldMain',
    },
    hIWSubHeader: {
      fontWeight: 'bold',
      color: colors.white,
      textAlign: 'center' as const,
    }
  }

  return (
    // NOTE - SLIDE ONE
    <>
    {/* NOTE - HEADER */}
    <IntegrityHeader showHeader={true} />

    {/* NOTE - BACKGROUND IMAGE */}
    <div className="fixed top-0 left-0 w-full h-full -z-10">

        <div className="bg-black w-full h-full absolute top-0 left-0 z-[1]" style={{ opacity: opacity }}></div>
        <Image fill className="object-cover w-full h-full" src="/assets/images/integrity-albumn-cover.png" alt="integrity-cover" priority />
    
    </div>

    {/* NOTE - HERO TEXT */}
    <div className="flex relative  h-screen w-full place-content-center">
      <HeroText firstPurchaseButtonInView={firstPurchaseButtonInView} setFirstPurchaseButtonInView={setFirstPurchaseButtonInView} />
    </div>

    {/* NOTE - PRODUCT DISPLAY */}
    <div className=" flex gap-[60px] relative flex-col h-max min-h-screen w-full place-content-center place-items-center">
      <div id="product-page-marker" className="absolute top-0 left-0 z-[-1] w-[100px] h-[100px]"></div>
      <ProductDisplay />
      <PurchaseInformation firstPurchaseButtonInView={firstPurchaseButtonInView} />
    </div>

    {/* NOTE - HOW IT WORKS */}
    <div className="sm:pt-[15%] lg:pt-[3%] flex relative gap-[15px] flex-col min-h-screen lg:h-screen w-full place-content-center">
      
      <div id="how-it-works-marker" className="absolute top-0 left-0 z-[-1] w-[100px] h-[100px]"></div>
      {/* NOTE - DESKTOP HOW IT WORKS */}
        <div className="flex flex-col hidden lg:flex h-max relative items-center justify-center">
          <motion.h1 
          className="lg:text-[5rem] leading-none select-none"
          initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration1 , delay: animationTokens.duration1 }} style={styles.hIWHeader}>HOW IT WORKS</motion.h1>
          <motion.h2 className="select-none" initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration3 * 1.25, delay: animationTokens.duration3 * 1.25 }} style={styles.hIWSubHeader}>In Three Steps</motion.h2>
        </div>

        {/* NOTE - TABLET HOW IT WORKS */}
        <div className="hidden sm:flex lg:hidden flex-col relative items-center justify-center">
            <motion.h1 
            className="
            text-[3rem] leading-none select-none"
            initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration1 , delay: animationTokens.duration1 }} style={styles.hIWHeader}>HOW IT WORKS</motion.h1>
            <motion.h2 className="text-[1.25rem] select-none" initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration3 * 1.25, delay: animationTokens.duration3 * 1.25 }} style={styles.hIWSubHeader}>In Three Steps</motion.h2>
        </div>

        {/* NOTE - MOBILE HOW IT WORKS */}
        <div className="sm:hidden w-full flex flex-col relative top-0 place-self-center py-4 h-[30vh]  z-[1]  items-center justify-center">
          <motion.h1 
          className="
          text-[2.3rem] 
          leading-none select-none"
          initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration1 , delay: animationTokens.duration1 }} style={styles.hIWHeader}>HOW IT WORKS</motion.h1>
          <motion.h2 className="select-none text-[1.75rem]" initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration3 * 1.25, delay: animationTokens.duration3 * 1.25 }} style={styles.hIWSubHeader}>In Three Steps</motion.h2>
        </div>
      
        <div className="sm:hidden h-[10px] sm:h-[140px]"/>
        
        <HowItWorksCards/>


    </div>

    {/* NOTE - FOOTER */}
    <IntegrityFooter />

    </>
  );
}
