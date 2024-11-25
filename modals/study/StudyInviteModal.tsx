import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import { WEB_URL } from "../../constants/system";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { StudyPlaceProps } from "../../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { isWebView } from "../../utils/appEnvUtils";
import { getRandomIdx } from "../../utils/mathUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_JS;

interface IStudyInviteModal extends IModal {
  place: StudyPlaceProps | PlaceInfoProps;
}

function StudyInviteModal({ setIsModal, place }: IStudyInviteModal) {
  const { data: session } = useSession();

  const router = useRouter();
  const randomNum = Math.floor(Math.random() * 3);
  const url = WEB_URL + router?.asPath + "/" + session?.user?.uid;

  const [isRenderingCheck, setIsRenderingCheck] = useState(false);

  const location = (place as StudyPlaceProps)?.locationDetail || (place as PlaceInfoProps)?.address;

  const handleShareOnApp = () => {
    if (!isWebView()) return;

    nativeMethodUtils.share(url);
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.Kakao &&
      !window.Kakao.isInitialized() &&
      !isWebView()
    ) {
      window.Kakao.init(kakaoAppKey);
    }
    setIsRenderingCheck(true);
  }, []);

  useEffect(() => {
    if (!isRenderingCheck) return;

    if (window.Kakao && !isWebView()) {
      const options = {
        container: "#kakao-share-button-invite",
        objectType: "location",
        content: {
          title: "같이 스터디 할래?",
          description: (place as StudyPlaceProps)?.fullname || (place as PlaceInfoProps)?.name,
          imageUrl:
            (place as StudyPlaceProps)?.coverImage ||
            STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)],
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
        address: location,

        buttons: [
          {
            title: "웹으로 이동",
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      };

      window.Kakao.Link.createDefaultButton(options);
    }
  }, [isRenderingCheck, location, place, randomNum, url]);

  const footerOptions: IFooterOptions = {
    children: (
      <ButtonLayout>
        <Button
          bg="white"
          h="100%"
          border="1.2px solid var(--color-mint)"
          color="var(--color-mint)"
          fontSize="16px"
          onClick={() => setIsModal(false)}
        >
          닫기
        </Button>
        <Button
          bg="var(--color-mint)"
          h="100%"
          color="white"
          fontSize="16px"
          disabled={false}
          id="kakao-share-button-invite"
          onClick={handleShareOnApp}
        >
          친구초대
        </Button>
      </ButtonLayout>
    ),
  };

  return (
    <ModalLayout footerOptions={footerOptions} setIsModal={setIsModal} title="친구 초대">
      <ModalSubtitle>
        친구 초대를 통해 참여하면 초대한 인원과 참여한 인원 모두 2 point를 받아요!
      </ModalSubtitle>
    </ModalLayout>
  );
}

const ButtonLayout = styled.div`
  width: 100%;
  display: flex;
  height: 46px;
  > button:first-child {
    margin-right: var(--gap-3);
  }
  > button {
    flex: 1;
  }
  > button:last-child {
    :hover {
      background-color: var(--color-mint);
    }
  }
`;

export default StudyInviteModal;
