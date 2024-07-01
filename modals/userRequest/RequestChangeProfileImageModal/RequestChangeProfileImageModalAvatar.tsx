import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UseMutateFunction } from "react-query";
import styled from "styled-components";

import ImageSlider from "../../../components/organisms/imageSlider/ImageSlider";
import { COLOR_TABLE_LIGHT } from "../../../constants/colorConstants";
import { AVATAR_COST, AVATAR_ICON } from "../../../constants/settingValue/avatar";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import { usePointSystemQuery } from "../../../hooks/user/queries";
import { IModal } from "../../../types/components/modalTypes";
import { IAvatar } from "../../../types/models/userTypes/userInfoTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";
interface IRequestChangeProfileImageModalAvatar extends IModal {
  setUserAvatar: UseMutateFunction<
    void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AxiosError<unknown, any>,
    IAvatar,
    unknown
  >;
}

function RequestChangeProfileImageModalAvatar({
  setIsModal,
  setUserAvatar,
}: IRequestChangeProfileImageModalAvatar) {
  const { data: session } = useSession();
  const failToast = useFailToast();

  const isGuest = session?.user.name === "guest";

  const [iconIdx, setIconIdx] = useState(0);
  const [back, setBack] = useState(false);
  const [BG, setBG] = useState(0);

  const { data: score } = usePointSystemQuery("score");

  useEffect(() => {
    if (iconIdx === 0) setBack(false);
    if (iconIdx === AVATAR_ICON.length - 1) setBack(true);
  }, [iconIdx]);

  const handleMove = (type: "prev" | "next") => {
    if (type === "prev") {
      if (iconIdx === 0) return;
      setBack(true);
      setIconIdx(iconIdx - 1);
    }
    if (type === "next") {
      if (iconIdx === AVATAR_ICON.length) return;
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
            <Icon bg={COLOR_TABLE_LIGHT[BG]}>
              <Image width={80} height={80} src={AVATAR_ICON[iconIdx]} alt="avatar" />
            </Icon>
            <IconPoint>{AVATAR_COST[iconIdx]}점 달성</IconPoint>
          </IconWrapper>
        </AnimatePresence>
        <ArrowIcon isLeft={false} onClick={() => handleMove("next")}>
          {iconIdx !== AVATAR_ICON.length - 1 && <i className="fa-solid fa-chevron-right" />}
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

const Icon = styled.div<{ bg: string }>`
  width: 100px;
  height: 100px;
  margin-bottom: var(--gap-3);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${(props) => props.bg};
`;

const IconPoint = styled.div`
  color: var(--color-mint);
`;

const variants = {
  entry: (isBack: boolean) => ({
    x: isBack ? -200 : 200,
    opacity: 0,
    scale: 0.5,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: (isBack: boolean) => ({
    x: isBack ? 200 : -200,
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.4 },
  }),
};
export default RequestChangeProfileImageModalAvatar;
