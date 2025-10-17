import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { useTranslations } from "next-intl";

type Role = "fe" | "pm" | "ui" | "design";

interface WebProps {
  role: Role;
  isActive: boolean;
}

const Web = ({ role, isActive }: WebProps) => {
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
    book: "/design/book.webp",
    iceverse: "/design/iceverse.webp",
    iceverseProduct: "/design/iceverseProduct.webp",
    actor: "/design/actor.webp",
    taipei: "/design/taipei.webp",
  };

  const slides = Object.keys(projects)
    .filter((projectId) => projects[projectId][role])
    .map((projectId) => ({
      img: imageMap[projectId],
      title: projects[projectId].title,
      description: projects[projectId].overview?.goal,
    }));

  return (
    <div className="flex flex-col items-center justify-center font-bold bg-white/50 shadow-md backdrop-blur rounded-lg z-50 border-blue-200 border-2 overflow-hidden">
      <div className="flex gap-2 bg-gradient-to-r from-cyan-500 to-violet-200 px-4 py-2 w-full ">
        <div className="rounded-full bg-white w-3 h-3"></div>
        <div className="rounded-full bg-white w-3 h-3"></div>
        <div className="rounded-full bg-white w-3 h-3"></div>
      </div>
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
          className="aspect-video"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-col shadow-md h-full items-center justify-center overflow-hidden">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="aspect-video flex items-center justify-center overflow-hidden">
          <img
            src={staticImageMap[role]}
            alt={role}
            className="w-full h-30 object-cover aspect-video"
          />
        </div>
      )}
    </div>
  );
};

export default Web;
