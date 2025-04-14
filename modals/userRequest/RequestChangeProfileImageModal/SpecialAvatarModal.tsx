import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import { AVATAR_BG_IMAGES } from "../../../assets/images/avatarBgImages";
import Avatar from "../../../components/atoms/Avatar";
import ImageSlider from "../../../components/organisms/imageSlider/ImageSlider";
import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useErrorToast, useFailToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
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

  const isGuest = session?.user.name === "guest";

  const [BG, setBG] = useState(0);

  const { data: userInfo } = useUserInfoQuery();

  const myAvatar = userInfo?.avatar;

  useEffect(() => {
    if (myAvatar) {
      setBG(myAvatar.bg);
    } else {
      setBG(100);
    }
  }, [myAvatar]);

  const onSubmit = () => {
    if (isGuest) {
      failToast("guest");
      return;
    }

    setUserAvatar({ type: myAvatar.type, bg: BG });

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
        <AnimatePresence>
          <IconWrapper variants={variants} initial="entry" animate="center" exit="exit">
            <Avatar
              avatar={{
                bg: BG,
                type: userInfo?.avatar.type,
              }}
              size="xl"
            />
            <IconPoint>현재 프로필</IconPoint>
          </IconWrapper>
        </AnimatePresence>
      </UpPart>
      <DownPart>
        <ImageSlider
          type="specialBg"
          imageContainer={AVATAR_BG_IMAGES}
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
