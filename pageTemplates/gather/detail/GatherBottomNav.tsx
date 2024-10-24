import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import Slide from "../../../components/layouts/PageSlide";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useCompleteToast, useErrorToast } from "../../../hooks/custom/CustomToast";
import { useFeedsQuery } from "../../../hooks/feed/queries";
import { useGatherParticipationMutation } from "../../../hooks/gather/mutations";
import GatherExpireModal from "../../../modals/gather/gatherExpireModal/GatherExpireModal";
import GatherReviewDrawer from "../../../modals/gather/gatherExpireModal/GatherReviewDrawer";
import GatherParticipateModal from "../../../modals/gather/gatherParticipateModal/GatherParticipateModal";
import {
  transferFeedSummaryState,
  transferGatherDataState,
} from "../../../recoils/transferRecoils";
import { GatherStatus, IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
interface IGatherBottomNav {
  data: IGather;
}

type ButtonType = "cancel" | "participate" | "expire" | "review";

function GatherBottomNav({ data }: IGatherBottomNav) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const completeToast = useCompleteToast();

  const errorToast = useErrorToast();
  const { data: session } = useSession();
  const myUid = session?.user.uid;
  const myGather = (data.user as IUserSummary).uid === myUid;
  const isParticipant = data?.participants.some((who) => who?.user && who.user.uid === myUid);

  const setTransferFeedSummary = useSetRecoilState(transferFeedSummaryState);
  const [isExpirationModal, setIsExpirationModal] = useState(false);
  const [isParticipationModal, setIsParticipationModal] = useState(false);
  const [isReviewDrawer, setIsReviewDrawer] = useState(false);
  const gatherId = +router.query.id;
  const setTransferGather = useSetRecoilState(transferGatherDataState);

  const { data: feed } = useFeedsQuery("gather", data?.id, null, true, {
    enabled: !!data?.id,
  });

  const { mutate: cancel } = useGatherParticipationMutation("delete", gatherId, {
    onSuccess() {
      completeToast("free", "참여 신청이 취소되었습니다.", true);
      queryClient.invalidateQueries([GATHER_CONTENT, gatherId]);
      setTransferGather(null);
    },
    onError: errorToast,
  });

  const onClick = (type: ButtonType) => {
    if (type === "cancel") cancel();
    if (type === "participate") setIsParticipationModal(true);
    if (type === "expire") setIsExpirationModal(true);
    if (type === "review") {
      router.push(`/feed/writing/gather?id=${data.id}`);
    }
  };

  useEffect(() => {
    if (data?.status === "open" && (myGather || isParticipant)) {
      setTransferFeedSummary({
        url: `/gather/${data.id}`,
        title: data.title,
        subCategory: data.type.subtitle,
      });
    }
  }, [data?.status]);

  interface IButtonSetting {
    text: string;
    handleFunction?: () => void;
  }

  const getButtonSettings = (status: GatherStatus): IButtonSetting => {
    switch (status) {
      case "open":
        if (feed?.length) {
          return {
            text: "모임 후기 도착! 확인하러 가기",
            handleFunction: () => setIsReviewDrawer(true),
          };
        }

        if (myGather || isParticipant) {
          return {
            text: "모임 리뷰 쓰고 포인트 받기",
            handleFunction: () => onClick("review"),
          };
        } else {
          return {
            text: "마감된 모임입니다.",
          };
        }
      case "close":
        return {
          text: "취소된 모임입니다.",
        };
    }
    if (data?.waiting.some((who) => who.user._id === session?.user.id)) {
      return { text: "참여 승인을 기다리고 있습니다." };
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
            colorScheme={handleFunction ? "mint" : "blackAlpha"}
            onClick={handleFunction}
          >
            {text}
          </Button>
        </Layout>
      </Slide>
      {isParticipationModal && (
        <GatherParticipateModal gather={data} setIsModal={setIsParticipationModal} />
      )}
      {isExpirationModal && <GatherExpireModal gather={data} setIsModal={setIsExpirationModal} />}
      {isReviewDrawer && (
        <GatherReviewDrawer feed={feed?.[0]} isOpen onClose={() => setIsReviewDrawer(false)} />
      )}
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
