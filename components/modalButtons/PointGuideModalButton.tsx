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

export function PointGuideModal({ type, onClose }: PointGuideModalProps) {
  const content = POINT_GUIDE_MODAL_CONTENT[type];

  return (
    <ModalLayout title={content.title} setIsModal={onClose} footerOptions={{}}>
      <PointGuideModalSubTitle type={type} />
      <InfoCol infoArr={content.infoArr} isMint />
    </ModalLayout>
  );
}

function PointGuideModalSubTitle({ type }: { type: PointGuideType }) {
  return (
    <Box mb={3}>
      {type === "store" ? (
        <>
          동아리 활동을 통해 <b>포인트</b>를 적립할 수 있어요!
          <br /> <b>100 포인트</b>는 현금 <b>100원</b>과 동일합니다.
        </>
      ) : (
        <>
          스터디 참여하면 <b>포인트</b>를 준다고?!
          <br /> 공부도 하고, 기록도 쌓고, 보상금도 받아가세요!
        </>
      )}
    </Box>
  );
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
        right: "기본 100 Point",
      },
      {
        left: "스터디 출석체크 (매칭)",
        right: "최대 1,000 Point",
      },
      {
        left: "개인 스터디 인증",
        right: "최대 500 Point",
      },
      {
        left: "월간 스터디 랭킹 정산",
        right: "+ 1000 ~ 5000 Point",
      },

      // {
      //   left: "스터디 지각",
      //   right: "- 50 Point",
      //   color: "red",
      // },
      // {
      //   left: "스터디 당일 불참",
      //   right: "- 500 Point",
      //   color: "red",
      // },
      // {
      //   left: "스터디 당일 잠수",
      //   right: "- 1000 Point",
      //   color: "red",
      // },
    ],
  },
  store: {
    title: "포인트 획득 방법",
    subTitle: "동아리 활동을 통해 포인트를 모을 수 있어요! 1포인트는 1원과 동일한 가치를 가집니다.",
    infoArr: [
      {
        left: "스터디 매칭 신청",
        right: "기본 100 Point",
      },
      {
        left: "스터디 출석체크 (매칭)",
        right: "200 - 1,000 Point",
      },
      {
        left: "스터디 출석체크 (그외)",
        right: "100 - 500 Point",
      },
      {
        left: "개인 공부 인증",
        right: "50 - 500 Point",
      },
      {
        left: "월간 랭킹 정산",
        right: "1,000 - 5,000 Point",
      },
      {
        left: "일일 출석체크 수집 보상",
        right: "2,000 - 3000 Point",
      },
      {
        left: "모임 개설 & 후기 작성",
        right: "2,000 Point",
      },
      {
        left: "모임장/서포터즈 정산",
        right: "최대 70,000 Point",
      },
    ],
  },
};

export default PointGuideModalButton;
