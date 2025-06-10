import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createGlobalStyle } from "styled-components";

import { useToast } from "../../hooks/custom/CustomToast";
import { usePushServiceInitialize } from "../../hooks/FcmManger/mutaion";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import UserSettingPopUp from "../../pageTemplates/setting/userSetting/userSettingPopUp";
import { isPWA } from "../../utils/appEnvUtils";

function HomeInitialSetting() {
  const { data: session } = useSession();

  usePushServiceInitialize({
    uid: session?.user?.uid,
  });

  const router = useRouter();
  const toast = useToast();

  const isGuest = session
    ? session.user.name === "guest" || session.user.name === "게스트"
    : undefined;

  // const [isGuide, setIsGuide] = useState(false);

  const { data: userInfo } = useUserInfoQuery({
    enabled: isGuest === false,
    onSuccess(data) {
      if (data.isActive === false) {
        toast("warning", "신규 가입 페이지로 이동합니다.");
        router.push("/register/name");
      }
      if (data.role === "newUser") {
        router.push("/register/name");
        return;
      }
      if (data.role === "waiting") {
        router.push("/login?status=waiting");
        return;
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

  const isPWALogin = isPWA();

  useEffect(() => {
    if (userInfo?.role === "newUser") {
      router.push("/register/name");
      return;
    }

    if (userInfo?.role === "waiting") {
      router.push("/login?status=waiting");
      return;
    }
    if (userInfo?.role === "human") {
      if (isPWALogin) {
        setRole({ role: "member" });
      }
    }
  }, [userInfo?.role]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inappdenyExecVanillajs = (callback: any) => {
      if (document.readyState !== "loading") callback();
      else document.addEventListener("DOMContentLoaded", callback);
    };
    inappdenyExecVanillajs(() => {
      const useragt = navigator.userAgent.toLowerCase();
      const targetUrl = location.href;
      if (useragt.match(/kakaotalk/i)) {
        location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(targetUrl);
      }
    });
  }, []);

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
