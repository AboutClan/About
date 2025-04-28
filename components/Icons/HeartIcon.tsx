import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { LIKE_HEART } from "../../constants/keys/localStorage";
import { useErrorToast, useToast } from "../../hooks/custom/CustomToast";
import { useInteractionMutation } from "../../hooks/user/sub/interaction/mutations";
import { isHeartCheckLocalStorage, pushArrToLocalStorage } from "../../utils/storageUtils";
import { HeartIcon as Heart } from "./HeartIcons";
interface IHeartIcon {
  toUid: string;
}

function HeartIcon({ toUid }: IHeartIcon) {
  const { data: session } = useSession();
  const toast = useToast();
  const errorToast = useErrorToast();

  const [isShow, setIsShow] = useState(true);

  const { mutate: sendHeart } = useInteractionMutation("like", "post", {
    onSuccess() {
      toast("success", "전송 완료!");
      setIsShow(false);
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
    setIsShow(false);

    pushArrToLocalStorage(LIKE_HEART, toUid);
  };

  return (
    <Layout onClick={onClick}>
      <Heart color={!isShow ? "red" : "gray"} fill size="sm" />
    </Layout>
  );
}

const Layout = styled(motion.div)`
  margin-bottom: 3px;

  align-items: center;
`;

export default HeartIcon;
