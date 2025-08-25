import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import { AVATAR_IMAGES } from "../../../assets/images/avatarImages";
import Avatar from "../../../components/atoms/Avatar";
import { ShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import ImageSlider from "../../../components/organisms/imageSlider/ImageSlider";
import { COLOR_TABLE_LIGHT } from "../../../constants/colorConstants";
import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useErrorToast, useFailToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";
interface IRequestChangeProfileImageModalAvatar extends IModal {
  type: "dog" | "cat" | "special";
}

function RequestChangeProfileImageModalAvatar({
  type,
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

  const avatarArr =
    type === "dog"
      ? AVATAR_IMAGES.slice(0, 12)
      : type === "cat"
      ? AVATAR_IMAGES.slice(12, 23)
      : AVATAR_IMAGES.slice(24);

  const [iconIdx, setIconIdx] = useState(0);
  const [back, setBack] = useState(false);
  const [BG, setBG] = useState(0);

  // const { data: score } = usePointSystemQuery("score");

  useEffect(() => {
    if (iconIdx === 0) setBack(false);
    if (iconIdx === avatarArr.length - 1) setBack(true);
  }, [iconIdx]);

  const handleMove = (type: "prev" | "next") => {
    if (type === "prev") {
      if (iconIdx === 0) return;
      setBack(true);
      setIconIdx(iconIdx - 1);
    }
    if (type === "next") {
      if (iconIdx === avatarArr.length) return;
      setBack(false);
      setIconIdx(iconIdx + 1);
    }
  };

  const onSubmit = () => {
    if (isGuest) {
      failToast("guest");
      return;
    }
    // if (AVATAR_COST[iconIdx] > score) {
    //   failToast("free", "프로필 변경을 위한 점수가 부족해요!");
    //   return;
    // }
    setUserAvatar({ type: iconIdx + (type === "dog" ? 0 : type === "cat" ? 12 : 24), bg: BG });
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "변경",
      func: onSubmit,
    },
  };

  const typeIdx = iconIdx + (type === "dog" ? 0 : type === "cat" ? 12 : 24);

  return (
    <ModalLayout title="아바타 프로필" footerOptions={footerOptions} setIsModal={setIsModal}>
      <UpPart>
        <ArrowIcon isLeft={true} onClick={() => handleMove("prev")}>
          {iconIdx !== 0 && <ShortArrowIcon dir="left" color="black" size="lg" />}
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
            <Avatar user={{ avatar: { type: typeIdx, bg: BG } }} size="xl1" />
            {/* <IconPoint>{AVATAR_COST[iconIdx]}점 달성</IconPoint> */}
          </IconWrapper>
        </AnimatePresence>
        <ArrowIcon isLeft={false} onClick={() => handleMove("next")}>
          {iconIdx !== AVATAR_IMAGES.length - 1 && (
            <ShortArrowIcon dir="right" size="lg" color="gray" />
          )}
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
