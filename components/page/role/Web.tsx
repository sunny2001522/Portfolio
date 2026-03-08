import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

type Role = "fe" | "pm" | "ui" | "design";

interface WebProps {
  role: Role;
  isActive: boolean;
}

const Web = ({ role, isActive }: WebProps) => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const projects = t.raw("projects") as Record<string, any>;
  const defaultImg = "/web/hotel-website.webp";

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
      img: imageMap[projectId] || defaultImg,
      title: projects[projectId].title,
    }));

  useGSAP(() => {
    if (!isActive || !marqueeRef.current || !containerRef.current) return;

    const marquee = marqueeRef.current;
    const container = containerRef.current;
    // Calculate exact scroll distance so the last item stops exactly at the right edge
    const totalWidth = marquee.scrollWidth - container.clientWidth;

    gsap.to(marquee, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: "#intro-container", 
        start: "top 64px",
        end: "+=3000",
        scrub: 0.5,
      },
    });
  }, { dependencies: [isActive] });

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-4 pl-4 md:pl-8">
      {isActive && (
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-4 pr-4 md:pr-8">
          {slides.map((slide, idx) => (
            <div key={idx} className="inline-block flex-shrink-0">
              <div className="relative h-28 md:h-56 w-44 md:w-80 rounded-xl overflow-hidden shadow-xl border-2 border-white/80 transform hover:scale-105 transition-transform">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  priority={idx < 4}
                  className="object-cover"
                  sizes="(max-width: 768px) 176px, 320px"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Web;
