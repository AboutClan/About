import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import CountNum from "../../components/atoms/CountNum";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import { STORE_GIFT } from "../../constants/keys/queryKeys";
import { useCompleteToast, useErrorToast, useFailToast } from "../../hooks/custom/CustomToast";
import { useStoreMutation } from "../../hooks/sub/store/mutation";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { getStoreMaxCnt } from "../../libs/getStoreMaxCnt";
import { IGiftEntry } from "../../pages/store";
import { IModal } from "../../types/components/modalTypes";
import { IStoreApplicant } from "../../types/models/store";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStoreApplyGiftModal extends IModal {
  giftInfo: IGiftEntry;
}

function StoreApplyGiftModal({ setIsModal, giftInfo }: IStoreApplyGiftModal) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const failToast = useFailToast();
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();

  const isGuest = session?.user.name === "guest";

  const [value, setValue] = useState(1);

  const { data: userInfo } = useUserInfoQuery();
  const { data: myPoint, isLoading } = usePointSystemQuery("point");
  const { mutate: applyGift } = useStoreMutation({
    onSuccess() {
      getPoint({ value: -totalCost, message: `${giftInfo.name} 응모` });
      completeToast("free", "응모에 성공했어요! 당첨 발표일을 기다려주세요!");
      queryClient.invalidateQueries([STORE_GIFT]);
      router.push("/store");
    },
    onError: errorToast,
  });
  const { mutate: getPoint } = usePointSystemMutation("point");

  const totalCost = giftInfo.point * value;

  const maxCnt = Math.min(
    getStoreMaxCnt(userInfo?.score) -
      giftInfo.users.reduce((acc, cur) => {
        if (cur.uid === session?.user.uid) {
          return acc + cur.cnt;
        }
        return acc;
      }, 0),
    Math.floor(myPoint / totalCost),
    giftInfo.max - giftInfo.users.length,
  );

  const onApply = () => {
    if (isGuest) {
      failToast("guest");
      return;
    }
    if (myPoint < totalCost) {
      failToast("free", "보유중인 포인트가 부족해요!");
      return;
    }

    if (maxCnt < 1) {
      failToast("free", "최대 구매 개수를 초과할 수 없습니다.");
      return;
    }

    const info: IStoreApplicant = {
      name: session.user.name,
      uid: session.user.uid,
      cnt: value,
      giftId: giftInfo.giftId,
    };

    applyGift(info);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "응모하기",
      func: onApply,
    },
  };


  return (
    <ModalLayout title="상품 응모" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box h="130px">
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
            <Item>
              <span>최대 구매 개수</span>
              <NeedPoint overMax={totalCost > myPoint}>{maxCnt} 개</NeedPoint>
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
  margin-bottom: var(--gap-1);
  > span:last-child {
    font-weight: 600;
  }
`;

const NeedPoint = styled.span<{ overMax: boolean }>`
  color: ${(props) => props.overMax && "var(--color-red)"};
`;

const CountNav = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default StoreApplyGiftModal;
