"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import Introduction from "@/components/page/role/Introduction";
import Project from "@/components/page/role/Project";
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
  const boxRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (!boxRef.current || !mainRef.current) return;

      const box = boxRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          pin: box,
          scrub: 1,
          start: "top top",
          end: "bottom bottom",
        },
      });

      tl.to(box, { rotation: 24, duration: 1, ease: "none" });

      tl.to(box, {
        x: "-45vw",
        y: "-20vh",
        scale: 0.8,
        rotation: 0,
        rotationY: 180,
        duration: 1,
        ease: "none",
      });

      tl.to(box, {
        x: "-10vw",
        y: "0vh",
        scale: 0.5,
        rotationY: 360,
        duration: 1,
        ease: "none",
      });
      tl.to(box, {
        x: "-10vw",
        y: "0vh",
        opacity: 0,
        scale: 0.5,
        rotationY: 360,
        duration: 1,
        ease: "none",
      });
    },
    { scope: mainRef }
  );

  return (
    <>
      <div className=" w-[20vw] aspect-[2/3] absolute top-1/3 left-2/3 md:left-1/2">
        <Image
          ref={boxRef}
          src={`/character/${role}.webp`}
          alt="character"
          fill
          className="z-20"
          style={{ transformStyle: "preserve-3d" }}
          draggable="false"
        />
      </div>
      <section
        ref={mainRef}
        className="relative scroll-container z-10 text-6xl font-bold pt-[64px]"
      >
        <div
          id="section1"
          className="scroll-section  flex flex-col items-center justify-center h-[calc(100vh-64px)]"
        >
          <Introduction role={role} />
        </div>

        <div
          id="section2"
          className="scroll-section  flex flex-col items-center justify-center relative md:h-[calc(100vh-64px)]"
        >
          <Project projects={data.projects} skills={data.skills} role={role} />
        </div>
        <div id="section3" className="scroll-section ">
          <RoleSelect role={role} />
        </div>
      </section>
    </>
  );
};

export default RolePageClient;
