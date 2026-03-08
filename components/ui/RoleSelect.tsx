"use client";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import WebCarousel from "../page/role/WebCarousel";
import { Button } from "./button";
import Link from "next/link";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";

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

const Gallery = ({ role }: { role: string }) => {
  // 根據 role 找到對應的 slideData index
  const roleIndex = slideData.findIndex((slide) => slide.title === role);
  const validRoleIndex = roleIndex >= 0 ? roleIndex : 0;

  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(validRoleIndex);

  // 計算實際顯示的索引 (處理負數與迴圈)
  const realActiveIndex = ((activeIndex % slideData.length) + slideData.length) % slideData.length;

  const nextSlide = () => setActiveIndex((prev) => prev + 1);
  const prevSlide = () => setActiveIndex((prev) => prev - 1);

  // 手勢滑動邏輯
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    if ('targetTouches' in e) {
      setTouchStart(e.targetTouches[0].clientX);
    } else {
      setTouchStart((e as React.MouseEvent).clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if ('targetTouches' in e) {
      setTouchEnd(e.targetTouches[0].clientX);
    } else {
      setTouchEnd((e as React.MouseEvent).clientX);
    }
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 鍵盤左右鍵控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="relative w-full flex flex-col items-center justify-start overflow-hidden h-[100dvh] md:h-[calc(100vh-64px)] outline-none focus:outline-none select-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndEvent}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEndEvent}
      onMouseLeave={onTouchEndEvent}
      tabIndex={-1}
    >
      {/* 電腦版左右切換按鈕 */}
      <div className="hidden md:block absolute left-8 top-1/3 -translate-y-1/2 z-50">
        <button 
          onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
          className="p-3 bg-white/40 hover:bg-white/80 rounded-full shadow-lg backdrop-blur text-gray-800 transition-all hover:scale-110 outline-none focus:outline-none"
        >
          <BiLeftArrowAlt className="w-8 h-8" />
        </button>
      </div>
      <div className="hidden md:block absolute right-8 top-1/3 -translate-y-1/2 z-50">
        <button 
          onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
          className="p-3 bg-white/40 hover:bg-white/80 rounded-full shadow-lg backdrop-blur text-gray-800 transition-all hover:scale-110 outline-none focus:outline-none"
        >
          <BiRightArrowAlt className="w-8 h-8" />
        </button>
      </div>

      {/* 3D 拱門輪播容器 */}
      <div 
        className="relative w-full h-[55vh] md:h-[55%] mt-[8vh] md:mt-12 flex justify-center items-end z-10 outline-none focus:outline-none" 
        style={{ perspective: '1200px' }}
      >
        {slideData.map((slide, index) => {
          const slideT = useTranslations(slide.title);
          
          // 計算每個拱門與當前活躍項目的相對距離
          let offset = index - realActiveIndex;
          // 確保 offset 落在 -1, 0, 1, 2 (假設共 4 個項目)
          if (offset < -1) offset += slideData.length;
          if (offset > 2) offset -= slideData.length;

          const isCenter = offset === 0;

          // 設定立體位置與動畫
          let transform = 'translateX(0) translateZ(0) rotateY(0deg) scale(1)';
          let opacity = 1;
          let zIndex = 30;

          if (offset === 1) { // 右側
            transform = 'translateX(85%) translateZ(-100px) rotateY(-15deg) scale(0.85)';
            opacity = 0.6;
            zIndex = 20;
          } else if (offset === -1) { // 左側
            transform = 'translateX(-85%) translateZ(-100px) rotateY(15deg) scale(0.85)';
            opacity = 0.6;
            zIndex = 20;
          } else if (offset === 2) { // 隱藏在後方
            transform = 'translateX(0) translateZ(-400px) rotateY(0deg) scale(0.5)';
            opacity = 0;
            zIndex = 10;
          }

          return (
            <div
              key={index}
              className="absolute w-[80vw] md:w-[350px] h-[45vh] md:h-[450px] flex flex-col items-center justify-end bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-full shadow-inner select-none transition-all duration-500 ease-out cursor-pointer outline-none focus:outline-none"
              style={{
                transform,
                opacity,
                zIndex,
                transformOrigin: "center bottom",
                pointerEvents: offset === 2 ? 'none' : 'auto',
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (offset === 1) nextSlide();
                if (offset === -1) prevSlide();
              }}
            >
              {/* 職位標題 */}
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 z-40 font-bold px-6 py-2 bg-gradient-to-l from-white/50 to-white/20 backdrop-blur-sm border-2 shadow-xl rounded-full whitespace-nowrap transition-all duration-500 ${isCenter ? "text-2xl md:text-3xl opacity-100" : "text-sm opacity-60"}`}>
                {slideT("title")}
              </div>

              {/* 作品預覽組件 */}
              <div className="relative z-10 flex flex-col items-center justify-center rotate-3 pb-16 md:pb-24 w-[90%] md:w-[85%] h-full overflow-hidden pointer-events-none">
                <div className="w-full aspect-video pointer-events-auto rounded-lg overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 w-full h-full">
                    <WebCarousel role={slide.title as any} isActive={isCenter} />
                  </div>
                </div>
              </div>

              {/* 裝飾圖片 */}
              <img src={`/shape/shape${slide.shapes[0]}.webp`} alt="" className={`absolute left-0 md:-left-4 top-10 w-12 md:w-20 transition-all duration-700 ${isCenter ? "animate-spin" : ""}`} draggable="false" />
              <img src={`/shape/shape${slide.shapes[1]}.webp`} alt="" className="absolute right-0 md:-right-4 bottom-20 w-12 md:w-20 transition-all duration-700" draggable="false" />
            </div>
          );
        })}
      </div>

      {/* 背景圓形漸層 (利用透明度切換以達成平滑漸變) */}
      <div className="absolute bottom-0 w-full h-[45%] md:h-[50%] z-0 pointer-events-none overflow-hidden">
        {slideData.map((slide, index) => (
          <div
            key={index}
            className={`w-[200%] md:w-[150%] aspect-square absolute top-0 left-1/2 -translate-x-1/2 rounded-full transition-opacity duration-700 ease-in-out ${index === realActiveIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: slide.color }}
          />
        ))}
      </div>

      {/* 中間主角圖片與按鈕 */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4">
        <Link href={`/${locale}/${slideData[realActiveIndex].title}`}>
          <img
            key={`img-${realActiveIndex}`}
            src={slideData[realActiveIndex].character}
            alt={slideData[realActiveIndex].title}
            className="w-[35vw] md:w-[220px] object-cover rounded-2xl hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
            draggable="false"
          />
        </Link>
        <Link href={`/${locale}/${slideData[realActiveIndex].title}`}>
          <Button className="shadow-lg hover:scale-105 transition-transform font-bold text-lg px-8 py-6 rounded-full">
            選擇角色
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Gallery;
