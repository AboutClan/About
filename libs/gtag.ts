export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

declare global {
  interface Window {
    gtag: (...args) => void;
  }
}

export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;

  window.gtag("event", "page_view", {
    page_path: url,
  });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gaEvent = (name: string, params?: Record<string, any>) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;

  if (typeof window.gtag !== "function") {
    // 로그만 찍고 조용히 무시 (에러 방지)
    console.warn("[GA] gtag not ready:", name, params);
    return;
  }

  window.gtag("event", name, params);
};
