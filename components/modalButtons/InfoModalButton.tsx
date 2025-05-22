import { Box } from "@chakra-ui/react";
import { useState } from "react";

import { ModalLayout } from "../../modals/Modals";
import IconButton from "../atoms/buttons/IconButton";
import InfoList from "../atoms/lists/InfoList";

type InfoType = "study" | "gather" | "group";

interface InfoModalButtonProps {
  type: InfoType;
}

function InfoModalButton({ type }: InfoModalButtonProps) {
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <IconButton onClick={() => setIsModal(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 20 20"
          fill="none"
        >
          <g clipPath="url(#clip0_2444_1052)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 7.66671C9.73479 7.66671 9.48044 7.56135 9.2929 7.37381C9.10537 7.18628 9.00001 6.93192 9.00001 6.66671C9.00001 6.40149 9.10537 6.14714 9.2929 5.9596C9.48044 5.77206 9.73479 5.66671 10 5.66671C10.2652 5.66671 10.5196 5.77206 10.7071 5.9596C10.8947 6.14714 11 6.40149 11 6.66671C11 6.93192 10.8947 7.18628 10.7071 7.37381C10.5196 7.56135 10.2652 7.66671 10 7.66671ZM10.8333 13.8625C10.8333 14.0836 10.7455 14.2955 10.5893 14.4518C10.433 14.6081 10.221 14.6959 10 14.6959C9.779 14.6959 9.56704 14.6081 9.41076 14.4518C9.25447 14.2955 9.16668 14.0836 9.16668 13.8625V9.69587C9.16668 9.47486 9.25447 9.2629 9.41076 9.10662C9.56704 8.95034 9.779 8.86254 10 8.86254C10.221 8.86254 10.433 8.95034 10.5893 9.10662C10.7455 9.2629 10.8333 9.47486 10.8333 9.69587V13.8625ZM10 0.833374C4.93751 0.833374 0.833344 4.93754 0.833344 10C0.833344 15.0625 4.93751 19.1667 10 19.1667C15.0625 19.1667 19.1667 15.0625 19.1667 10C19.1667 4.93754 15.0625 0.833374 10 0.833374Z"
              fill="var(--color-icon)"
            />
          </g>
          <defs>
            <clipPath id="clip0_2444_1052">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </IconButton>
      {isModal && <InfoModal type={type} onClose={() => setIsModal(false)} />}
    </>
  );
}

interface InfoModalProps {
  type: InfoType;
  onClose: () => void;
}

function InfoModal({ type, onClose }: InfoModalProps) {
  const content = INFO_MODAL_CONTENTS[type];

  return (
    <ModalLayout title={content.title} setIsModal={onClose} footerOptions={{}}>
      <InfoModalSubTitle type={type} />
      <InfoList items={content.items} />
    </ModalLayout>
  );
}

function InfoModalSubTitle({ type }: { type: InfoType }) {
  return (
    <Box mb={3}>
      {type === "study" ? (
        <>
          <b>동네 친구</b>와 함께하는 <b>카공 스터디 !</b>
          <br /> 공부도 하고, 기록도 쌓고, 상품도 받아가세요!
        </>
      ) : type === "gather" ? (
        <>
          하고 싶은 활동을, 또래 친구들과, 원하는 순간에.
          <br /> 자유롭게 즐길 수 있는 <b>About 소셜링</b>
        </>
      ) : (
        <>
          같은 관심사를 가진 친구들과 함께하는
          <br />
          하나의 작은 동아리, <b>About 소모임</b>
        </>
      )}
    </Box>
  );
}

const INFO_MODAL_CONTENTS: Record<InfoType, { title: string; items: string[] }> = {
  study: {
    title: "스터디 가이드",
    items: [
      "원하는 날짜와 시간을 선택해 신청하세요!",
      "실시간으로 매칭 현황을 확인할 수 있습니다.",
      "오전 9시에 스터디 매칭 결과가 확정됩니다.",
    ],
  },
  gather: {
    title: "소셜링 가이드",
    items: [
      "주제, 인원, 나이 등을 설정할 수 있습니다.",
      "모임장은 최대 50,000원을 지원 받습니다.",
      "모임 참여에는 번개 참여권이 소모됩니다.",
    ],
  },
  group: {
    title: "소모임 가이드",
    items: [
      "관심사에 맞게 지속해서 활동할 수 있습니다.",
      "모임장은 월 최대 50,000원을 지원 받습니다.",
      "모임 참여에는 소모임 참여권이 소모됩니다.",
    ],
  },
};

export default InfoModalButton;
