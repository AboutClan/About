import { Button } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { useFailToast, useTypeErrorToast } from "../../../hooks/ui/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { birthToAge } from "../../../libs/utils/membersUtil";
import { transferGatherDataState } from "../../../recoil/transferDataAtoms";
import { DispatchNumber } from "../../../types/common";

interface IGatherParticipateModalApply {
  setPageNum: DispatchNumber;
}

function GatherParticipateModalApply({
  setPageNum,
}: IGatherParticipateModalApply) {
  const failToast = useFailToast();
  const userErrorToast = useTypeErrorToast();
  const gatherData = useRecoilValue(transferGatherDataState);

  const { data: userInfo } = useUserInfoQuery({
    onError: (e) => userErrorToast(e, "user"),
  });

  const onApply = () => {
    const myOld = birthToAge(userInfo.birth);

    if (gatherData.user.location !== userInfo.location) {
      failToast("free", "참여할 수 없는 지역입니다.");
      return;
    }

    if (myOld < gatherData.age[0] || myOld > gatherData.age[1]) {
      failToast("free", "나이 조건이 맞지 않습니다.");
      return;
    }

    if (
      gatherData.memberCnt.max !== 0 &&
      gatherData.memberCnt.max <= gatherData.participants.length
    ) {
      failToast("free", "모집 인원이 마감되었습니다.");
      return;
    }

    if (gatherData.genderCondition) {
      const participants = gatherData.participants;
      const manCnt = participants.filter(
        (who) => who.user.gender === "남성"
      ).length;
      const womanCnt = participants.length - manCnt;

      if (userInfo.gender === "남성") {
        if (
          (womanCnt === 0 && manCnt >= 3) ||
          (womanCnt === 1 && manCnt >= 4) ||
          (womanCnt >= 2 && manCnt >= womanCnt * 2)
        ) {
          failToast(
            "free",
            "현재 성별 조건이 맞지 않습니다. 나중에 다시 신청해주세요!"
          );
          return;
        }
      }
      if (userInfo.gender === "여성") {
        if (
          (manCnt === 0 && womanCnt >= 3) ||
          (manCnt === 1 && womanCnt >= 4) ||
          (manCnt >= 2 && womanCnt >= manCnt * 2)
        ) {
          failToast(
            "free",
            "현재 성별 조건이 맞지 않습니다. 나중에 다시 신청해주세요!"
          );
          return;
        }
      }
    }
    setPageNum(2);
  };

  return (
    <>
      <Layout>
        <Button
          color="white"
          backgroundColor="var(--color-mint)"
          marginBottom="var(--margin-main)"
          height="48px"
          fontSize="17px"
          onClick={onApply}
        >
          일반 참여 신청
        </Button>
        <Button onClick={() => setPageNum(1)} height="48px" fontSize="17px">
          사전 확정 인원
        </Button>
      </Layout>
      <Message>사전 확정 인원은 암호코드가 필요합니다.</Message>
    </>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin-top: var(--margin-main);
`;
const Message = styled.span`
  display: inline-block;
  margin-top: var(--margin-main);
  color: var(--font-h3);
`;
export default GatherParticipateModalApply;