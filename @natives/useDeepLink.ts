/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export const useDeepLink = ({ token }: { token?: string | null }) => {
  const router = useRouter();
  const pendingRef = useRef<string | null>(null);

  // ✅ 1. 토큰 상태를 Ref로 관리 (리스너가 재시작되지 않고도 최신 토큰을 참조하게 함)
  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // ✅ 2. 토큰이 생겼을 때, 대기 중인(pending) 경로가 있다면 이동
  useEffect(() => {
    if (token && pendingRef.current) {
      const target = pendingRef.current;
      pendingRef.current = null;
      console.log("[DL] Pending target moved:", target);
      router.replace(target).catch(() => {});
    }
  }, [token, router]);

  useEffect(() => {
    const log = (...args: any[]) => console.log("[DL]", ...args);

    const handleMessage = (event: any) => {
      // 1) 데이터 추출
      const raw = event?.data ?? event?.nativeEvent?.data;
      if (!raw) return;

      let data: any;
      try {
        data = JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw));
      } catch {
        return;
      }

      // 2) 딥링크 이름 확인
      if (data?.name !== "deeplink") return;

      // 3) 경로 정규화 (link/ 접두사 제거 및 슬래시 보정)
      const path = typeof data?.path === "string" ? data.path : "";
      const normalizedPath = path.startsWith("link/")
        ? "/" + path.replace("link/", "")
        : path.startsWith("/")
        ? path
        : "/" + path;

      // 4) 파라미터 처리
      const rawParams = data?.params && typeof data.params === "object" ? data.params : {};
      const cleanedParams: Record<string, string> = {};
      Object.entries(rawParams).forEach(([k, v]) => {
        const key = k.startsWith("?") ? k.slice(1) : k;
        if (key) cleanedParams[key] = String(v ?? "");
      });

      const qs =
        Object.keys(cleanedParams).length > 0
          ? `?${new URLSearchParams(cleanedParams).toString()}`
          : "";

      const target = `${normalizedPath}${qs}`;
      log("최종 타겟 경로:", target);

      // 5) 이동 로직 (최신 토큰 상태 확인)
      const currentToken = tokenRef.current;

      if (!currentToken && !target.includes("login")) {
        log("토큰이 없어 대기 상태로 전환:", target);
        pendingRef.current = target;
        return;
      }

      log("라우터 이동 실행:", target);
      router.push(target).catch((err) => log("이동 실패:", err));
    };

    // ✅ 리스너를 먼저 등록 (어떤 상황에서도 데이터 수신 가능하게)
    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    // ✅ 리스너가 확실히 등록된 후 앱에 준비 신호 발송
    const timer = setTimeout(() => {
      const rnWebView = (window as any)?.ReactNativeWebView;
      if (rnWebView) {
        rnWebView.postMessage(JSON.stringify({ type: "webviewReady" }));
        log("webviewReady 신호 전송 완료");
      }
    }, 200);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
      clearTimeout(timer);
    };
    // ❗ 중요: 의존성 배열에서 token을 제거했습니다.
    // 리스너는 앱 생명주기 동안 딱 한 번만 등록됩니다.
  }, [router]);

  return null;
};
