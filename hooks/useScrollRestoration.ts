import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { isScrollAutoState } from "../recoils/navigationRecoils";

export default function usePageScrollRestore() {
  const router = useRouter();
  const [isScrollAuto, setIsScrollAuto] = useRecoilState(isScrollAutoState);

  // 1. 이동 전 scroll 저장
  useEffect(() => {
    const handleRouteChangeStart = () => {
      sessionStorage.setItem("scroll-position:" + router.asPath, JSON.stringify(window.scrollY));
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);

  // 2. 조건에 맞을 때만 복원
  useEffect(() => {
    const saved = sessionStorage.getItem("scroll-position:" + router.asPath);

    if (isScrollAuto && saved) {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(saved, 10));
      });
    }

    // 복원 여부 초기화
    setIsScrollAuto(false);
  }, [isScrollAuto, router.asPath]);
}
