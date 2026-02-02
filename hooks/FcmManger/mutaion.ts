/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";

import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { useToast } from "../custom/CustomToast";
import { registerPushServiceWithApp } from "./apis";
import { DeviceInfo } from "./types";

export const usePushServiceInitialize = ({ uid }: { uid?: string }) => {
  const toast = useToast(); // ✅ 훅은 여기서만 호출

  useEffect(() => {
    const initializePushService = async () => {
      // if (!isWebView()) return;

      try {
        await waitForDeviceInfo(uid, toast);
      } catch (e) {
        toast("error", "deviceInfo 수신 실패"); // ✅ 실패 토스트
      }
    };

    initializePushService();
  }, [uid, toast]);
};

const waitForDeviceInfo = (
  uid: string | undefined,
  toast: (status: any, title: string, desc?: any, persist?: boolean) => void,
): Promise<DeviceInfo> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      toast("error", "deviceInfo 타임아웃", "RN에서 응답이 없어요");
      cleanup();
      reject(new Error("deviceInfo timeout"));
    }, 5000); // ✅ 5초만 기다리고 실패로 처리

    const cleanup = () => {
      clearTimeout(timeoutId);
      window.removeEventListener("message", handleDeviceInfo as any);
      document.removeEventListener("message", handleDeviceInfo as any);
    };
    let sawAnyMessage = false;
    const handleDeviceInfo = async (event: MessageEvent) => {
      try {
        const raw = event.data;
        if (typeof raw !== "string") return;

        // ✅ 토스트로 '받고 있다'부터 확인 (너 uid만 보이게 하고 싶으면 조건 걸어도 됨)
        if (!sawAnyMessage && uid === "2259633694") {
          sawAnyMessage = true;
          toast("info", "message 이벤트 수신됨", typeof event.data);
        }

        let data: any;
        try {
          data = JSON.parse(raw);
        } catch {
          return; // JSON 아니면 무시
        }
        toast("info", "deviceInfo raw", JSON.stringify(data));
        if (data?.name !== "deviceInfo" && data?.type !== "deviceInfo") return;

        // ✅ deviceInfo 도착 토스트
        toast(
          "success",
          "deviceInfo 도착",
          `platform=${data?.platform}, ver=${data?.appVersion ?? "?"}`,
        );

        await registerPushServiceWithApp({
          uid,
          fcmToken: data.fcmToken,
          platform: data?.platform || "web",
        });

        if (typeof window !== "undefined") {
          (window as any).AboutAppBridge = (window as any).AboutAppBridge || {};
          (window as any).AboutAppBridge.platform = data?.platform || "web";
          toast("success", "AboutAppBridge 세팅됨", window.AboutAppBridge.platform);
        }

        cleanup();
        resolve(data as DeviceInfo);
      } catch (e) {
        toast("error", "deviceInfo 처리 중 에러");
        cleanup();
        reject(e);
      }
    };

    window.addEventListener("message", handleDeviceInfo as any);
    document.addEventListener("message", handleDeviceInfo as any);

    // ✅ 이것 추가
    document.addEventListener("message", handleDeviceInfo); // Android RN WebView 전통 방식
    toast("info", "deviceInfo 리스너 등록됨");
    nativeMethodUtils.getDeviceInfo();
    toast("info", "getDeviceInfo 요청 보냄");

    // ✅ 요청 보냈다는 토스트 (선택)
    if (uid === "2259633694") toast("info", "getDeviceInfo 요청 보냄");
  });
};
