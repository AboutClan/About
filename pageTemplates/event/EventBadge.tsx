import { Box } from "@chakra-ui/react";
import { useState } from "react";

import AlertNotCompletedModal from "../../components/AlertNotCompletedModal";
import IconButtonColBlock, {
  IIconButtonColBlockProps,
} from "../../components/atoms/blocks/IconButtonColBlock";
import SectionBar from "../../components/molecules/bars/SectionBar";
import BlockSlider from "../../components/organisms/sliders/BlockSlider";
import { BADGE_INFO, USER_EVENT_BADGE_ARR } from "../../constants/serviceConstants/badgeConstants";
import {
  EVENT_BADGE_딸기스무디,
  EVENT_BADGE_라벤더,
  EVENT_BADGE_민트초코,
} from "../../constants/storage/eventBadgeUser";
import { useUserInfoQuery } from "../../hooks/user/queries";

export default function EventBadge() {
  const { data: userInfo } = useUserInfoQuery();
  const score = userInfo?.score;
  const [isModal, setIsModal] = useState(false);
  const blockArr: IIconButtonColBlockProps[] = BADGE_INFO.map((badge, idx) => {
    const hasBadge = score >= badge.minScore;
    return {
      icon: hasBadge ? (
        <i className="fa-duotone fa-lock-open" style={{ color: "var(--color-orange)" }} />
      ) : (
        <i className="fa-duotone fa-lock" style={{ color: "var(--gray-600)" }} />
      ),
      title: badge.badge,
      buttonProp: {
        text: `${(idx + 1) * 10} POINT`,
        func: () => setIsModal(true),
      },
      disabled: !hasBadge,
    };
  });

  const eventArr: IIconButtonColBlockProps[] = USER_EVENT_BADGE_ARR.map((badge) => {
    const hasBadge =
      badge === "딸기스무디"
        ? EVENT_BADGE_딸기스무디.includes(userInfo?.uid)
        : badge === "라벤더"
          ? EVENT_BADGE_라벤더.includes(userInfo?.uid)
          : badge === "민트초코"
            ? EVENT_BADGE_민트초코.includes(userInfo?.uid)
            : false;

    return {
      icon: !hasBadge ? (
        <i className="fa-duotone fa-lock" style={{ color: "var(--gray-600)" }} />
      ) : (
        <i className="fa-duotone fa-lock-open" style={{ color: "var(--color-orange)" }} />
      ),
      title: badge,
      buttonProp: {
        text: " 100 POINT",
        func: () => setIsModal(true),
      },
      disabled: !hasBadge,
    };
  });

  const BlocksComponents = [...blockArr, ...eventArr].map((block, idx) => (
    <IconButtonColBlock props={block} key={idx} />
  ));

  return (
    <>
      <SectionBar title="배지를 해금하고 포인트를 받아봐요!" size="md" />
      <Box py="16px" pl="16px">
        <BlockSlider blocks={BlocksComponents} slidesPerView={2.4} />
      </Box>

      {isModal && <AlertNotCompletedModal setIsModal={setIsModal} />}
    </>
  );
}
