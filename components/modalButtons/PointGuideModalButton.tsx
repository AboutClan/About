import { Box } from "@chakra-ui/react";
import { useState } from "react";

import IconButton from "@/components/atoms/buttons/IconButton";
import InfoCol, { InfoColOptions } from "@/components/atoms/InfoCol";
import { ModalLayout } from "@/components/modals/Modals";

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
    // 출석 보상은 하한에 랜덤 보너스를 얹는 구조인데(서버 getLowBiasedRandom, 지수 10),
    // 보너스가 낮은 쪽으로 강하게 치우쳐 절반 이상이 하한만 받는다.
    // "최대 N Point"만 적어 두면 거의 매번 약속보다 적게 받는 것처럼 읽히므로,
    // 기본 금액을 앞에 두고 보너스가 드물게 크다는 사실을 함께 적는다.
    subTitle:
      "출석 포인트는 기본 금액에 랜덤 보너스가 붙어요. 보너스는 대부분 작고, 드물게 크게 나옵니다. 정규 매칭 신청은 포인트 대신 스터디 배지가 쌓여요.",
    infoArr: [
      {
        left: "스터디 출석체크 (매칭)",
        right: "100 Point + 보너스",
      },
      {
        left: "개인 스터디 인증",
        right: "30 Point + 보너스",
      },
      {
        // 매월 1일 정산. 1~5등 카공족 이용권 / 6~20등 메가커피 / 21~50등 500 포인트.
        left: "월간 스터디 배지 랭킹",
        right: "1 ~ 50등 보상 지급",
      },

      {
        left: "스터디 당일 불참",
        right: "- 1,000 ~ 2,000 Point",
        color: "red",
      },
      {
        left: "스터디 무단 불참",
        right: "- 2,000 Point",
        color: "red",
      },
      {
        // 1시간까지는 벌금이 없고, 그 뒤부터 시간당 100P씩 최대 1,000P까지.
        left: "스터디 지각 (1시간 초과)",
        right: "- 시간당 100 Point (최대 1,000)",
        color: "red",
      },
    ],
  },
  store: {
    title: "포인트 획득 방법",
    subTitle: "동아리 활동을 통해 포인트를 모을 수 있어요! 1포인트는 1원과 동일한 가치를 가집니다.",
    infoArr: [
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
