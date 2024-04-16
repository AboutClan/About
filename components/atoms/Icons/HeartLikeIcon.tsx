import { faCircleHeart } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { LIKE_HEART } from "../../../constants/keys/localStorage";
import { POINT_SYSTEM_PLUS } from "../../../constants/settingValue/pointSystem";
import { useAdminPointMutation } from "../../../hooks/admin/mutation";
import { useCompleteToast, useErrorToast } from "../../../hooks/custom/CustomToast";
import { useInteractionMutation } from "../../../hooks/user/sub/interaction/mutations";
import { isHeartCheckLocalStorage, pushArrToLocalStorage } from "../../../utils/storageUtils";

interface IHeartLikeIcon {
  toUid: string;
  size?: "sm" | "lg";
}

function HeartLikeIcon({ toUid, size = "sm" }: IHeartLikeIcon) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();

  const [isShow, setIsShow] = useState(true);

  const { mutate: sendAboutPoint } = useAdminPointMutation(toUid);
  const { mutate: sendHeart } = useInteractionMutation("like", "post", {
    onSuccess() {
      completeToast("free", "전송 완료!");
    },
    onError: errorToast,
  });

  useEffect(() => {
    const isHeartCheck = isHeartCheckLocalStorage(toUid);
    if (!isHeartCheck) setIsShow(false);
  }, [toUid]);

  const onClick = () => {
    sendHeart({
      to: toUid,
      message: `${session?.user.name}님에게 좋아요를 받았어요!`,
    });
    sendAboutPoint(POINT_SYSTEM_PLUS.LIKE);
    pushArrToLocalStorage(LIKE_HEART, toUid);
    setIsShow(false);
  };

  return (
    <Layout
      onClick={onClick}
      animate="spin"
      variants={spinVariants}
      transition={spinTransition}
      isshow={isShow ? "true" : "false"}
    >
      <FontAwesomeIcon
        icon={faCircleHeart}
        size={size === "sm" ? "sm" : "2x"}
        color="var(--color-red)"
      />
    </Layout>
  );
}

const Layout = styled(motion.div)<{ isshow: "true" | "false" }>`
  margin-bottom: 3px;
  display: ${(props) => (props.isshow === "true" ? "flex" : "none")};
  align-items: center;
`;

const spinTransition = {
  repeat: Infinity,
  ease: "linear",
  duration: 2,
};

const spinVariants = {
  spin: {
    rotateY: [0, 360],
  },
};

export default HeartLikeIcon;
