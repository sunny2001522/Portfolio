#!/usr/bin/env node
// 履歷產生器：讀 resume/master.json → 產出 4 種 ATS PDF（中/英 × 線上/線下）+ HTML/MD + 各平台文案。
//   線上版：作品名稱、作品集、連結皆可點擊（超連結）。
//   線下版：附作品集 QR code（https://exuan-dev.vercel.app），連結以純文字呈現。
// 全部輸出到專案根目錄的 doc/；線上版另複製到 public/ 供網站「下載履歷」使用。
// 用法：node resume/generate.mjs   （可選：node resume/generate.mjs [來源JSON] [檔名後綴]）
// 無 npm 依賴（除 qrcode）；PDF 走 Chrome / Chromium headless（--print-to-pdf，保留可點擊連結）。
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import QRCode from "qrcode";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "doc"); // 工作相關文件統一輸出處
const PUB = join(ROOT, "public");
const PLAT = join(OUT, "platforms");
mkdirSync(OUT, { recursive: true });
mkdirSync(PLAT, { recursive: true });

const SRC = process.argv[2] || "master.json";
const TAG = process.argv[3] || "";
const M = JSON.parse(readFileSync(join(__dirname, SRC), "utf8"));
const LANGS = ["zh", "en"];
const MODES = ["online", "offline"];
const L = { zh: "Zh", en: "En" };
const T = {
  zh: { summary: "個人簡介", skills: "專業技能", experience: "工作經歷", projects: "精選作品", education: "學歷", links: "連結" },
  en: { summary: "Summary", skills: "Skills", experience: "Experience", projects: "Selected Projects", education: "Education", links: "Links" },
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const t = (v, l) => (v && typeof v === "object" ? v[l] : v);

const PORTFOLIO_URL = "https://exuan-dev.vercel.app";
const QR = await QRCode.toDataURL(PORTFOLIO_URL, { margin: 1, width: 240, errorCorrectionLevel: "M" });

// ---------- HTML (ATS-friendly single column; online=clickable, offline=QR) ----------
function html(l, mode) {
  const online = mode === "online";
  const p = M.profile;
  const tr = T[l];
  const contact = [t(p.location, l), p.email, p.phone].filter(Boolean).map(esc).join(" · ");
  const linkEntries = Object.entries(p.links).filter(([, u]) => u);
  const links = online
    ? linkEntries.map(([k, u]) => `<a href="${esc(u)}">${esc(k)}</a>`).join("  ·  ")
    : linkEntries.map(([k, u]) => `${esc(k)}: ${esc(u)}`).join("  ·  ");
  const skills = Object.entries(M.skills).map(([cat, v]) =>
    `<p class="skill"><span class="cat">${esc(cat)}:</span> ${esc((t(v, l) || []).join(", "))}</p>`).join("");
  const exp = M.experience.map((e) => `
    <div class="item">
      <div class="row"><span class="b">${esc(t(e.role, l))} — ${esc(t(e.company, l))}</span><span class="meta">${esc(e.period)}</span></div>
      <ul>${(t(e.bullets, l) || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>`).join("");
  const proj = M.projects.map((pr) => {
    const first = (pr.links || [])[0];
    const name = online && first
      ? `<a href="${esc(first.url)}">${esc(t(pr.name, l))}</a>`
      : esc(t(pr.name, l));
    const lk = online
      ? (pr.links || []).map((x) => `<a href="${esc(x.url)}">${esc(x.label)}</a>`).join("  ·  ")
      : (pr.links || []).map((x) => `${esc(x.label)}: ${esc(x.url)}`).join("  ·  ");
    return `<div class="item">
      <div class="row"><span class="b">${name}</span><span class="meta">${esc(pr.period)}</span></div>
      <ul>${(t(pr.bullets, l) || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      ${lk ? `<p class="links">${lk}</p>` : ""}
    </div>`;
  }).join("");
  const edu = M.education.map((e) =>
    `<div class="row"><span class="b">${esc(t(e.school, l))} — ${esc(t(e.degree, l))}</span><span class="meta">${esc(e.period)}</span></div>`).join("");
  const qr = !online
    ? `<div class="qr"><img src="${QR}" alt="portfolio QR code"/><span>${l === "en" ? "Scan for full portfolio" : "掃描看完整作品集"}<br/>exuan-dev.vercel.app</span></div>`
    : "";
  return `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><title>${esc(t(p.name, l))}</title>
<style>
  @page { size: A4; margin: 14mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: "PingFang TC","Hiragino Sans GB","Helvetica Neue",Arial,"Microsoft JhengHei",sans-serif;
         color: #1a1a1a; font-size: 10.5pt; line-height: 1.45; margin: 0; }
  a { color: #1a56db; text-decoration: none; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  .head .left { flex: 1; min-width: 0; }
  h1 { font-size: 20pt; margin: 0 0 2px; }
  .headline { font-size: 11pt; color: #444; margin: 0 0 6px; }
  .contact, .toplinks { font-size: 9.5pt; color: #333; margin: 1px 0; }
  .qr { flex: 0 0 auto; text-align: center; font-size: 8pt; color: #555; line-height: 1.25; }
  .qr img { width: 92px; height: 92px; display: block; margin: 0 auto 3px; }
  h2 { font-size: 11.5pt; text-transform: uppercase; letter-spacing: .5px; border-bottom: 1px solid #999;
       padding-bottom: 2px; margin: 14px 0 6px; }
  .item { margin-bottom: 9px; }
  .row { display: flex; justify-content: space-between; gap: 12px; }
  .b { font-weight: 600; }
  .meta { color: #555; white-space: nowrap; font-size: 9.5pt; }
  ul { margin: 3px 0 0; padding-left: 18px; }
  li { margin: 2px 0; }
  .skill { margin: 2px 0; } .cat { font-weight: 600; }
  .links { color: #444; font-size: 9pt; margin: 2px 0 0; }
  p { margin: 4px 0; }
</style></head><body>
  <div class="head">
    <div class="left">
      <h1>${esc(t(p.name, l))}</h1>
      <p class="headline">${esc(t(p.headline, l))}</p>
      <p class="contact">${contact}</p>
      <p class="toplinks">${links}</p>
    </div>${qr}
  </div>
  <h2>${tr.summary}</h2><p>${esc(t(p.summary, l))}</p>
  <h2>${tr.skills}</h2>${skills}
  <h2>${tr.experience}</h2>${exp}
  <h2>${tr.projects}</h2>${proj}
  <h2>${tr.education}</h2>${edu}
</body></html>`;
}

// ---------- Markdown (plain, paste-friendly; links as markdown) ----------
function md(l) {
  const p = M.profile, tr = T[l], out = [];
  out.push(`# ${t(p.name, l)}`, `**${t(p.headline, l)}**`, "");
  out.push([t(p.location, l), p.email, p.phone].filter(Boolean).join(" · "));
  out.push(Object.entries(p.links).filter(([, u]) => u).map(([k, u]) => `${k}: ${u}`).join(" · "), "");
  out.push(`## ${tr.summary}`, t(p.summary, l), "");
  out.push(`## ${tr.skills}`);
  for (const [cat, v] of Object.entries(M.skills)) out.push(`- **${cat}:** ${(t(v, l) || []).join(", ")}`);
  out.push("", `## ${tr.experience}`);
  for (const e of M.experience) {
    out.push(`### ${t(e.role, l)} — ${t(e.company, l)} _(${e.period})_`);
    for (const b of t(e.bullets, l) || []) out.push(`- ${b}`);
    out.push("");
  }
  out.push(`## ${tr.projects}`);
  for (const pr of M.projects) {
    out.push(`### ${t(pr.name, l)} _(${pr.period})_`);
    for (const b of t(pr.bullets, l) || []) out.push(`- ${b}`);
    const lk = (pr.links || []).map((x) => `[${x.label}](${x.url})`).join(" · ");
    if (lk) out.push(lk);
    out.push("");
  }
  out.push(`## ${tr.education}`);
  for (const e of M.education) out.push(`- ${t(e.school, l)} — ${t(e.degree, l)} _(${e.period})_`);
  return out.join("\n") + "\n";
}

// ---------- Platform snippets ----------
function platforms() {
  const p = M.profile;
  const expBlocks = (l, bullet) => M.experience.flatMap((e) => [
    `### ${t(e.company, l)} · ${t(e.role, l)}（${e.period}）`,
    ...(t(e.bullets, l) || []).map((b) => `${bullet}${b}`), "",
  ]);
  const projLines = (l) => M.projects.map((pr) => {
    const lk = (pr.links || []).map((x) => x.url).join(", ");
    return `- ${t(pr.name, l)}${lk ? " — " + lk : ""}`;
  });
  const files = {};
  files["linkedin.md"] = [
    "# LinkedIn", "",
    "## Headline", `${t(p.headline, "en")} | Target: ${t(p.targetRole, "en")}`, "",
    "## About", t(p.summary, "en"), "",
    "## Experience（每段填到對應公司的 Experience 條目）", ...expBlocks("en", "• "),
    "## Featured / 設定提醒", "- Featured 區放 Portfolio：" + p.links.portfolio, "- 開啟 #OpenToWork（Product Manager）",
  ].join("\n") + "\n";
  files["104.md"] = [
    "# 104", "", "## 求職目標 / 應徵職務", t(p.targetRole, "zh"), "",
    "## 個人簡介（自傳）", t(p.summary, "zh"), "",
    "## 專長技能", ...Object.entries(M.skills).map(([c, v]) => `${c}：${(t(v, "zh") || []).join("、")}`), "",
    "## 工作經歷（每家公司分開填）", ...expBlocks("zh", "・"),
    "## 作品連結", `作品集：${p.links.portfolio}`, `GitHub：${p.links.github}`,
  ].join("\n") + "\n";
  files["cake.md"] = [
    "# Cake (中英皆可放)", "", "## Headline / 一句話", `${t(p.headline, "en")}｜${t(p.headline, "zh")}`, "",
    "## About (EN)", t(p.summary, "en"), "", "## 關於我 (ZH)", t(p.summary, "zh"), "",
    "## Experience", ...expBlocks("en", "• "),
    "## 作品", ...projLines("en"),
  ].join("\n") + "\n";
  files["yourator.md"] = [
    "# Yourator（新創導向，語氣可活潑）", "", "## 自我介紹", t(p.summary, "zh"), "",
    "## 工作經歷", ...expBlocks("zh", "・"),
    "## 想找的職位", t(p.targetRole, "zh"), "", "## 作品集", p.links.portfolio,
  ].join("\n") + "\n";
  for (const [name, content] of Object.entries(files)) writeFileSync(join(PLAT, name), content);
  return Object.keys(files);
}

// ---------- Chrome / Chromium discovery ----------
function findChrome() {
  const env = process.env.CHROME_BIN || process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    env,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      if (c.includes("/")) { if (existsSync(c)) return c; }
      else { execFileSync("command", ["-v", c], { stdio: "ignore", shell: "/bin/bash" }); return c; }
    } catch { /* next */ }
  }
  try {
    const base = join(process.env.HOME || "", "Library/Caches/ms-playwright");
    const dirs = execFileSync("bash", ["-lc", `ls -d ${base}/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium 2>/dev/null | head -1`]).toString().trim();
    if (dirs && existsSync(dirs)) return dirs;
  } catch { /* none */ }
  return null;
}

function htmlToPdf(chrome, htmlPath, pdfPath) {
  execFileSync(chrome, [
    "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
    `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`,
  ], { stdio: "ignore" });
}

// ---------- Run ----------
const made = [];
for (const l of LANGS) {
  for (const mode of MODES) {
    const hp = join(OUT, `resume${TAG}.${l}.${mode}.html`);
    writeFileSync(hp, html(l, mode)); made.push(hp);
  }
  writeFileSync(join(OUT, `resume${TAG}.${l}.md`), md(l)); made.push(join(OUT, `resume${TAG}.${l}.md`));
}
const platFiles = TAG ? [] : platforms();

const chrome = findChrome();
const pdfs = [];
if (chrome) {
  for (const l of LANGS) {
    for (const mode of MODES) {
      const label = mode === "online" ? "Online" : "Offline";
      const pdf = join(OUT, `SunnyChen_Resume${TAG}_${L[l]}_${label}.pdf`);
      try { htmlToPdf(chrome, join(OUT, `resume${TAG}.${l}.${mode}.html`), pdf); pdfs.push(pdf); }
      catch (e) { console.error(`PDF 失敗 (${l}/${mode}):`, e.message); }
    }
  }
  // 網站「下載履歷」用線上版（可點擊）；中英各一份
  if (!TAG) {
    try { copyFileSync(join(OUT, `SunnyChen_Resume_Zh_Online.pdf`), join(PUB, `SoniaResumeZh.pdf`)); } catch (e) { console.error("copy zh->public 失敗:", e.message); }
    try { copyFileSync(join(OUT, `SunnyChen_Resume_En_Online.pdf`), join(PUB, `SoniaResumeEn.pdf`)); } catch (e) { console.error("copy en->public 失敗:", e.message); }
  }
} else {
  console.error("⚠️  找不到 Chrome/Chromium，略過 PDF。已產出 HTML。");
}

console.log("✅ 履歷產出完成 → doc/");
console.log("  PDF:", pdfs.length ? pdfs.map((f) => f.replace(OUT + "/", "")).join(", ") : "（無，缺 Chrome）");
console.log("  平台文案:", platFiles.join(", "));
const todos = JSON.stringify(M).match(/TODO_[^"]*/g) || [];
if (todos.length) console.log(`\n⚠️  master.json 還有 ${todos.length} 個 TODO：`, [...new Set(todos)].join(", "));
