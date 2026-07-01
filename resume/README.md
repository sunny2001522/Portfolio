# 履歷自動同步系統

每月自動把「最新工作成效」同步成可投遞的履歷與各求職平台文案。

## 檔案結構
```
resume/
  master.json      ← 唯一真實來源（雙語）。只改這裡。
  generate.mjs     ← 產生器（零依賴，PDF 走 Chrome headless）
  dist/            ← 產出（git 忽略）：ATS PDF / HTML / Markdown，中英各一
  platforms/       ← 產出（git 忽略）：104 / Cake / Yourator / LinkedIn 文案
```

## 怎麼用
1. 改 `master.json`（補成效、改職稱、補 TODO 欄位）。
2. 跑 `node resume/generate.mjs`。
3. 產物在 `dist/`（PDF 直接投遞）與 `platforms/`（複製貼到各平台）。

## 產出清單
| 檔案 | 用途 |
|---|---|
| `dist/SunnyChen_Resume_Zh.pdf` / `_En.pdf` | ATS 友善 PDF（單欄、文字可選取、嵌入字型） |
| `dist/resume.{zh,en}.html` | 想自己微調或重列印用 |
| `dist/resume.{zh,en}.md` | 純文字貼版 |
| `platforms/104.md` | 104：求職目標 / 自傳 / 專長 / 工作經歷 / 作品連結 |
| `platforms/cake.md` | Cake：中英 About + experience highlights + 作品 |
| `platforms/yourator.md` | Yourator：自我介紹 / 價值 / 想找的職位 |
| `platforms/linkedin.md` | LinkedIn：Headline / About / Experience + 設定提醒 |

## 每月 routine（雲端排程）
已透過 Claude Code 排程：每月 1 號重跑產生器並通知。雲端環境若沒有
Chrome，會略過 PDF 只出 HTML/MD/文案；PDF 在本機跑一次即可補齊。

平台更新需要登入，雲端無法代勞 → routine 只「產生內容 + 通知」。
之後在桌面開 Claude，說「幫我更新各平台履歷」，我會用瀏覽器逐一協助貼上。

## 平台手動更新檢查清單
- [ ] **LinkedIn** — Headline、About、Experience、Featured 放作品集、#OpenToWork
- [ ] **104** — 求職條件、自傳、專長、工作經歷、作品連結
- [ ] **Cake** — About（中英）、Experience、作品連結、版面排序
- [ ] **Yourator** — 自我介紹、想找的職位、作品集連結
