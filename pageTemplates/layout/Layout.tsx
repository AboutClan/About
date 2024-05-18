/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { config } from "@fortawesome/fontawesome-svg-core";
import { GoogleAnalytics } from "@next/third-parties/google";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import BottomNav from "../../components/BottomNav";
import GuestBottomNav from "../../components/layouts/atoms/GuestBottomNav";
import { useToken } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import BaseModal from "./BaseModal";
import BaseScript from "./BaseScript";
import Seo from "./Seo";

config.autoAddCss = false;

interface ILayout {
  children: React.ReactNode;
}

function Layout({ children }: ILayout) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const token = useToken();

  const segment = pathname?.split("/")?.[1];
  const PUBLIC_SEGMENT = ["register", "login"];
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const setSlideDirection = useSetRecoilState(slideDirectionState);

  const [isErrorModal, setIsErrorModal] = useState(false);

  function parseUrlToSegments(url) {
    const queryStartIndex = url.indexOf("?");

    const basePath = queryStartIndex >= 0 ? url.substring(0, queryStartIndex) : url;

    const segments = basePath.split("/").filter(Boolean);

    return segments;
  }

  useEffect(() => {
    console.log(3, pathname);
    if (!pathname) return;
    if (PUBLIC_SEGMENT.includes(segment)) return;
    if (session === undefined) return;
    const role = session?.user.role;
    if (role === "newUser") {
      router.push("/register/location");
      return;
    }
    if (role === "waiting") {
      router.push("/login?status=waiting");
      return;
    }
    if (!session?.user?.location) {
      toast(
        "warning",
        "업데이트가 필요합니다. 다시 로그인 해주세요! 반복되는 경우 관리자에게 문의 부탁드립니다!!",
      );
      signOut({ callbackUrl: `/login/?status=logout` });
    }

    const handleRouterStart = (url) => {
      if (!url) return;
      const segments = parseUrlToSegments(url);
      const prevSegemnts = parseUrlToSegments(pathname);
      console.log(4, prevSegemnts);
      if (segments[0] === "home") setSlideDirection("left");
      if (prevSegemnts[0] === "profile") setSlideDirection("left");
      console.log(222, pathname, url);
    };

    const handleRouterCompleted = (url) => {
      console.log(111);
      if (!url) return;
      const segments = parseUrlToSegments(url);
      setSlideDirection("right");
    };

    router.events.on("routeChangeStart", handleRouterStart);
    router.events.on("routeChangeComplete", handleRouterCompleted);

    return () => {
      router.events.off("routeChangeStart", handleRouterStart);
      router.events.off("routeChangeComplete", handleRouterCompleted);
    };
  }, [session, router.events, pathname]);

  return (
    <>
      <Seo title="ABOUT" />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />

      {token && (
        <>
          <div id="root-modal">{children}</div>
          {BASE_BOTTOM_NAV_URL.includes(pathname) && <BottomNav />}
          {isGuest && BASE_BOTTOM_NAV_URL.includes(pathname) && <GuestBottomNav />}
          <BaseModal isGuest={isGuest} isError={isErrorModal} setIsError={setIsErrorModal} />
        </>
      )}
      <BaseScript />
    </>
  );
}

const BASE_BOTTOM_NAV_URL = ["/home", "/statistics", "/gather", "/group"];

export default Layout;
