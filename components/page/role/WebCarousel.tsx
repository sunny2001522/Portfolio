import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { useTranslations } from "next-intl";

type Role = "fe" | "pm" | "ui" | "design";

interface WebProps {
  role: Role;
  isActive: boolean;
}

const WebCarousel = ({ role, isActive }: WebProps) => {
  const t = useTranslations();

  const staticImageMap: Record<Role, string> = {
    ui: "/web/metro-app.webp",
    pm: "/web/gamified-weight-loss.webp",
    fe: "/web/hotel-website.webp",
    design: "/design/iceverseProduct.webp",
  };

  const projects = t.raw("projects") as Record<string, any>;

  const imageMap: Record<string, string> = {
    "gamified-weight-loss": "/web/gamified-weight-loss.webp",
    "hotel-website": "/web/hotel-website.webp",
    portfolio: "/web/portfolio.webp",
    "metro-app": "/web/metro-app.webp",
    "ai-customer-service": "/web/lp.png",
    "social-media-tool": "/web/post.png",
    "ai-data-analysis": "/web/data.png",
    "ai-co-writing": "/web/genink.png",
    "life-manifestation": "/web/dreamake.png",
    book: "/design/book.webp",
    iceverse: "/design/iceverse.webp",
    iceverseProduct: "/design/iceverseProduct.webp",
    actor: "/design/actor.webp",
    taipei: "/design/taipei.webp",
  };

  const slides = Object.keys(projects)
    .filter((projectId) => projects[projectId][role])
    .map((projectId) => ({
      img: imageMap[projectId] || staticImageMap[role],
      title: projects[projectId].title,
    }));

  return (
    <div className="flex flex-col items-center justify-center font-bold bg-white/50 shadow-md backdrop-blur rounded-lg z-50 border-blue-200 border-2 overflow-hidden w-full h-full">
      <div className="flex gap-2 bg-gradient-to-r from-cyan-500 to-violet-200 px-4 py-2 w-full h-8 flex-shrink-0">
        <div className="rounded-full bg-white w-3 h-3"></div>
        <div className="rounded-full bg-white w-3 h-3"></div>
        <div className="rounded-full bg-white w-3 h-3"></div>
      </div>
      <div className="w-full flex-1 overflow-hidden relative">
        {isActive ? (
          <Swiper
            direction={"vertical"}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}
            grabCursor={true}
            className="w-full h-full"
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx} className="w-full h-full">
                <div className="flex flex-col shadow-md w-full h-full items-center justify-center overflow-hidden bg-gray-100">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-100">
            <img
              src={staticImageMap[role]}
              alt={role}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WebCarousel;