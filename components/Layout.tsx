/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { config } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import Script from "next/script";
import styled from "styled-components";
import { useToken } from "../hooks/token/useToken";
import { useUserInfoQuery } from "../hooks/user/queries";
import GuestBottomNav from "./layout/GuestBottomNav";

const NEXT_PUBLIC_NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
config.autoAddCss = false;
interface ILayout {
  children: React.ReactNode;
}

function Layout({ children }: ILayout) {
  const token = useToken();
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const router = useRouter();

  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const isAccessPermission =
    session?.user.name !== "guest" &&
    router.pathname.slice(0, 6) !== "/login" &&
    router.pathname.slice(0, 9) !== "/register" &&
    router.asPath !== "/checkingServer";

  useUserInfoQuery({
    enabled: isAccessPermission && Boolean(token),
    onSuccess(data) {
      if (!data?.birth && isAccessPermission) router.push("/register/location");
    },
    onError() {
      if (!session) router.push("/login");
      else router.push("/checkingServer");
    },
  });

  return (
    <LayoutContainer>
      {token && (
        <>
          <div id="root-modal">{children}</div>
          {isGuest && <GuestBottomNav />}
        </>
      )}
      <Script
        strategy="beforeInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NEXT_PUBLIC_NAVER_CLIENT_ID}`}
      />
      <Script src="https://developers.kakao.com/sdk/js/kakao.js" />
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  color: var(--font-h1);
  background-color: var(--font-h8);
  min-height: 645px;
`;

export default Layout;
