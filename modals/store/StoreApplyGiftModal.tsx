import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import CountNum from "../../components/atoms/CountNum";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import { STORE_GIFT } from "../../constants/keys/queryKeys";
import { useErrorToast, useFailToast, useToast } from "../../hooks/custom/CustomToast";
import { useStoreMutation } from "../../hooks/sub/store/mutation";
import { usePointSystemMutation, useUserTicketMutation } from "../../hooks/user/mutations";
import { usePointSystemQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { getStoreMaxCnt } from "../../libs/getStoreMaxCnt";
import { IModal } from "../../types/components/modalTypes";
import { StoreGiftProps } from "../../types/models/store";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStoreApplyGiftModal extends IModal {
  giftInfo: StoreGiftProps;
}

function StoreApplyGiftModal({ setIsModal, giftInfo }: IStoreApplyGiftModal) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const failToast = useFailToast();
  const toast = useToast();
  const errorToast = useErrorToast();

  const isGuest = session?.user.name === "guest";

  const [value, setValue] = useState(1);

  const { data: userInfo } = useUserInfoQuery();
  const { data: myPoint, isLoading } = usePointSystemQuery("point");
  const { mutate: applyGift, isLoading: isLoading2 } = useStoreMutation({
    onSuccess() {
      // toast("success", "응모에 성공했어요! 당첨 발표일을 기다려주세요!");
      // queryClient.invalidateQueries([STORE_GIFT]);
      // router.push("/store");
    },
    onError: errorToast,
  });
  const { mutate: getPoint } = usePointSystemMutation("point");
  const { mutate } = useUserTicketMutation({
    onSuccess() {
      getPoint({ value: -totalCost, message: `${giftInfo.name} 구매` });
      toast("success", "충전되었습니다.");
      queryClient.invalidateQueries([STORE_GIFT]);
      router.push("/store");
    },
  });

  const totalCost = giftInfo.point * value;

  const totalCnt = giftInfo.applicants.reduce((acc, cur) => {
    return acc + cur.cnt;
  }, 0);

  const maxCnt = Math.min(
    getStoreMaxCnt(userInfo?.score) -
      giftInfo.applicants.reduce((acc, cur) => {
        if (cur.user.uid === session?.user.uid) {
          return acc + cur.cnt;
        }
        return acc;
      }, 0),
    Math.floor(myPoint / totalCost),
    giftInfo.max - totalCnt,
  );

  const onApply = () => {
    console.log(1234, myPoint, totalCost);
    return;
    if (isGuest) {
      failToast("guest");
      return;
    }
    if (myPoint < totalCost) {
      failToast("free", "보유중인 포인트가 부족해요!");
      return;
    }
    if (myPoint - 5000 < totalCost) {
      failToast("free", "구매 후 보유 포인트가 8,000원 이상이어야 합니다.");
      return;
    }

    if (maxCnt < 1) {
      failToast("free", "최대 구매 개수를 초과할 수 없습니다.");
      return;
    }

    // if (giftInfo?.type) {
    //   mutate({
    //     ticketNum: value,
    //     type: giftInfo?.name === "번개 참여권" ? "gather" : "groupStudy",
    //   });
    // } else {

    applyGift({ storeId: giftInfo._id, cnt: value });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "상품 응모",
      func: onApply,
      isLoading: isLoading2,
    },
  };

  return (
    <ModalLayout title={"상품 응모"} footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box minH="124.5px">
        {!isLoading ? (
          <>
            <Item>
              <span>상품</span>
              <span>{giftInfo?.name}</span>
            </Item>
            <Item>
              <span>보유 포인트</span>
              <span>{myPoint} point</span>
            </Item>
            <Item>
              <span>필요 포인트</span>
              <NeedPoint overMax={totalCost > myPoint}>{totalCost} point</NeedPoint>
            </Item>

            <CountNav>
              <CountNum value={value} setValue={setValue} maxValue={maxCnt} />
            </CountNav>
          </>
        ) : (
          <MainLoadingAbsolute />
        )}
      </Box>
    </ModalLayout>
  );
}

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  > span:first-child {
    color: var(--gray-600);
  }
  > span:last-child {
    font-weight: 600;
  }
`;

const NeedPoint = styled.span<{ overMax: boolean }>`
  color: ${(props) => (props.overMax ? "var(--color-red)" : "var(--color-mint)")};
`;

const CountNav = styled.nav`
  margin-top: 12px;

  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default StoreApplyGiftModal;
