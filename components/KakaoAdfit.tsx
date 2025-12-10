import { useEffect } from "react";

declare global {
  interface Window {
    kakao_adfit?: {
      render: () => void;
    };
  }
}

interface KakaoAdfitProps {
  unitId: string;
  width: number;
  height: number;
}

export default function KakaoAdfit({ unitId, width, height }: KakaoAdfitProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.kakao_adfit) return;

    try {
      window.kakao_adfit.render();
    } catch (e) {
      console.error("kakao_adfit.render error", e);
    }
  }, [unitId, width, height]);

  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit={unitId}
      data-ad-width={width}
      data-ad-height={height}
    />
  );
}
