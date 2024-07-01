import { Button } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import Slide from "../../../components/layouts/PageSlide";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { POINT_SYSTEM_PLUS } from "../../../constants/serviceConstants/pointSystemConstants";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useCompleteToast, useErrorToast } from "../../../hooks/custom/CustomToast";
import { useGatherParticipationMutation } from "../../../hooks/gather/mutations";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import GatherExpireModal from "../../../modals/gather/gatherExpireModal/GatherExpireModal";
import GatherParticipateModal from "../../../modals/gather/gatherParticipateModal/GatherParticipateModal";
import { GatherStatus, IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
interface IGatherBottomNav {
  data: IGather;
}

type ButtonType = "cancel" | "participate" | "expire";

function GatherBottomNav({ data }: IGatherBottomNav) {
  const router = useRouter();
  const completeToast = useCompleteToast();

  const errorToast = useErrorToast();
  const { data: session } = useSession();
  const myUid = session?.user.uid;
  const myGather = (data.user as IUserSummary).uid === myUid;
  const isParticipant = data?.participants.some((who) => who?.user && who.user.uid === myUid);
  const [isExpirationModal, setIsExpirationModal] = useState(false);
  const [isParticipationModal, setIsParticipationModal] = useState(false);
  const gatherId = +router.query.id;

  const resetQueryData = useResetQueryData();

  const { mutate: getScore } = usePointSystemMutation("score");

  const { mutate: cancel } = useGatherParticipationMutation("delete", gatherId, {
    onSuccess() {
      const score = POINT_SYSTEM_PLUS.GATHER_ATTEND;
      getScore({ ...score, value: -score.value, message: "모임 참여 취소" });
      completeToast("free", "참여 신청이 취소되었습니다.", true);
      resetQueryData([GATHER_CONTENT]);
    },
    onError: errorToast,
  });

  const onClick = (type: ButtonType) => {
    if (type === "cancel") cancel();
    if (type === "participate") setIsParticipationModal(true);
    if (type === "expire") setIsExpirationModal(true);
  };

  interface IButtonSetting {
    text: string;
    handleFunction?: () => void;
  }

  const getButtonSettings = (status: GatherStatus): IButtonSetting => {
    switch (status) {
      case "open":
        return {
          text: "모임장은 단톡방을 만들어주세요!",
        };
      case "close":
        return {
          text: "취소된 모임입니다.",
        };
    }
    if (myGather) return { text: "모집 종료", handleFunction: () => onClick("expire") };
    if (isParticipant) {
      return { text: "참여 취소", handleFunction: () => onClick("cancel") };
    }
    return {
      text: "참여하기",
      handleFunction: () => onClick("participate"),
    };
  };

  const { text, handleFunction } = getButtonSettings(data?.status);

  return (
    <>
      <Slide isFixed={true} posZero="top">
        <Layout>
          <Button
            size="lg"
            h="48px"
            w="100%"
            borderRadius="var(--rounded-lg)"
            disabled={!handleFunction}
            colorScheme={handleFunction ? "mintTheme" : "blackAlpha"}
            onClick={handleFunction}
          >
            {text}
          </Button>
        </Layout>
      </Slide>
      {isParticipationModal && <GatherParticipateModal setIsModal={setIsParticipationModal} />}
      {isExpirationModal && <GatherExpireModal setIsModal={setIsExpirationModal} />}
    </>
  );
}

const Layout = styled.nav`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
  width: 100%;
  max-width: 390px;
  padding: var(--gap-4);
`;

export default GatherBottomNav;
