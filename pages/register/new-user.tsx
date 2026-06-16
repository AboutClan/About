import { useRouter } from "next/router";
import { useEffect } from "react";

import { MainLoading } from "../../components/atoms/loaders/MainLoading";

export default function NewUserRouter() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const callbackUrl =
      typeof router.query.callbackUrl === "string" ? router.query.callbackUrl : "";

    if (callbackUrl.includes("/cafe-map")) {
      router.replace("/cafe-map/register/name");
    } else {
      const dest = `/register/auth${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;
      router.replace(dest);
    }
  }, [router.isReady]);

  return <MainLoading />;
}
