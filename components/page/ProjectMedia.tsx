"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { trackLinkClick } from "@/lib/analytics";

interface Props { image: string; video?: string; title: string; projectId: string; role: string; summary?: string; }
export default function ProjectMedia({ image, video, title, projectId, role, summary }: Props) {
  const [playing, setPlaying] = useState(false);
  const t = useTranslations("Portfolio");
  const locale = useLocale();
  if (locale === "en") return <figure className="project-figure">
    <div className="project-media english-preview"><div className="preview-bar"><span /><span /><span /></div><div className="preview-copy"><span className="eyebrow">{t("summaryPreview")}</span><strong>{title}</strong>{summary && <p>{summary}</p>}<a className="text-link" href={image} target="_blank" rel="noopener noreferrer">{t("openOriginal")} ↗</a>{video && <a className="text-link" href={video} target="_blank" rel="noopener noreferrer">{t("originalVideo")} ↗</a>}</div></div>
    <figcaption>{t("summaryCaption")}</figcaption>
  </figure>;
  return <figure className="project-figure">
    <div className="project-media">
      {playing && video ? <video src={video} poster={image} controls autoPlay playsInline preload="metadata" aria-label={title} /> : <>
        <Image src={image} alt={title} fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) 45vw, 550px" quality={75} className="project-image" />
        {video && <button type="button" className="play-demo" onClick={() => { setPlaying(true); trackLinkClick({ link_type: "demo", project_id: projectId, role }); }} aria-label={`${t("playDemo")} — ${title}`}><span aria-hidden="true">▶</span> {t("playDemo")}</button>}
      </>}
    </div>
    <figcaption>{video ? t("demoCaption") : t("visualCaption")}</figcaption>
  </figure>;
}
