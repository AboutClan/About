/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";

import ForceUpdateModal from "../../components/overlay/UpdateModal";
import { useToast } from "../../hooks/custom/CustomToast";
import { usePushServiceInitialize } from "../../hooks/FcmManger/mutaion";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import UserSettingPopUp from "../../pageTemplates/setting/userSetting/userSettingPopUp";
import { isPWA } from "../../utils/appEnvUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";

function HomeInitialSetting() {
  const { data: session } = useSession();
  const toast = useToast();

  const [isLegacyApp, setIsLegacyApp] = useState(false);
  const compareSemver = (a: string, b: string) => {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);

    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
      const va = pa[i] || 0;
      const vb = pb[i] || 0;
      if (va > vb) return 1;
      if (va < vb) return -1;
    }
    return 0;
  };
  usePushServiceInitialize({
    uid: session?.user?.uid,
  });
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;

      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data?.name !== "deviceInfo") return;

      const { platform, appVersion } = data;

      if (!platform || !appVersion) return;

      // ✅ Android <= 1.3.32
      if (platform === "android" && compareSemver(appVersion, "1.3.32") <= 0) {
        setIsLegacyApp(true);
        return;
      }

      if (platform === "ios" && compareSemver(appVersion, "1.1.5") <= 0) {
        setIsLegacyApp(true);
        return;
      }

      setIsLegacyApp(false);
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("message", onMessage);
    };
  }, []);
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
      {userInfo && !isGuest && !isLegacyApp && <UserSettingPopUp user={userInfo} />}
      <GlobalStyle />
      {isLegacyApp && <ForceUpdateModal onClose={() => setIsLegacyApp(false)} />}

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
