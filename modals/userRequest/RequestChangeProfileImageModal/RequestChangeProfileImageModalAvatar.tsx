import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import ImageSlider from "../../../components/organisms/imageSlider/ImageSlider";
import { COLOR_TABLE_LIGHT } from "../../../constants/colorConstants";
import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useErrorToast, useFailToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { usePointSystemQuery } from "../../../hooks/user/queries";
import { AVATAR_COST, AVATAR_IMAGE_ARR } from "../../../storage/avatarStorage";
import { IModal } from "../../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";
interface IRequestChangeProfileImageModalAvatar extends IModal {}

function RequestChangeProfileImageModalAvatar({
  setIsModal,
}: IRequestChangeProfileImageModalAvatar) {
  const { data: session } = useSession();

  const errorToast = useErrorToast();
  const failToast = useFailToast();

  const queryClient = useQueryClient();

  const { mutate: setUserAvatar } = useUserInfoFieldMutation("avatar", {
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      setIsModal(false);
    },
    onError: errorToast,
  });

  const isGuest = session?.user.name === "guest";

  const [iconIdx, setIconIdx] = useState(0);
  const [back, setBack] = useState(false);
  const [BG, setBG] = useState(0);

  const { data: score } = usePointSystemQuery("score");

  useEffect(() => {
    if (iconIdx === 0) setBack(false);
    if (iconIdx === AVATAR_IMAGE_ARR.length - 1) setBack(true);
  }, [iconIdx]);

  const handleMove = (type: "prev" | "next") => {
    if (type === "prev") {
      if (iconIdx === 0) return;
      setBack(true);
      setIconIdx(iconIdx - 1);
    }
    if (type === "next") {
      if (iconIdx === AVATAR_IMAGE_ARR.length) return;
      setBack(false);
      setIconIdx(iconIdx + 1);
    }
  };

  const onSubmit = () => {
    if (isGuest) {
      failToast("guest");
      return;
    }
    if (AVATAR_COST[iconIdx] > score) {
      failToast("free", "프로필 변경을 위한 점수가 부족해요!");
      return;
    }
    setUserAvatar({ type: iconIdx, bg: BG });
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "변경",
      func: onSubmit,
    },
  };

  return (
    <ModalLayout title="아바타 프로필" footerOptions={footerOptions} setIsModal={setIsModal}>
      <UpPart>
        <ArrowIcon isLeft={true} onClick={() => handleMove("prev")}>
          {iconIdx !== 0 && <i className="fa-solid fa-chevron-left" />}
        </ArrowIcon>
        <AnimatePresence>
          <IconWrapper
            custom={back}
            variants={variants}
            initial="entry"
            animate="center"
            exit="exit"
            key={iconIdx}
          >
            <Avatar avatar={{ type: iconIdx, bg: BG }} size="xl" />

            <IconPoint>{AVATAR_COST[iconIdx]}점 달성</IconPoint>
          </IconWrapper>
        </AnimatePresence>
        <ArrowIcon isLeft={false} onClick={() => handleMove("next")}>
          {iconIdx !== AVATAR_IMAGE_ARR.length - 1 && <i className="fa-solid fa-chevron-right" />}
        </ArrowIcon>
      </UpPart>
      <DownPart>
        <ImageSlider
          type="avatarColor"
          imageContainer={COLOR_TABLE_LIGHT}
          onClick={(idx) => setBG(idx)}
        />
      </DownPart>
    </ModalLayout>
  );
}

const UpPart = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ArrowIcon = styled.div<{ isLeft: boolean }>`
  position: absolute;
  left: ${(props) => props.isLeft && "0"};
  right: ${(props) => !props.isLeft && "0"};
  top: 50%;
  transform: translate(0, -50%);
`;

const DownPart = styled.div`
  display: flex;
  align-items: center;
  padding: var(--gap-2) 0;
  margin-top: var(--gap-3);
  border-top: var(--border);
  border-bottom: var(--border);
`;

const IconPoint = styled.div`
  color: var(--color-mint);
  font-size: 11px;
  margin-top: 12px;
  font-weight: 600;
`;

const variants = {
  entry: (isBack: boolean) => ({
    x: isBack ? -100 : 100,
    opacity: 0,
    scale: 0.3,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: (isBack: boolean) => ({
    x: isBack ? 100 : -100,
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.3 },
  }),
};
export default RequestChangeProfileImageModalAvatar;
