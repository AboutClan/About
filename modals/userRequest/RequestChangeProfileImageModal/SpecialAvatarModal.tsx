import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import ImageSlider from "../../../components/organisms/imageSlider/ImageSlider";
import { USER_INFO } from "../../../constants/keys/queryKeys";
import {
  SPECIAL_AVATAR_PERMISSION,
  SPECIAL_BG_PERMISSION,
} from "../../../constants/serviceConstants/AvatarConstants";
import { useErrorToast, useFailToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { SPECIAL_AVATAR, SPECIAL_BG } from "../../../storage/avatarStorage";
import { IModal } from "../../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";

interface ISpecialAvatarModal extends IModal {}

function SpecialAvatarModal({ setIsModal }: ISpecialAvatarModal) {
  const { data: session } = useSession();
  const failToast = useFailToast();

  const typeToast = useTypeToast();
  const errorToast = useErrorToast();

  const queryClient = useQueryClient();

  const { mutate: setUserAvatar } = useUserInfoFieldMutation("avatar", {
    onSuccess() {
      typeToast("change");
      queryClient.invalidateQueries([USER_INFO]);
      setIsModal(false);
    },
    onError: errorToast,
  });

  const uid = session?.user.uid;

  const isGuest = session?.user.name === "guest";

  const [iconIdx, setIconIdx] = useState(0);
  const [back, setBack] = useState(false);
  const [BG, setBG] = useState(0);

  const { data: userInfo } = useUserInfoQuery();

  const myAvatar = userInfo?.avatar;

  useEffect(() => {
    if (myAvatar) {
      setIconIdx(myAvatar.type);
      setBG(myAvatar.bg);
    } else {
      setIconIdx(100);
      setBG(100);
    }
  }, [myAvatar]);

  useEffect(() => {
    if (iconIdx < 100) setBack(false);
    if (iconIdx === SPECIAL_AVATAR.length + 100) setBack(true);
  }, [iconIdx]);

  const handleMove = (type: "prev" | "next") => {
    if (type === "prev") {
      if (iconIdx === 0) return;
      setBack(true);
      setIconIdx(iconIdx - 1);
    }
    if (type === "next") {
      if (iconIdx === SPECIAL_AVATAR.length + 1) return;
      setBack(false);
      setIconIdx(iconIdx < 100 ? 100 : iconIdx + 1);
    }
  };

  const onSubmit = () => {
    if (isGuest) {
      failToast("guest");
      return;
    }
    if (iconIdx === 0 && BG === 0) {
      setIsModal(false);
      return;
    }
    if (iconIdx >= 100) {
      if (!SPECIAL_AVATAR_PERMISSION[iconIdx - 100].includes(uid)) {
        failToast("free", "해당 아바타를 소유하고 있지 않습니다.");
        return;
      }
    }
    if (BG >= 100) {
      if (!SPECIAL_BG_PERMISSION[iconIdx - 100].includes(uid)) {
        failToast("free", "해당 배경을 소유하고 있지 않습니다.");
        return;
      }
    }
    if (iconIdx >= 100 || BG >= 100) {
      setUserAvatar({ type: iconIdx, bg: BG });
    }
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "변경",
      func: onSubmit,
    },
  };

  return (
    <ModalLayout title="스페셜 아바타 / 배경" footerOptions={footerOptions} setIsModal={setIsModal}>
      <UpPart>
        <ArrowIcon isLeft={true} onClick={() => handleMove("prev")}>
          {iconIdx >= 100 && <i className="fa-solid fa-chevron-left" />}
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
            <Avatar
              avatar={{
                bg: BG,
                type: iconIdx,
              }}
              size="xl"
            />
            <IconPoint>
              {iconIdx < 100
                ? "현재 프로필"
                : iconIdx < 102
                ? "스토어 한정 구매"
                : "이벤트 한정 획득"}
            </IconPoint>
          </IconWrapper>
        </AnimatePresence>
        <ArrowIcon isLeft={false} onClick={() => handleMove("next")}>
          {iconIdx !== SPECIAL_AVATAR.length + 99 && <i className="fa-solid fa-chevron-right" />}
        </ArrowIcon>
      </UpPart>
      <DownPart>
        <ImageSlider
          type="specialBg"
          imageContainer={SPECIAL_BG}
          onClick={(idx) => setBG(idx + 100)}
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
export default SpecialAvatarModal;
