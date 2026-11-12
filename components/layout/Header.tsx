"use client";

import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { roles } from "@/lib/data";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed z-[9999] w-full border-b border-black/5 bg-white/75 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-330 items-center justify-between gap-3">
        <Link
          href={`/${locale}`}
          className="flex min-w-0 items-center gap-1.5"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            src="/shape/shape1.webp"
            alt=""
            className="h-8 w-8 shrink-0"
            width={32}
            height={32}
          />
          <h1 className="truncate text-lg font-bold sm:text-xl">
            {t("HomePage.title")}
          </h1>
        </Link>

        <nav
          className="hidden items-center gap-4 lg:flex"
          aria-label="作品角色導覽"
        >
          {roles.map((role) => {
            const href = `/${locale}/${role.key}`;
            const isActive = pathname === href;

            return (
              <Link
                key={role.key}
                href={href}
                className={`border-b-2 py-1 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-black text-black"
                    : "border-transparent text-black/60 hover:border-black/35 hover:text-black"
                }`}
              >
                {t(role.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            className="grid size-9 place-items-center lg:hidden"
            aria-label={isMenuOpen ? "關閉作品導覽" : "開啟作品導覽"}
            title={isMenuOpen ? "關閉作品導覽" : "開啟作品導覽"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          className="mx-auto mt-3 grid w-full max-w-330 grid-cols-2 gap-x-5 border-t border-black/10 pt-3 lg:hidden"
          aria-label="作品角色導覽"
        >
          {roles.map((role) => {
            const href = `/${locale}/${role.key}`;
            const isActive = pathname === href;

            return (
              <Link
                key={role.key}
                href={href}
                className={`border-b py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-black text-black"
                    : "border-black/10 text-black/65 hover:text-black"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(role.labelKey)}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
