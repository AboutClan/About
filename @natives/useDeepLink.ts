import { useRouter } from "next/router";
import { useEffect } from "react";

export const useDeepLink = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("🌐 Setting up webview message listener...");

    const handleMessage = (event: MessageEvent) => {
      console.log("🌐 Message event received:", event);
      console.log("🌐 Message data type:", typeof event.data);
      console.log("🌐 Message data:", event.data);

      if (typeof event.data !== "string") {
        console.log("🌐 Ignoring non-string message");
        return;
      }

      try {
        const data = JSON.parse(event.data);
        console.log("📩 Parsed data:", data);

        if (data.name !== "deeplink") {
          console.log("🌐 Not a deeplink message, ignoring");
          return;
        }

        alert(JSON.stringify(data));
        console.log("📩 Deep link data:", data);
        const target = `${data.path}${
          Object.keys(data.params).length > 0
            ? "?" + new URLSearchParams(data.params).toString()
            : ""
        }`;

        console.log("📩 Navigating to:", target);
        router.push(target);
      } catch (error) {
        console.error("❌ Failed to parse message data:", error);
      }
    };

    // iOS와 Android 모두 지원
    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    return () => {
      console.log("🌐 Removing webview message listener...");
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
    };
  }, [router]);
};
