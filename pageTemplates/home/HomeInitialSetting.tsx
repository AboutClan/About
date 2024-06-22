import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useSetRecoilState } from "recoil";
import { createGlobalStyle } from "styled-components";

import PCBottomNav from "../../components/layouts/PCBottomNav";
import { STEPS_CONTENTS } from "../../constants/contentsText/GuideContents";
import { USER_GUIDE } from "../../constants/keys/localStorage";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getStudyDateStatus } from "../../libs/study/date/getStudyDateStatus";
import FAQPopUp from "../../modals/pop-up/FAQPopUp";
import UserSettingPopUp from "../../pageTemplates/setting/userSetting/userSettingPopUp";
import { renderHomeHeaderState } from "../../recoils/renderRecoils";
import { studyDateStatusState } from "../../recoils/studyRecoils";
import { checkAndSetLocalStorage } from "../../utils/storageUtils";
import { detectDevice } from "../../utils/validationUtils";
function HomeInitialSetting() {
  const toast = useToast();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const isGuest = session?.user.name === "guest";

  const [isGuide, setIsGuide] = useState(false);
  const [isGuestModal, setIsGuestModal] = useState(false);

  const { data: userInfo } = useUserInfoQuery({ enabled: !isGuest });

  const setStudyDateStatus = useSetRecoilState(studyDateStatusState);
  const setRenderHomeHeaderState = useSetRecoilState(renderHomeHeaderState);

  const { mutate: setRole } = useUserInfoFieldMutation("role", {
    onSuccess() {
      toast("success", "동아리원이 되었습니다.");
    },
  });
  const isPWA = () => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    return isStandalone;
  };

  const isPWALogin = isPWA();

  useEffect(() => {
    if (userInfo?.role === "human") {
      if (isPWALogin) {
        setRole({ role: "member" });
      }
    }
  }, [userInfo?.role, isPWALogin]);

  useEffect(() => {
    setStudyDateStatus(getStudyDateStatus(dateParam));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateParam]);

  useEffect(() => {
    if (isGuest && !checkAndSetLocalStorage(USER_GUIDE, 1)) {
      setIsGuestModal(true);
      setIsGuide(true);
    }
    if (userInfo) {
      if (dayjs().diff(dayjs(userInfo?.registerDate)) <= 7) {
        if (!checkAndSetLocalStorage(USER_GUIDE, 3)) setIsGuide(true);
      } else if (!checkAndSetLocalStorage(USER_GUIDE, 14)) setIsGuide(true);
    }
  }, [isGuest, userInfo]);

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

  const [{ steps }, setState] = useState<{
    run: boolean;
    steps?: Step[];
  }>({
    run: false,
    steps: STEPS_CONTENTS,
  });

  const handleJoyrideCallback = (data: CallBackProps) => {
    if (data.step.target === ".about_navigation1") {
      setRenderHomeHeaderState(false);
    }
    if (data.step.target === "body") {
      setRenderHomeHeaderState(true);
    }

    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setState({ run: false });
    }
  };

  return (
    <>
      {userInfo && !isGuest && <UserSettingPopUp cnt={isGuide ? 1 : 0} />}
      {isGuestModal && <FAQPopUp setIsModal={setIsGuestModal} />}
      <GlobalStyle />
      {!isPWALogin && detectDevice() !== "PC" && <PCBottomNav />}
      <Joyride
        hideCloseButton={true}
        callback={handleJoyrideCallback}
        continuous
        steps={steps}
        run={isGuide}
        showSkipButton
      />
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
