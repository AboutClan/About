import { useRouter } from "next/router";
import { useEffect } from "react";

export const useDeepLink = () => {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;

      try {
        const data = JSON.parse(event.data);
        alert(data);

        if (data.name !== "deeplink") return;

        const target = `/${data.path}?${new URLSearchParams(data.params).toString()}`;
        router.push(target);
      } catch (error) {
        console.error("Failed to parse message data:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
};
