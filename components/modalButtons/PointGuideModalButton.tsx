import { Box } from "@chakra-ui/react";
import { useState } from "react";

import { ModalLayout } from "../../modals/Modals";
import IconButton from "../atoms/buttons/IconButton";
import InfoCol, { InfoColOptions } from "../atoms/InfoCol";

type PointGuideType = "study" | "store";

interface PointGuideModalButtonProps {
  type: PointGuideType;
}

function PointGuideModalButton({ type }: PointGuideModalButtonProps) {
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <IconButton onClick={() => setIsModal(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="26px"
          viewBox="0 -960 960 960"
          width="26px"
          fill="var(--color-icon)"
        >
          <path d="M480-520q150 0 255-47t105-113q0-66-105-113t-255-47q-150 0-255 47T120-680q0 66 105 113t255 47Zm0 100q41 0 102.5-8.5T701-456q57-19 98-49.5t41-74.5v100q0 44-41 74.5T701-356q-57 19-118.5 27.5T480-320q-41 0-102.5-8.5T259-356q-57-19-98-49.5T120-480v-100q0 44 41 74.5t98 49.5q57 19 118.5 27.5T480-420Zm0 200q41 0 102.5-8.5T701-256q57-19 98-49.5t41-74.5v100q0 44-41 74.5T701-156q-57 19-118.5 27.5T480-120q-41 0-102.5-8.5T259-156q-57-19-98-49.5T120-280v-100q0 44 41 74.5t98 49.5q57 19 118.5 27.5T480-220Z" />
        </svg>
      </IconButton>
      {isModal && <PointGuideModal type={type} onClose={() => setIsModal(false)} />}
    </>
  );
}

interface PointGuideModalProps {
  type: PointGuideType;
  onClose: () => void;
}

function PointGuideModal({ type, onClose }: PointGuideModalProps) {
  const content = POINT_GUIDE_MODAL_CONTENT[type];

  return (
    <ModalLayout title={content.title} setIsModal={onClose} footerOptions={{}}>
      <PointGuideModalSubTitle type={type} />
      <InfoCol infoArr={content.infoArr} isMint />
    </ModalLayout>
  );
}

function PointGuideModalSubTitle({ type }: { type: PointGuideType }) {
  return <Box mb={3}>
    {type === "store" ? (
      <>
        동아리 활동을 통해 <b>포인트</b>를 획득할 수 있습니다.
        <br /> <b>1포인트</b>는 <b>1원</b>과 동일한 가치를 가집니다.
      </>
    ) : (
      <>
        스터디에 참여하면 <b>포인트</b>를 획득할 수 있습니다.
        <br /> 공부도 하고, 기록도 쌓고, 보상금도 받아가세요!
      </>
    )}
  </Box>
}

const POINT_GUIDE_MODAL_CONTENT: Record<
  PointGuideType,
  { title: string; subTitle: string; infoArr: InfoColOptions[] }
> = {
  study: {
    title: "스터디 포인트 획득 및 벌금",
    subTitle: "",
    infoArr: [
      {
        left: "스터디 매칭 신청",
        right: "+ 50원",
      },
      {
        left: "개인 스터디 참여",
        right: "+ 30원",
      },
      {
        left: "신규 카공 카페 등록",
        right: "+ 100원",
      },
      {
        left: "월간 스터디 랭킹 정산",
        right: "+ 1000 ~ 5000원",
      },

      {
        left: "스터디 지각",
        right: "- 50원",
        color: "red",
      },
      {
        left: "스터디 당일 불참",
        right: "- 500원",
        color: "red",
      },
      {
        left: "스터디 당일 잠수",
        right: "- 1000원",
        color: "red",
      },
    ],
  },
  store: {
    title: "포인트 획득 방법",
    subTitle:
      "동아리 활동을 통해 포인트를 획득할 수 있습니다. 1포인트는 1원과 동일한 가치를 가집니다.",
    infoArr: [
      {
        left: "스터디 사전 투표",
        right: "+ 5 Point",
      },
      {
        left: "스터디 출석체크",
        right: "+ 5 Point",
      },
      {
        left: "번개 모임 참여",
        right: "+ 5 Point",
      },
      {
        left: "일일 출석체크",
        right: "+ 2 Point",
      },
      {
        left: "건의하기",
        right: "+ 5 Point",
      },
      {
        left: "피드 좋아요 누르기",
        right: "+ 2 Point",
      },
      {
        left: "함께한 멤버 좋아요 보내기",
        right: "+ 2 Point",
      },
      {
        left: "피드(번개,소모임) 올리기",
        right: "+ 100 Point",
      },
      {
        left: "번개 모임 개설",
        right: "+ 200 Point",
      },
      {
        left: "동아리 홍보 글 올리기",
        right: "+ 200 Point",
      },
    ],
  },
};

export default PointGuideModalButton;
