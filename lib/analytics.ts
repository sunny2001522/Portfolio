// 輕量 GA4 事件包裝：window.gtag 由 @next/third-parties 注入。
// 沒有設 NEXT_PUBLIC_GA_ID 時 gtag 不存在，這些呼叫會安全地無作用。
type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: GtagParams,
    ) => void;
  }
}

export function track(event: string, params: GtagParams = {}): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

// 使用者點了哪個連結（作品連結、履歷、社群等）
export function trackLinkClick(params: {
  link_type: string; // e.g. "Web" | "GitHub" | "App Store" | "resume" | "role"
  project_id?: string;
  role?: string;
  url?: string;
}): void {
  track("link_click", params);
}

// 使用者停在哪個作品（切換到某作品時觸發）
export function trackProjectView(params: {
  project_id: string;
  project_title?: string;
  role?: string;
}): void {
  track("project_view", params);
}

// 使用者在某作品停留多久（離開該作品時觸發）
export function trackProjectDwell(params: {
  project_id: string;
  role?: string;
  seconds: number;
}): void {
  track("project_dwell", params);
}
