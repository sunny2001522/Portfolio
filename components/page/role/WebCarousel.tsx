import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { useTranslations } from "next-intl";

type Role = "fe" | "pm" | "ui" | "design" | "ai" | "product-builder" | "film" | "photo";

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
    ai: "/ai/generative-01.webp",
    "product-builder": "/web/birthday.png",
    film: "/ai/dark-circus.webp",
    photo: "/design/taipei.webp",
  };

  const projects = t.raw("projects") as Record<string, any>;

  const imageMap: Record<string, string> = {
    "birthday-calendar": "/web/birthday.png",
    "warrant-landing-page": "/web/warrentlp.webp",
    "longterm-treasure-app": "/web/longterm.webp",
    "longterm-treasure-web": "/web/longterm.webp",
    "simple-futures-web": "/web/simple-futures.webp",
    "gamified-weight-loss": "/web/gamified-weight-loss.webp",
    "hotel-website": "/web/hotel-website.webp",
    portfolio: "/web/portfolio.webp",
    "metro-app": "/web/metro-app.webp",
    "ai-customer-service": "/web/lp.webp",
    "social-media-tool": "/web/post.webp",
    "ai-data-analysis": "/web/data.webp",
    "ai-co-writing": "/web/genink.webp",
    "ai-video-content-generation": "/web/dreamake.webp",
    "ai-pastiche": "/ai/pastiche-01.webp",
    "ai-short-film-true-self": "/ai/true-self.webp",
    "ai-dark-circus": "/ai/dark-circus.webp",
    "ai-comic": "/ai/comic-01.webp",
    "ai-product": "/ai/product-01.webp",
    "ai-generative-art": "/ai/generative-01.webp",
    "ai-gobetgoal-characters": "/ai/gobetgoal-default.webp",
    "ai-suno-songwriting": "/ai/suno-electric.webp",
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
