import { Switch } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { PopOverIcon } from "../../components/atoms/Icons/PopOverIcon";
import { GatherConditionType } from "../../pages/gather/writing/condition";
import GatherWritingConditionAgeRange from "../../pageTemplates/gather/writing/condition/GatherWritingConditionAgeRange";
import GatherWritingConditionCnt from "../../pageTemplates/gather/writing/condition/GatherWritingConditionCnt";
import { sharedGatherWritingState } from "../../recoils/sharedDataAtoms";
import { IModal } from "../../types/components/modalTypes";
import { IGatherMemberCnt, IGatherWriting } from "../../types/models/gatherTypes/gatherTypes";
import { ModalLayout } from "../Modals";

interface GatherWritingUserConditionModalProps extends IModal {
  gatherContent: IGatherWriting;
  isGenderCondition: boolean;
  isAgeCondition: boolean;
  toggleSwitch: (e: ChangeEvent<HTMLInputElement>, type: GatherConditionType) => void;
}

function GatherWritingUserConditionModal({
  isGenderCondition,
  isAgeCondition,
  setIsModal,
  toggleSwitch,
}: GatherWritingUserConditionModalProps) {
  const [gatherContent, setGatherContent] = useRecoilState(sharedGatherWritingState);

  const [memberCnt, setMemberCnt] = useState<IGatherMemberCnt>(
    gatherContent?.memberCnt || {
      min: 4,
      max: 0,
    },
  );
  const [age, setAge] = useState(gatherContent?.age || [19, 28]);

  useEffect(() => {
    setGatherContent({ ...gatherContent, age, memberCnt });
  }, [age, memberCnt]);

  return (
    <ModalLayout setIsModal={setIsModal} footerOptions={{ main: {} }} title="참여 인원 설정">
      <Item>
        <Name>
          <div>
            <i className="fa-solid fa-user-group" />
          </div>
          <span>최소 인원</span>
        </Name>
        <GatherWritingConditionCnt isMin={true} value={memberCnt.min} setMemberCnt={setMemberCnt} />
      </Item>
      <Item>
        <Name>
          <div>
            <i className="fa-solid fa-user-group" />
          </div>
          <span>최대 인원</span>
        </Name>
        <GatherWritingConditionCnt
          isMin={false}
          value={memberCnt.max}
          setMemberCnt={setMemberCnt}
        />
      </Item>
      <Item>
        <Name>
          <div>
            <i className="fa-solid fa-venus-mars" />
          </div>
          <span>성별 고려</span>
          <PopOverIcon title="성별 고려" text="성별 비율을 최대 2대1까지 제한합니다." />
        </Name>
        <Switch
          mr="var(--gap-1)"
          colorScheme="mintTheme"
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
          colorScheme="mintTheme"
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
