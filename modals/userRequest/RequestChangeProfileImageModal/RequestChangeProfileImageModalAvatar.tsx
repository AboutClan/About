import { Box, Button, chakra, Flex, shouldForwardProp } from "@chakra-ui/react";
import { AnimatePresence, isValidMotionProp, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { AVATAR_BG_IMAGES } from "../../../assets/images/avatarBgImages";
import { AVATAR_IMAGES } from "../../../assets/images/avatarImages";
import Avatar from "../../../components/atoms/Avatar";
import { ShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import ImageSlider from "../../../components/organisms/imageSlider/ImageSlider";
import { COLOR_TABLE_LIGHT } from "../../../constants/colorConstants";
import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useErrorToast, useFailToast } from "../../../hooks/custom/CustomToast";
import { useCheckGuest } from "../../../hooks/custom/UserHooks";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { AvatarProps } from "../../../types/models/userTypes/userInfoTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";

interface IRequestChangeProfileImageModalAvatar extends IModal {
  defaultAvatar?: AvatarProps;
  setAvatar?: DispatchType<AvatarProps>;
}

const TAB_CONFIG = {
  댕댕이: {
    start: 0,
    end: 12,
  },
  똑냥이: {
    start: 12,
    end: 23,
  },
  유니크: {
    start: 24,
    end: AVATAR_IMAGES.length,
  },
} as const;

type Tab = keyof typeof TAB_CONFIG;
const TAB_LIST = Object.keys(TAB_CONFIG) as Tab[];

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

function RequestChangeProfileImageModalAvatar({
  setIsModal,
  defaultAvatar,
  setAvatar,
}: IRequestChangeProfileImageModalAvatar) {
  const queryClient = useQueryClient();
  const errorToast = useErrorToast();
  const failToast = useFailToast();
  const isGuest = useCheckGuest();

  const { mutate: setUserAvatar } = useUserInfoFieldMutation("avatar", {
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      setIsModal(false);
    },
    onError: errorToast,
  });

  const [tab, setTab] = useState<Tab>("댕댕이");
  const [iconIdx, setIconIdx] = useState(defaultAvatar?.type || 0);
  const [back, setBack] = useState(false);
  const [bg, setBg] = useState(defaultAvatar?.bg || 0);

  useEffect(() => {
    if (defaultAvatar) {
      const type = defaultAvatar?.type;
      if (type >= 12 && type <= 23) {
        setTab("똑냥이");
      } else if (type >= 24) {
        setTab("유니크");
      }
    }
  }, [defaultAvatar]);

  const currentTabConfig = TAB_CONFIG[tab];

  const avatarArr = useMemo(() => {
    return AVATAR_IMAGES.slice(currentTabConfig.start, currentTabConfig.end);
  }, [currentTabConfig]);

  const typeIdx = currentTabConfig.start + iconIdx;

  const canGoPrev = iconIdx > 0;
  const canGoNext = iconIdx < avatarArr.length - 1;

  useEffect(() => {
    if (iconIdx > avatarArr.length - 1) {
      setIconIdx(0);
    }
  }, [avatarArr.length, iconIdx]);

  const handleTabClick = (nextTab: Tab) => {
    setTab(nextTab);
    setIconIdx(0);
    setBack(false);
  };

  const handleMove = (direction: "prev" | "next") => {
    if (direction === "prev" && canGoPrev) {
      setBack(true);
      setIconIdx((prev) => prev - 1);
      return;
    }

    if (direction === "next" && canGoNext) {
      setBack(false);
      setIconIdx((prev) => prev + 1);
    }
  };

  const onSubmit = () => {
    if (isGuest) {
      failToast("guest");
      return;
    }
    if (defaultAvatar) {
      setAvatar({
        type: typeIdx,
        bg,
      });
      setIsModal(false);
      return;
    }

    setUserAvatar({
      type: typeIdx,
      bg,
    });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: defaultAvatar ? "사 용" : "변 경",
      func: onSubmit,
    },
  };

  return (
    <ModalLayout title="아바타 프로필" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Flex w="full" mx="auto" borderBottom="var(--border)" mb={8}>
        {TAB_LIST.map((item, idx) => {
          const selected = tab === item;

          return (
            <Button
              key={item}
              borderRadius="0"
              position="relative"
              flex={1}
              variant="unstyled"
              fontSize="14px"
              fontWeight={selected ? 700 : 500}
              py={3}
              bg={selected ? "white" : "var(--gray-100)"}
              border="var(--border-main)"
              borderLeft={idx === 1 ? "var(--border-main)" : "none"}
              borderRight={idx === 1 ? "var(--border-main)" : "none"}
              borderBottom={selected ? "2px solid var(--color-mint)" : "var(--border-main)"}
              onClick={() => handleTabClick(item)}
            >
              {item}
            </Button>
          );
        })}
      </Flex>

      <Flex flex={1} justify="center" align="center" position="relative" mb="20px">
        <Box
          position="absolute"
          left="0"
          top="50%"
          transform="translateY(-50%)"
          onClick={() => handleMove("prev")}
          cursor={canGoPrev ? "pointer" : "default"}
        >
          {canGoPrev && <ShortArrowIcon dir="left" color="black" size="lg" />}
        </Box>

        <AnimatePresence mode="wait" custom={back}>
          <MotionBox
            key={`${tab}-${iconIdx}`}
            custom={back}
            variants={variants}
            initial="entry"
            animate="center"
            exit="exit"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar user={{ avatar: { type: typeIdx, bg } }} size="xl1" />
          </MotionBox>
        </AnimatePresence>

        <Box
          position="absolute"
          right="0"
          top="50%"
          transform="translateY(-50%)"
          onClick={() => handleMove("next")}
          cursor={canGoNext ? "pointer" : "default"}
        >
          {canGoNext && <ShortArrowIcon dir="right" size="lg" color="gray" />}
        </Box>
      </Flex>

      <Flex
        align="center"
        py="var(--gap-2)"
        mt="8px"
        borderTop="var(--border)"
        borderBottom="var(--border)"
      >
        <ImageSlider
          type="avatarColor"
          imageContainer={COLOR_TABLE_LIGHT}
          onClick={(idx) => setBg(idx)}
        />
      </Flex>

      <Flex align="center" py="var(--gap-2)" borderBottom="var(--border)">
        <ImageSlider
          type="specialBg"
          imageContainer={AVATAR_BG_IMAGES}
          onClick={(idx) => setBg(idx + 100)}
        />
      </Flex>
    </ModalLayout>
  );
}

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
    transition: {
      duration: 0.3,
    },
  }),
};

export default RequestChangeProfileImageModalAvatar;
