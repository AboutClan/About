/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { createGlobalStyle } from "styled-components";

import { useToast } from "../../hooks/custom/CustomToast";
import { usePushServiceInitialize } from "../../hooks/FcmManger/mutaion";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import UserSettingPopUp from "../../pageTemplates/setting/userSetting/userSettingPopUp";
import { isPWA } from "../../utils/appEnvUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { getDeviceOS } from "../../utils/validationUtils";

function HomeInitialSetting() {
  const { data: session } = useSession();
  const toast = useToast();
  usePushServiceInitialize({
    uid: session?.user?.uid,
  });

  const { mutate } = useUserRequestMutation();

  useEffect(() => {
    if (session?.user.name !== "이승주") return;

    let sentEnvInitial = false;
    let sentEnvAfterDevice = false;
    let sentFirstMsg = false;
    let sentDeviceInfo = false;

    const send = (title: string, content: string) => {
      mutate({
        category: "건의",
        title,
        content,
      });
    };

    const hasRNWV =
      typeof window !== "undefined" && typeof (window as any).ReactNativeWebView !== "undefined";

    const envSnapshot = (label: string) => {
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "null";
      const os = getDeviceOS(); // 네 최신 로직(bridge/platform 우선 포함)으로 바꾸는 걸 권장
      const aboutBridgeType =
        typeof window !== "undefined" ? typeof (window as any).AboutAppBridge : "undefined";
      const aboutBridgePlatform =
        typeof window !== "undefined" ? (window as any).AboutAppBridge?.platform ?? "null" : "null";
      const aboutPlatform =
        typeof window !== "undefined" ? (window as any).__ABOUT_PLATFORM__ ?? "null" : "null";

      send(
        `앱접속-환경-${label}`,
        [
          `os(getDeviceOS)=${os}`,
          `ua=${ua}`,
          `hasReactNativeWebView=${hasRNWV}`,
          `__ABOUT_PLATFORM__=${aboutPlatform}`,
          `typeof AboutAppBridge=${aboutBridgeType}`,
          `AboutAppBridge.platform=${aboutBridgePlatform}`,
          `href=${typeof location !== "undefined" ? location.href : "null"}`,
        ].join(" / "),
      );
    };

    // 1) 접속 즉시: 초기 환경 리포트 1회
    if (!sentEnvInitial) {
      sentEnvInitial = true;
      envSnapshot("초기");
    }

    const onMessage = (event: any) => {
      const raw = event?.data;

      // ✅ raw가 string이 아닐 수도 있음 (일부 브릿지/브라우저)
      const rawString =
        typeof raw === "string" ? raw : raw && typeof raw === "object" ? JSON.stringify(raw) : "";

      if (!rawString || rawString === "undefined") return;

      const rawTrimmed = rawString.length > 2000 ? rawString.slice(0, 2000) + "..." : rawString;

      // 첫 메시지 1회는 무조건 기록
      if (!sentFirstMsg) {
        sentFirstMsg = true;
        send("앱접속-첫메시지", rawTrimmed);
      }

      // deviceInfo면 별도로 파싱
      let data: any = null;
      try {
        data = JSON.parse(rawString);
      } catch {
        return;
      }

      if (data?.name !== "deviceInfo") return;
      if (sentDeviceInfo) return;
      sentDeviceInfo = true;

      // ✅ 여기서라도 platform을 전역에 세팅해서 이후 getDeviceOS가 확정되게
      if (typeof window !== "undefined") {
        const platform = data.platform ?? null; // "android" | "ios"
        (window as any).__ABOUT_PLATFORM__ = platform;

        (window as any).AboutAppBridge = (window as any).AboutAppBridge || {};
        (window as any).AboutAppBridge.platform = platform;
      }

      send(
        "앱접속-deviceInfo",
        [
          `platform=${data.platform ?? "null"}`,
          `appVersion=${data.appVersion ?? "null"}`,
          `buildNumber=${data.buildNumber ?? "null"}`,
          `deviceId=${data.deviceId ?? "null"}`,
          `hasFcmToken=${typeof data.fcmToken === "string" && data.fcmToken.length > 0}`,
        ].join(" / "),
      );

      // 2) deviceInfo 수신 직후: 확정 환경 리포트 1회
      if (!sentEnvAfterDevice) {
        sentEnvAfterDevice = true;
        envSnapshot("deviceInfo후");
      }
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("message", onMessage);

    const timeout = setTimeout(() => {
      if (!sentDeviceInfo) {
        send(
          "앱접속-deviceInfo-미수신",
          [
            `6s timeout`,
            `ua=${typeof navigator !== "undefined" ? navigator.userAgent : "null"}`,
            `hasRNWV=${hasRNWV}`,
            `__ABOUT_PLATFORM__=${
              typeof window !== "undefined" ? (window as any).__ABOUT_PLATFORM__ ?? "null" : "null"
            }`,
            `AboutAppBridge.platform=${
              typeof window !== "undefined"
                ? (window as any).AboutAppBridge?.platform ?? "null"
                : "null"
            }`,
          ].join(" / "),
        );
      }

      window.removeEventListener("message", onMessage);
      document.removeEventListener("message", onMessage);
    }, 6000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      document.removeEventListener("message", onMessage);
    };
  }, [session, mutate, toast]);

  const router = useRouter();

  const isGuest = session
    ? session.user.name === "guest" || session.user.name === "게스트"
    : undefined;

  // const [isGuide, setIsGuide] = useState(false);

  const { data: userInfo } = useUserInfoQuery({
    onSuccess(data) {
      if (data.isActive === false) {
        toast("warning", "신규 가입 페이지로 이동합니다.");
        router.push("/register/name");
        return;
      }
      if (data.role === "secede") {
        toast("warning", "탈퇴한 회원입니다. 재가입 페이지로 이동합니다.");
        router.push("/register/name");
        return;
      }
      if (data.role === "newUser") {
        router.push("/register/name");
        return;
      }
      if (data.role === "waiting") {
        router.push("/register/access");
        return;
      }
      if (!data?.gender) {
        toast("error", "유저 정보에 오류가 존재합니다. 관리자에게 메세지를 남겨주세요.");
        setTimeout(() => {
          navigateExternalLink("https://pf.kakao.com/_SaWXn/chat");
        }, 1500);
      }
    },
    onError() {
      toast("warning", "로그인 정보가 없습니다.");
      router.push("/login");
    },
  });

  const { mutate: setRole } = useUserInfoFieldMutation("role", {
    onSuccess() {
      toast("success", "동아리원이 되었습니다.");
    },
  });

  useEffect(() => {
    if (!userInfo?.role) return;

    if (userInfo?.role === "block") {
      router.push("/login");
      toast("error", "활동이 영구 정지된 멤버입니다.");
      return;
    }

    if (userInfo?.role === "newUser") {
      router.push("/register/name");
      return;
    }

    if (userInfo?.role === "waiting") {
      router.push("/login?status=waiting");
      return;
    }
    if (userInfo?.role === "human") {
      const isPWALogin = isPWA();
      if (isPWALogin) {
        setRole({ role: "member" });
      }
    }
  }, [userInfo?.role]);

  // const [{ steps }, setState] = useState<{
  //   run: boolean;
  //   steps?: Step[];
  // }>({
  //   run: false,
  //   steps: STEPS_CONTENTS,
  // });
  // useEffect(() => {
  //   requestAndSubscribePushService();
  // }, []);

  // const handleJoyrideCallback = (data: CallBackProps) => {
  //   if (data.step.target === ".about_navigation1") {
  //     setRenderHomeHeaderState(false);
  //   }
  //   if (data.step.target === "body") {
  //     setRenderHomeHeaderState(true);
  //   }

  //   const { status } = data;
  //   const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

  //   if (finishedStatuses.includes(status)) {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //     setState({ run: false });
  //   }
  // };

  return (
    <>
      {userInfo && !isGuest && <UserSettingPopUp user={userInfo} />}
      <GlobalStyle />

      {/* <Joyride
        hideCloseButton={true}
        callback={handleJoyrideCallback}
        continuous
        steps={steps}
        run={isGuide}
        showSkipButton
      /> */}
    </>
  );
}

const GlobalStyle = createGlobalStyle`

  .react-joyride__tooltip{
    height:180px !important;
    padding:16px !important;
 display:flex;
 flex-direction:column;
    >div:nth-child(2){
      margin-top:auto !important;
      display:flex !important;
      align-items:flex-end !important;
    >div:first-child{
      >button{
      font-size:16px !important;
      }

    }
      >button{
        margin-left:var(--gap-2) !important;
      padding:0 !important;
        background-color:inherit !important;
        :focus{
          outline:none;
        }
        >div{
          font-size:15px;
          padding:4px 16px;
        }
      }
    }
  }
  .react-joyride__beacon {
    >span:first-child{
      background-color:var(--color-mint) !important;

    }
    >span:last-child{
    border-color:var(--color-mint) !important;
 background-color:var(--color-mint-light) !important;
      
    }
   
  }
`;

export default HomeInitialSetting;
