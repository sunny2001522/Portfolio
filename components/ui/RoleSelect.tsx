"use client";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Pagination, Navigation } from "swiper/modules";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Web from "../page/role/Web";
import { Button } from "./button";
import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";

gsap.registerPlugin(ScrollTrigger);

const slideData = [
  {
    title: "fe",
    character: "/character/fe.webp",
    color: "linear-gradient(to top, #96E7F1 10%, transparent 90%)",
    award: ["role.fe.award.0", "role.fe.award.1"],
    description: ["role.fe.description.0", "role.fe.description.1"],
    shapes: [13, 17],
  },
  {
    title: "ui",
    character: "/character/ui.webp",
    color: "linear-gradient(to top, #FFC1B3 10%, transparent 90%)",
    award: ["role.ui.award.0", "role.ui.award.1"],
    description: ["role.ui.description.0", "role.ui.description.1"],
    shapes: [1, 16],
  },
  {
    title: "pm",
    character: "/character/pm.webp",
    color: "linear-gradient(to top, #DCCAF1 10%, transparent 90%)",
    award: ["role.pm.award.0", "role.pm.award.1"],
    description: ["role.pm.description.0", "role.pm.description.1"],
    shapes: [10, 14],
  },
  {
    title: "design",
    character: "/character/design.webp",
    color: "linear-gradient(to top, #FFD98D 10%, transparent 90%)",
    award: ["role.design.award.0", "role.design.award.1"],
    description: ["role.design.description.0", "role.design.description.1"],
    shapes: [15, 19],
  },
];

const slides = [...slideData, ...slideData, ...slideData];

const Gallery = ({ role }: { role: string }) => {
  // 根據 role 找到對應的 slideData index
  const roleIndex = slideData.findIndex((slide) => slide.title === role);
  const validRoleIndex = roleIndex >= 0 ? roleIndex : 0;

  // 計算初始 slide index (在 slides 陣列中，選擇中間那組的對應位置)
  const initialIndex = slideData.length + validRoleIndex + 1;
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const swiperRef = useRef<SwiperType | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 將 slides 的 index 轉換為 slideData 的 index
  const currentDataIndex = activeIndex % slideData.length;
  const currentRole = slideData[currentDataIndex].title;
  const isCurrentPageRole = currentRole === role;
  const t = useTranslations(currentRole);

  // 初始化 Swiper 時設定正確的 slide
  const handleSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    swiper.slideTo(initialIndex, 0); // 立即跳到指定位置，無動畫
  };

  // Swiper slide 切換時更新 activeIndex
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  // 背景擴散動畫
  useGSAP(() => {
    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [activeIndex]);

  // 滾動動畫 - 只針對中間角色圖
  useGSAP(() => {
    if (characterRef.current && containerRef.current) {
      gsap.fromTo(
        characterRef.current,
        {
          y: 50,
          scale: 0.8,
          opacity: 0,
          xPercent: -50,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          xPercent: -50,
        }
      );
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="relative w-full  flex flex-col items-center justify-start overflow-hidden h-[calc(100vh-64px)] "
    >
      {/* 輪播圖容器 */}
      <div
        className="relative w-full h-1/3 mx-auto z-10 pt-5"
        style={{ overflow: "visible" }}
      >
        <Swiper
          style={
            {
              "--swiper-navigation-color": "#8C8C8C",
              "--swiper-pagination-color": "#fff",
              overflow: "visible",
            } as React.CSSProperties
          }
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          centeredSlides={true}
          grabCursor={true}
          loop={true}
          navigation={true}
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          speed={300}
          breakpoints={{
            320: { slidesPerView: 3, spaceBetween: 1 },
            568: { slidesPerView: 3, spaceBetween: 5 },
            768: { slidesPerView: 5, spaceBetween: 0 },
            1200: { slidesPerView: 5, spaceBetween: 30 },
          }}
          className="w-full h-full"
        >
          {slides.map((slide, idx) => {
            const slideT = useTranslations(slide.title);
            return (
              <SwiperSlide key={idx} style={{ overflow: "visible" }}>
                {({ isActive, isNext, isPrev }) => {
                  // 計算縮放
                  let scale = 1;
                  let y = 0;
                  if (isActive) {
                    scale = 1;
                    y = 0;
                  } else if (isPrev || isNext) {
                    scale = 0.8;
                    y = 50;
                  } else {
                    scale = 0.7;
                    y = 80;
                  }

                  return (
                    <div
                      className="relative flex flex-col items-center justify-end bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-full shadow-inner select-none transition-all duration-700 ease-out"
                      style={{
                        transform: `translateY(${y}px) scale(${scale})`,
                        transformOrigin: "center bottom",
                        opacity: scale,
                        userSelect: "none",
                      }}
                    >
                      {/* 職位標題 */}
                      <div
                        className={`absolute -top-2 left-1/2 -translate-x-1/2 z-40 font-bold px-4 py-2 bg-gradient-to-l from-white/50 to-white/20 backdrop-blur-sm border-2 shadow-xl rounded-full whitespace-nowrap select-none transition-all duration-700 ${
                          isActive
                            ? "text-2xl md:text-3xl opacity-100"
                            : "text-xs md:text-sm opacity-60"
                        }`}
                        style={{ userSelect: "none" }}
                      >
                        {slideT("title")}
                      </div>

                      {/* 內容區域 */}
                      <div className="relative z-10 flex items-center justify-center rotate-3 py-24 md:py-32 w-full overflow-hidden select-none pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center pointer-events-auto">
                          <Web
                            role={slide.title as "fe" | "pm" | "ui" | "design"}
                            isActive={isActive}
                          />
                        </div>
                      </div>

                      {/* 裝飾圖片 */}
                      <img
                        src={`/shape/shape${slide.shapes[0]}.webp`}
                        alt=""
                        className={`absolute left-3 top-5 w-10 md:w-30 transition-all duration-700 ${
                          isActive ? "animate-spin" : ""
                        }`}
                        draggable="false"
                      />
                      <img
                        src={`/shape/shape${slide.shapes[1]}.webp`}
                        alt=""
                        className="absolute right-3 bottom-6 w-9/10 transition-all duration-700"
                        draggable="false"
                      />

                      {/* 漸層裝飾球 */}
                      <div className="absolute left-0 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-30 blur-xl pointer-events-none" />
                      <div className="absolute right-0 w-40 h-40 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full opacity-30 blur-xl pointer-events-none" />
                    </div>
                  );
                }}
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="custom-pagination absolute bottom-0 left-1/2 -translate-x-1/2 z-30"></div>
      </div>

      {/* 背景圓形漸層 */}
      <div className="w-full h-1/3">
        <div
          ref={bgRef}
          className="rounded-full w-full h-full aspect-square absolute bottom-0 translate-y-1/2"
          style={{ background: slideData[currentDataIndex].color }}
        />
      </div>

      {/* 左下：使用說明
      <div className="absolute left-10 bottom-10 z-20 max-md:left-4 max-md:bottom-4">
        <ul className="space-y-1 text-sm text-gray-700 max-md:text-xs">
          {slideData[currentDataIndex].description.map((desc, i) => (
            <li key={i}>• {t(`description.${i}`)}</li>
          ))}
        </ul>
      </div>

      {/* 右下：產品標章 */}
      {/* <div className="absolute right-10 bottom-10 z-20 text-right max-md:right-4 max-md:bottom-4">
        <ul className="space-y-1 text-sm text-gray-700 max-md:text-xs">
          {slideData[currentDataIndex].award.map((award, i) => (
            <li key={i}>• {t(`award.${i}`)}</li>
          ))}
        </ul>
      </div> */}

      {/* 中間角色圖 */}

      <Link href={`/${locale}/${slideData[currentDataIndex].title}`}>
        <img
          ref={characterRef}
          src={slideData[currentDataIndex].character}
          alt={slideData[currentDataIndex].title}
          className="w-56 object-cover rounded-2xl absolute left-1/2  bottom-10 -translate-x-1/2 z-20 max-md:w-40 max-md:bottom-32 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] "
          draggable="false"
        />
      </Link>
      <Link
        href={`/${locale}/${slideData[currentDataIndex].title}`}
        className="z-40"
      >
        <Button>選擇角色</Button>
      </Link>
    </div>
  );
};

export default Gallery;
