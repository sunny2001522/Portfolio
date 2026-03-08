import { useRef } from "react";
import Image from "next/image";
import Web from "./Web";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PiStarFourFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";

export default function Introduction({ role }: { role: string }) {
  const t = useTranslations(role);
  const containerRef = useRef<HTMLDivElement>(null);
  const introCardRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // --- Hero Text Animation (On Load) ---
    const heroChars = gsap.utils.toArray(".hero-char");
    
    // Animate each character differently
    heroChars.forEach((char: any, i) => {
      const animType = i % 4;
      let vars = {};
      
      if (animType === 0) vars = { rotation: 180, scale: 0, opacity: 0 }; 
      else if (animType === 1) vars = { y: -150, opacity: 0 }; 
      else if (animType === 2) vars = { x: -150, opacity: 0 }; 
      else if (animType === 3) vars = { scale: 0, opacity: 0 }; 

      gsap.fromTo(char, 
        vars,
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.4)",
          delay: i * 0.1
        }
      );
    });

    // Custom Dot Animation
    const dotTl = gsap.timeline({ repeat: -1, delay: 1 });
    dotTl.to(".dot-shape", { rotation: "+=720", duration: 0.6, ease: "power2.inOut" })
         .to({}, { duration: 0.8 })
         .to(".dot-shape", { rotation: "+=360", duration: 1, ease: "linear" })
         .to({}, { duration: 0.5 });

    // Button reveal
    gsap.fromTo(btnRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: "power2.out" }
    );

    // --- Scroll Animation ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 64px",
        end: "+=3000",
        scrub: 0.5,
        pin: true,
      }
    });

    // 1. Initial scroll: Fade out black overlay & button FASTER
    // Use fromTo to explicitly state start opacity, ensuring it returns on scroll up
    tl.fromTo([heroOverlayRef.current, btnRef.current], 
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.2, 
      }, 0
    );

    // 2. Decorations start slightly spread near center to fill cutouts, then move out FASTER
    tl.from(".decoration", {
      left: "50%",
      top: "50%",
      xPercent: (i) => -50 + (i % 3 - 1) * 30, // Slight random spread around center
      yPercent: (i) => -50 + (i % 2 === 0 ? -20 : 20),
      scale: 1, 
      duration: 0.5, // Shortened from 1
      ease: "power2.out",
    }, 0);

    // 3. Reveal Intro Card
    tl.fromTo(introCardRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.98,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.3,
    }, 0.2); // Adjusted start time

    // 4. Reveal Text inside Intro Card sequentially
    const cardTexts = introCardRef.current?.querySelectorAll(".intro-text") || [];
    tl.fromTo(cardTexts, {
      opacity: 0,
      x: -20,
    }, {
      opacity: 1,
      x: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: "power2.out",
    }, 0.3);

    // Star icon sparkle
    gsap.to(".star-icon", {
      rotate: 360,
      scale: 1.1,
      repeat: -1,
      duration: 5,
      ease: "none",
    });

  }, { scope: containerRef });

  return (
    <div id="intro-container" ref={containerRef} className="intro-section relative w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden bg-white">
      
      {/* RESTORED ORIGINAL DECORATIONS - No intrinsic rotation classes */}
      <Image src="/shape/shape10.webp" alt="decoration" priority className="decoration absolute right-[10%] top-[5%] z-0" unoptimized width={160} height={160} />
      <Image src="/shape/shape16.webp" alt="decoration" priority className="decoration absolute bottom-[20%] z-0 -left-[10%] translate-y-1/2" unoptimized width={700} height={700} />
      <Image src="/shape/shape13.webp" alt="decoration" priority className="decoration absolute left-[5%] top-[10%] z-0" unoptimized width={120} height={120} />
      <Image src="/shape/shape4.webp" alt="decoration" priority className="decoration absolute right-[5%] top-1/3 z-0 hidden md:block" unoptimized width={160} height={160} />
      <Image src="/shape/shape14.webp" alt="decoration" priority className="decoration absolute top-0 -left-[20%] md:-left-[10%] z-0" unoptimized width={300} height={300} />
      <Image src="/shape/shape17.webp" alt="decoration" priority className="decoration absolute -right-[40%] md:-right-[20%] scale-50 md:scale-100 lg:right-0 top-0 z-0" unoptimized width={600} height={2400} />
      <Image src="/shape/shape12.webp" alt="decoration" priority className="decoration absolute left-[75%] top-[15%] z-0 hidden md:block" unoptimized width={160} height={160} />
      <Image src="/shape/shape18.webp" alt="decoration" priority className="decoration absolute left-[5%] bottom-[15%] z-0 hidden md:block" unoptimized width={200} height={200} />
      <Image src="/shape/shape11.webp" alt="decoration" priority className="decoration absolute left-[15%] bottom-[5%] z-10" unoptimized width={160} height={160} />

      {/* HERO OVERLAY - Black background with cutout text (mix-blend-multiply) */}
      <div ref={heroOverlayRef} className="absolute inset-0 bg-black text-white mix-blend-multiply z-50 flex flex-col items-center justify-center pointer-events-none">
        {/* Changed gap-y-6 to gap-y-0 to bring lines closer together on mobile */}
        <h1 className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-y-0 md:gap-x-6 text-6xl md:text-8xl lg:text-[9rem] font-bold tracking-tighter">
          <div className="flex">
            <span className="hero-char inline-block uppercase">B</span>
            <span className="hero-char inline-block">u</span>
            <div className="relative inline-flex flex-col items-center justify-end mx-1 md:mx-2">
              <div className="absolute -top-6 md:-top-10 w-8 h-8 md:w-16 md:h-16 dot-shape z-10">
                 <Image src="/shape/shape10.webp" alt="dot" fill className="object-contain drop-shadow-lg" unoptimized />
              </div>
              <span className="hero-char inline-block">i</span>
            </div>
            <span className="hero-char inline-block">l</span>
            <span className="hero-char inline-block">d</span>
          </div>
          <div className="flex">
            <span className="hero-char inline-block uppercase">A</span>
            <span className="hero-char inline-block">n</span>
            <span className="hero-char inline-block">y</span>
          </div>
          <div className="flex">
            <span className="hero-char inline-block uppercase">D</span>
            <span className="hero-char inline-block">r</span>
            <span className="hero-char inline-block">e</span>
            <span className="hero-char inline-block">a</span>
            <span className="hero-char inline-block">m</span>
          </div>
        </h1>
      </div>

      {/* BUTTON - White */}
      <div ref={btnRef} className="absolute bottom-[20%] md:bottom-[25%] z-[60]">
        <Button 
          asChild 
          className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black rounded-full px-8 py-6 text-lg shadow-xl font-bold transition-all duration-300 pointer-events-auto"
        >
          <a href={t("resume")} download>Get Sonia</a>
        </Button>
      </div>

      {/* 跑馬燈 - Moved to the very bottom */}
      <div className="absolute bottom-[5%] md:bottom-[-8%] left-[-5%] w-[110%] z-20 -rotate-2 pointer-events-none">
        <Web role={role as "fe" | "pm" | "ui" | "design"} isActive={true} />
      </div>

      {/* Intro Card - Glassmorphism, Black Text, Silver Stars only on list. Mobile position: Top-Left */}
      <div ref={introCardRef} className="absolute top-[5%] left-[5%] md:top-[20%] md:left-[10%] z-[70] w-[90%] md:w-1/2 lg:w-2/5 p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-lg border border-white/60 shadow-xl opacity-0">
        <div className="space-y-6 text-black">
          
          <h2 className="intro-text text-4xl md:text-6xl font-black tracking-tighter italic">
            {t("title")}
          </h2>
          
          <p className="intro-text text-xl md:text-2xl font-bold leading-tight">
            {t("me")}
          </p>

          <div className="space-y-4 pt-4 border-t border-black/10">
            <div className="intro-text flex items-start gap-3">
              <PiStarFourFill className="text-gray-400 star-icon flex-shrink-0 mt-1" size={20} />
              <p className="text-base md:text-xl font-bold">
                {t("about.skill")}
              </p>
            </div>
            <div className="intro-text flex items-start gap-3">
              <PiStarFourFill className="text-gray-400 star-icon flex-shrink-0 mt-1" size={20} />
              <p className="text-sm md:text-lg font-medium opacity-80">
                {t("about.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}