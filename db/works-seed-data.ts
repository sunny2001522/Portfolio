interface Bi {
  zh: string;
  en: string;
}

export interface SeedAward {
  name: Bi;
  result?: Bi;
  year?: string;
}

export interface SeedCredit {
  id: string;
  year: string;
  title: string;
  titleEn: string;
  format: Bi;
  role: Bi;
  awards?: SeedAward[];
}

export interface SeedLiteratureAward extends SeedAward {
  work?: Bi;
}

const FEATURE: Bi = { zh: "長片", en: "Feature" };
const SHORT: Bi = { zh: "短片", en: "Short" };
const SERIES: Bi = { zh: "影集", en: "Series" };
const VR: Bi = { zh: "VR 短片", en: "VR short" };
const EXPERIMENTAL: Bi = { zh: "實驗片", en: "Experimental" };

const NOMINATED: Bi = { zh: "入圍", en: "Nominated" };
const SELECTED: Bi = { zh: "入選", en: "Selected" };
const GRANT: Bi = { zh: "補助", en: "Grant" };

// 依年份由新到舊；年份未知者放最後
export const filmCredits: SeedCredit[] = [
  {
    id: "last-samozai",
    year: "2023",
    title: "最後的薩魔仔",
    titleEn: "The Last Samozai",
    format: SERIES,
    role: { zh: "編劇", en: "Screenwriter" },
    awards: [
      {
        name: { zh: "文化部電視劇本獎", en: "Ministry of Culture TV Script Award" },
        result: { zh: "首獎", en: "First Prize" },
        year: "2023",
      },
    ],
  },
  {
    id: "huiyin",
    year: "2023",
    title: "迴陰",
    titleEn: "Echoes of the Unseen",
    format: FEATURE,
    role: {
      zh: "編劇助理、導演助理、企劃",
      en: "Writing assistant, assistant director, development",
    },
    awards: [
      {
        name: {
          zh: "國產電影片企劃及劇本開發補助",
          en: "Domestic Film Development & Script Grant",
        },
        result: GRANT,
      },
      {
        name: { zh: "優良劇本獎", en: "Outstanding Script Award" },
        result: SELECTED,
      },
    ],
  },
  {
    id: "paifang",
    year: "2023",
    title: "一個牌坊的誕生",
    titleEn: "The Birth of a Memorial Arch",
    format: SHORT,
    role: { zh: "製片", en: "Producer" },
    awards: [
      {
        name: {
          zh: "英國倫敦國際影展競賽",
          en: "London International Film Festival (competition)",
        },
      },
      {
        name: { zh: "威尼斯短片競賽", en: "Venice short film competition" },
      },
    ],
  },
  {
    id: "deep-pressure",
    year: "2023",
    title: "深層壓迫",
    titleEn: "Deep Pressure",
    format: SHORT,
    role: { zh: "影展經紀", en: "Festival agent" },
    awards: [
      {
        name: { zh: "藝美獎最佳長片", en: "Art & Beauty Award, Best Feature" },
      },
      { name: { zh: "螺絲起子影展", en: "Screwdriver Film Festival" }, result: NOMINATED },
      { name: { zh: "金片子", en: "Golden Film Awards" } },
    ],
  },
  {
    id: "kun",
    year: "2023",
    title: "困",
    titleEn: "Trapped",
    format: SHORT,
    role: { zh: "剪輯、調光", en: "Editor, colorist" },
  },
  {
    id: "wuyuexue",
    year: "2022",
    title: "五月雪",
    titleEn: "Snow in Midsummer",
    format: FEATURE,
    role: { zh: "Foley", en: "Foley" },
  },
  {
    id: "ghost-tower",
    year: "2022",
    title: "鬼天廈",
    titleEn: "The Ghost Tower",
    format: FEATURE,
    role: { zh: "Foley", en: "Foley" },
  },
  {
    id: "farewell-train",
    year: "2022",
    title: "道別列車",
    titleEn: "Farewell Train",
    format: FEATURE,
    role: { zh: "企劃", en: "Development" },
    awards: [
      {
        name: { zh: "文化部劇本開發補助案", en: "Ministry of Culture Script Development Grant" },
        result: GRANT,
      },
    ],
  },
  {
    id: "magic-teacher",
    year: "2022",
    title: "魔術老師是我爸",
    titleEn: "My Dad, the Magic Teacher",
    format: SHORT,
    role: { zh: "混音", en: "Sound mixing" },
    awards: [
      { name: { zh: "台灣 Pitch", en: "Taiwan Pitch" }, result: NOMINATED },
      { name: { zh: "圓缺影展", en: "Yuanque Film Festival" } },
      { name: { zh: "新北市紀錄片競賽", en: "New Taipei Documentary Competition" } },
      { name: { zh: "藝美獎", en: "Art & Beauty Award" } },
    ],
  },
  {
    id: "shigong-magician",
    year: "2022",
    title: "師公魔術師",
    titleEn: "The Ritual Magician",
    format: SHORT,
    role: { zh: "影展經紀", en: "Festival agent" },
    awards: [{ name: { zh: "金勇影展", en: "Golden Brave Film Festival" }, result: NOMINATED }],
  },
  {
    id: "taste-of-missing",
    year: "2022",
    title: "想念的味道",
    titleEn: "The Taste of Missing You",
    format: SHORT,
    role: { zh: "美術", en: "Art direction" },
  },
  {
    id: "dwelling-in-flow",
    year: "2022",
    title: "寓居於流",
    titleEn: "Dwelling in Flow",
    format: VR,
    role: { zh: "美術", en: "Art direction" },
  },
  {
    id: "watermelon",
    year: "2020",
    title: "打西瓜",
    titleEn: "Watermelon",
    format: SHORT,
    role: { zh: "混音", en: "Sound mixing" },
    awards: [{ name: { zh: "藝美獎短片獎", en: "Art & Beauty Award, Short Film" }, result: NOMINATED }],
  },
  {
    id: "shadow",
    year: "",
    title: "陰影之下",
    titleEn: "Under the Shadow",
    format: SHORT,
    role: { zh: "影展經紀", en: "Festival agent" },
    awards: [{ name: { zh: "藝美獎最佳短片", en: "Art & Beauty Award, Best Short" } }],
  },
  {
    id: "jiaobei",
    year: "",
    title: "擲筊萬歲",
    titleEn: "Long Live the Divination Blocks",
    format: { zh: "", en: "" },
    role: { zh: "製片", en: "Producer" },
  },
  {
    id: "nuwa",
    year: "",
    title: "女媧",
    titleEn: "Nuwa",
    format: { zh: "", en: "" },
    role: { zh: "導演", en: "Director" },
  },
  {
    id: "remote-surveillance",
    year: "",
    title: "遠距監視",
    titleEn: "Remote Surveillance",
    format: EXPERIMENTAL,
    role: { zh: "導演", en: "Director" },
  },
  {
    id: "big-questions",
    year: "",
    title: "大學問",
    titleEn: "Knowhow College",
    format: { zh: "Podcast", en: "Podcast" },
    role: { zh: "聲音（台灣百大 Podcast）", en: "Sound (Taiwan top-100 podcast)" },
  },
];

export const literatureAwards: SeedLiteratureAward[] = [
  {
    name: { zh: "文化部電視劇本獎", en: "Ministry of Culture TV Script Award" },
    result: { zh: "首獎", en: "First Prize" },
    year: "2023",
    work: { zh: "最後的薩魔仔", en: "The Last Samozai" },
  },
  {
    name: { zh: "全球華文學生文藝獎", en: "Global Chinese Student Literary Award" },
  },
  {
    name: { zh: "中學生聯合文學獎", en: "Unitas Secondary School Literary Award" },
  },
];

// No role-specific awards are published without a verifiable attribution.
export const roleAwards: Record<"fe" | "ui" | "pm" | "design", SeedAward[]> = {
  fe: [], ui: [], pm: [], design: [],
};
