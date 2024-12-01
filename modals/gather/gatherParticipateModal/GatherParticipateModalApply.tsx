import { useFailToast, useTypeErrorToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { DispatchNumber } from "../../../types/hooks/reactTypes";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../../utils/convertUtils/convertTypes";
import { ModalBodyNavTwo } from "../../Modals";

interface IGatherParticipateModalApply {
  setPageNum: DispatchNumber;
  gather: IGather;
}

function GatherParticipateModalApply({
  setPageNum,
  gather: gatherData,
}: IGatherParticipateModalApply) {
  const failToast = useFailToast();
  const userErrorToast = useTypeErrorToast();

  const { data: userInfo } = useUserInfoQuery({
    onError: (e) => userErrorToast(e, "user"),
  });

  const onApply = () => {
    const myOld = birthToAge(userInfo.birth);
    const participantsCnt = gatherData.participants.length;

    // const places = gatherData.place.split("/");

    // if (places[0] !== "전체" && !places.includes(userInfo.location)) {
    //   failToast("free", "참여할 수 없는 지역입니다.");
    //   return;
    // }

    if ((gatherData.age[0] !== 19 && myOld < gatherData.age[0]) || myOld > gatherData.age[1]) {
      failToast("free", "나이 조건이 맞지 않습니다.");
      return;
    }

    const maxCnt = gatherData.isAdminOpen ? participantsCnt : participantsCnt + 1;
    if (gatherData.memberCnt.max !== 0 && gatherData.memberCnt.max <= maxCnt) {
      failToast("free", "모집 인원이 마감되었습니다.");
      return;
    }

    if (gatherData.genderCondition) {
      const organizerGender = (gatherData.user as IUser).gender;

      const participants = gatherData.participants;
      let manCnt = participants.filter((who) => (who.user as IUser).gender === "남성").length;
      let womanCnt = participants.length - manCnt;
      if (organizerGender === "남성") manCnt++;
      else womanCnt++;

      if (userInfo.gender === "남성") {
        if (
          (womanCnt === 0 && manCnt >= 3) ||
          (womanCnt === 1 && manCnt >= 4) ||
          (womanCnt >= 2 && manCnt >= womanCnt * 2)
        ) {
          failToast("free", "현재 성별 조건이 맞지 않습니다. 나중에 다시 신청해주세요!");
          return;
        }
      }
      if (userInfo.gender === "여성") {
        if (
          (manCnt === 0 && womanCnt >= 3) ||
          (manCnt === 1 && womanCnt >= 4) ||
          (manCnt >= 2 && womanCnt >= manCnt * 2)
        ) {
          failToast("free", "현재 성별 조건이 맞지 않습니다. 나중에 다시 신청해주세요!");
          return;
        }
      }
    }
    setPageNum(2);
  };

  return (
    <ModalBodyNavTwo
      topText="일반 참여 신청"
      bottomText="사전 확정 인원"
      onClickTop={onApply}
      onClickBottom={() => setPageNum(1)}
    />
  );
}

export default GatherParticipateModalApply;
