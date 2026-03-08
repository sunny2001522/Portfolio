"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import Introduction from "@/components/page/role/Introduction";
import Project from "@/components/page/role/Project";
import ProjectListMobile from "@/components/page/role/ProjectListMobile";
import { RoleData } from "@/lib/types";
import RoleSelect from "../ui/RoleSelect";

gsap.registerPlugin(ScrollTrigger);

interface RolePageClientProps {
  data: RoleData;
  role: string;
}

const RolePageClient: React.FC<RolePageClientProps> = ({ data, role }) => {
  const t = useTranslations("RolePage");
  const mainRef = useRef<HTMLDivElement>(null);
  const dollContainerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (!boxRef.current || !mainRef.current || !dollContainerRef.current)
      return;

    const group = dollContainerRef.current;
    const doll = boxRef.current;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
      },
      (context) => {
        let { isMobile } = context.conditions as {
          isMobile: boolean;
          isDesktop: boolean;
        };

        // 1. Initial State
        // Both start from the right edge
        gsap.set(group, {
          opacity: 1,
          x: isMobile ? "80vw" : "65vw",
          y: isMobile ? "30vh" : "25vh",
          scale: isMobile ? 0.45 : 0.9,
          rotationY: 0,
          force3D: true,
        });

        // SECTION 1 TIMELINE (Introduction) - Synced with pinned intro-container
        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#section1",
            start: "top 64px",
            end: "+=3000",
            scrub: 0.5,
          },
        });

        introTl
          // 2. Scroll: Move into position
          .to(
            group,
            {
              // Mobile: move to center-right, further bottom. Desktop: center-right
              x: isMobile ? "5vw" : "20vw",
              y: isMobile ? "35vh" : "35vh",
              duration: 2,
              ease: "none",
              force3D: true,
            },
            0,
          )
          // 3. Stay pinned for the rest of the intro text animation
          .to(group, {
            x: isMobile ? "5vw" : "20vw",
            duration: 1,
          });

        // SECTION 2 TIMELINE (Projects)
        const projectTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#section2",
            start: "top 90%", // Trigger slightly before it fully enters
            end: "bottom bottom",
            scrub: 0.5,
          },
        });

        projectTl
          // 4. Move to Project Section position (Fast initial transition)
          .to(group, {
            x: isMobile ? "-45vw" : "-16vw", // Mobile: move right half a body from extreme left
            y: isMobile ? "60vh" : "10vh", // Mobile: move further down
            rotationY: 180,
            scale: isMobile ? 0.25 : 0.5,
            duration: 0.1,
            ease: "power2.inOut",
            force3D: true,
          })
          // 5. Hold position for the rest of the section
          .to(group, {
            x: isMobile ? "-45vw" : "-16vw",
            duration: 0.9,
          });

        // SECTION 3 TIMELINE (Role Select)
        const roleSelectTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#section3",
            start: "top 90%",
            end: "top top",
            scrub: 0.5,
          },
        });

        roleSelectTl
          // 6. Move to Center but lower
          .to(group, {
            x: "0vw",
            y: "0vh", // Move down vertically as requested
            scale: isMobile ? 0.4 : 0.8,
            rotationY: 0,
            duration: 1,
            ease: "power2.inOut",
            force3D: true,
          })
          // 7. Gradually fade out
          .to(group, {
            opacity: 0,
            duration: 0.5,
          });
      },
    );

    // Continuous float animation for the doll itself
    gsap.to(doll, {
      y: "+=15",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      force3D: true,
    });

    return () => mm.revert(); // Clean up matchMedia
  });

  return (
    <>
      <div
        ref={dollContainerRef}
        id="doll-container"
        className="fixed top-0 left-[50%] w-[300px] h-[400px] -translate-x-1/2 z-[60] pointer-events-none opacity-0 will-change-transform"
      >
        {/* The Doll */}
        <div className="absolute inset-0 flex items-center justify-center z-10 will-change-transform">
          <div className="w-[100%] h-[100%] relative">
            <Image
              ref={boxRef}
              src={`/character/${role}.webp`}
              alt="character"
              fill
              priority
              className="drop-shadow-2xl will-change-transform"
              style={{ transformStyle: "preserve-3d", objectFit: "contain" }}
              draggable="false"
            />
          </div>
        </div>
      </div>
      <section
        ref={mainRef}
        className="relative scroll-container z-10 text-4xl md:text-6xl font-bold pt-[64px] overflow-x-hidden max-w-[100vw]"
      >
        <div id="section1" className="scroll-section">
          <Introduction role={role} />
        </div>

        <div id="section2" className="scroll-section relative w-full">
          {/* Desktop Version */}
          <div className="hidden md:block w-full">
            <Project
              projects={data.projects}
              skills={data.skills}
              role={role}
            />
          </div>
          {/* Mobile Version */}
          <div className="block md:hidden w-full">
            <ProjectListMobile
              projects={data.projects}
              skills={data.skills}
              role={role}
            />
          </div>
        </div>
        <div id="section3" className="scroll-section ">
          <RoleSelect role={role} />
        </div>
      </section>
    </>
  );
};

export default RolePageClient;
