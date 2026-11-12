// components/LanguageSwitcher.tsx
"use client";

import { useRouter, usePathname } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";

const languages = [
  { value: "en", label: "Eng" },
  { value: "zh", label: "中" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const currentLanguage = languages.find(
    (lang) => lang.value === currentLocale
  );

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[82px] sm:w-[112px] md:w-[140px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            {currentLanguage?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            <span className="flex items-center gap-2">{language.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
