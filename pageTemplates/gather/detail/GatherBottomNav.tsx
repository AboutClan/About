import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import PaymentConfirmationDrawer from "../../../components/drawers/PaymentConfirmationDrawer";

import Slide from "../../../components/layouts/PageSlide";
import { useFeedsQuery } from "../../../hooks/feed/queries";
import GatherReviewDrawer from "../../../modals/gather/gatherExpireModal/GatherReviewDrawer";
import { transferFeedSummaryState } from "../../../recoils/transferRecoils";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import GatherParticipateDrawer from "../GatherParticipateDrawer";
interface IGatherBottomNav {
  data: IGather;
}

function GatherBottomNav({ data }: IGatherBottomNav) {
  const { data: session } = useSession();
  const myUid = session?.user.uid;
  const myGather = (data.user as IUserSummary).uid === myUid;
  const isParticipant = data?.participants.some((who) => who?.user && who.user.uid === myUid);

  const setTransferFeedSummary = useSetRecoilState(transferFeedSummaryState);

  const [isReviewDrawer, setIsReviewDrawer] = useState(false);
  const [isPaymentModal, setIsPaymentModal] = useState(false);

  const { data: feed } = useFeedsQuery("gather", data?.id, null, true, {
    enabled: !!data?.id,
  });
  console.log(feed);
  useEffect(() => {
    if (data?.status === "open" && (myGather || isParticipant)) {
      setTransferFeedSummary({
        url: `/gather/${data.id}`,
        title: data.title,
        subCategory: data.type.subtitle,
      });
    }
  }, [data?.status]);

  return (
    <>
      <Slide isFixed={true} posZero="top">
        <GatherParticipateDrawer data={data} />
      </Slide>

      {isReviewDrawer && (
        <GatherReviewDrawer feed={feed?.[0]} isOpen onClose={() => setIsReviewDrawer(false)} />
      )}
      {isPaymentModal && <PaymentConfirmationDrawer onClose={() => setIsPaymentModal(false)} />}
    </>
  );
}

export default GatherBottomNav;
