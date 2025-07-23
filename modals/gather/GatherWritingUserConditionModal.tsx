import { Switch } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { PopOverIcon } from "../../components/Icons/PopOverIcon";
import { ConditionType } from "../../components/organisms/WritingConditionLayout";
import { GROUP_WRITING_STORE } from "../../constants/keys/localStorage";
import { GroupConditionType } from "../../pages/group/writing/condition";
import GatherWritingConditionAgeRange from "../../pageTemplates/gather/writing/condition/GatherWritingConditionAgeRange";
import GatherWritingConditionCnt from "../../pageTemplates/gather/writing/condition/GatherWritingConditionCnt";
import { sharedGatherWritingState } from "../../recoils/sharedDataAtoms";
import { IModal } from "../../types/components/modalTypes";
import { IGatherMemberCnt, IGatherWriting } from "../../types/models/gatherTypes/gatherTypes";
import { IGroupWriting } from "../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../utils/storageUtils";
import { ModalLayout } from "../Modals";

interface GatherWritingUserConditionModalProps extends IModal {
  gatherContent: IGatherWriting | IGroupWriting;
  isGenderCondition: boolean;
  isAgeCondition: boolean;
  type: "gather" | "group";
  toggleSwitch: (
    e: ChangeEvent<HTMLInputElement>,
    type: ConditionType | GroupConditionType,
  ) => void;
}

function GatherWritingUserConditionModal({
  isGenderCondition,
  isAgeCondition,
  setIsModal,
  toggleSwitch,
  type,
}: GatherWritingUserConditionModalProps) {
  const [gatherContent, setGatherContent] = useRecoilState(sharedGatherWritingState);
  const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const [memberCnt, setMemberCnt] = useState<IGatherMemberCnt>(
    gatherContent?.memberCnt ||
      groupWriting?.memberCnt || {
        min: 4,
        max: 8,
      },
  );
  const [age, setAge] = useState(gatherContent?.age || [19, 28]);
  console.log(setMemberCnt);
  useEffect(() => {
    if (type === "gather") setGatherContent({ ...gatherContent, age, memberCnt });
    if (type === "group") {
      setLocalStorageObj(GROUP_WRITING_STORE, {
        ...groupWriting,
        age,
        memberCnt,
      });
    }
  }, [age, memberCnt]);

  return (
    <ModalLayout setIsModal={setIsModal} footerOptions={{ main: {} }} title="참여 인원 설정">
      <Item>
        <Name>
          <div>
            <i className="fa-solid fa-user-group" />
          </div>
          <span>최대 인원</span>
        </Name>
        <GatherWritingConditionCnt value={memberCnt.max} />
      </Item>
      <Item>
        <Name>
          <div>
            <i className="fa-solid fa-venus-mars" />
          </div>
          <span>성비 고려</span>
          <PopOverIcon text="성비를 최대 2대1까지로 제한합니다." />
        </Name>
        <Switch
          mr="var(--gap-1)"
          colorScheme="mint"
          isChecked={isGenderCondition}
          onChange={(e) => toggleSwitch(e, "gender")}
        />
      </Item>
      <Item>
        <Name>
          <div>
            <i className="fa-solid fa-user" />
          </div>
          <span>나이(만)</span>
        </Name>
        <Switch
          mr="var(--gap-1)"
          colorScheme="mint"
          isChecked={isAgeCondition}
          onChange={(e) => toggleSwitch(e, "age")}
        />
      </Item>
      {isAgeCondition && <GatherWritingConditionAgeRange age={age} setAge={setAge} />}
    </ModalLayout>
  );
}

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--gap-4) 0;
  align-items: center;
  border-bottom: var(--border);
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  > div:first-child {
    text-align: center;
    width: 20px;
  }
  span {
    margin-left: var(--gap-2);
  }
`;

export default GatherWritingUserConditionModal;
