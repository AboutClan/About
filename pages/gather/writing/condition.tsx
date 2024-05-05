import { Switch } from "@chakra-ui/react";
import {
  faLocationCrosshairs,
  faUser,
  faUserGroup,
  faUserPolice,
  faUserSecret,
  faVenusMars,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { PopOverIcon } from "../../../components/atoms/Icons/PopOverIcon";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import GatherWritingConfirmModal from "../../../modals/gather/GatherWritingConfirmModal";
import GatherWritingConditionAgeRange from "../../../pageTemplates/gather/writing/condition/GatherWritingConditionAgeRange";
import GatherWritingConditionCnt from "../../../pageTemplates/gather/writing/condition/GatherWritingConditionCnt";
import GatherWritingConditionLocation from "../../../pageTemplates/gather/writing/condition/GatherWritingConditionLocation";
import GatherWritingConditionPre from "../../../pageTemplates/gather/writing/condition/GatherWritingConditionPre";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherMemberCnt, IGatherWriting } from "../../../types/models/gatherTypes/gatherTypes";
import { Location } from "../../../types/services/locationTypes";
import { randomPassword } from "../../../utils/validationUtils";

type ButtonType = "gender" | "age" | "pre" | "location" | "manager";

export type CombinedLocation = "전체" | "수원/안양" | "양천/강남";

function WritingCondition() {
  const [gatherContent, setGatherContent] = useRecoilState(sharedGatherWritingState);
  const { data: session } = useSession();

  const [condition, setCondition] = useState({
    gender: gatherContent?.genderCondition || false,
    age: gatherContent?.age ? true : false,
    pre: gatherContent?.preCnt ? true : false,
    location: gatherContent?.place ? gatherContent.place === session?.user.location : true,
    manager: true,
  });

  const [memberCnt, setMemberCnt] = useState<IGatherMemberCnt>(
    gatherContent?.memberCnt || {
      min: 4,
      max: 0,
    },
  );
  const [preCnt, setPreCnt] = useState(gatherContent?.preCnt || 1);
  const [age, setAge] = useState(gatherContent?.age || [19, 28]);
  const [password, setPassword] = useState(gatherContent?.password);
  const [location, setLocation] = useState<Location | CombinedLocation>(
    gatherContent?.place || session?.user.location,
  );
  const [isConfirmModal, setIsConfirmModal] = useState(false);

 
  const isManager = ["manager", "previliged"].includes(session?.user.role);

  const onClickNext = async () => {
    const gatherData: IGatherWriting = {
      ...gatherContent,
      age,
      preCnt,
      memberCnt,
      genderCondition: condition.gender,
      password,
      user: session?.user.id,
      place: location || session?.user.location,
      isAdminOpen: !condition.manager,
    };
    setGatherContent(gatherData);
    setIsConfirmModal(true);
  };

  useEffect(() => {
    if (!password) setPassword(randomPassword());
  }, [password]);

  const toggleSwitch = (e: ChangeEvent<HTMLInputElement>, type: ButtonType) => {
    const isChecked = e.target.checked;
    if (type === "location" && isChecked) {
      setLocation(session?.user.location);
    }
    setCondition((old) => {
      return { ...old, [type]: isChecked };
    });
  };

  return (
    <>
      <>
        <Slide isFixed={true}>
          <ProgressStatus value={100} />
          <Header isSlide={false} title="" url="/gather/writing/location" />
        </Slide>
        <RegisterLayout>
          <RegisterOverview>
            <span>조건을 선택해 주세요.</span>
          </RegisterOverview>
          <Container>
            <Item>
              <Name>
                <FontAwesomeIcon icon={faUserGroup} />
                <span>최소 인원</span>
              </Name>
              <GatherWritingConditionCnt
                isMin={true}
                value={memberCnt.min}
                setMemberCnt={setMemberCnt}
              />
            </Item>
            <Item>
              <Name>
                <FontAwesomeIcon icon={faUserGroup} />
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
                <FontAwesomeIcon icon={faVenusMars} />
                <span>성별 고려</span>
                <PopOverIcon title="성별 고려" text="성별 비율을 최대 2대1까지 제한합니다." />
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.gender}
                onChange={(e) => toggleSwitch(e, "gender")}
              />
            </Item>
            <Item>
              <Name>
                <FontAwesomeIcon icon={faUser} />
                <span>나이(만)</span>
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.age}
                onChange={(e) => toggleSwitch(e, "age")}
              />
            </Item>
            {condition.age && <GatherWritingConditionAgeRange age={age} setAge={setAge} />}
            <Item>
              <Name>
                <FontAwesomeIcon icon={faLocationCrosshairs} />
                <span>지역 필터</span>
                <PopOverIcon title="지역 필터" text="기본으로는 본인이 속한 지역으로 한정합니다." />
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.location}
                onChange={(e) => toggleSwitch(e, "location")}
              />
            </Item>
            {!condition.location && <GatherWritingConditionLocation setLocation={setLocation} />}
            <Item>
              <Name>
                <FontAwesomeIcon icon={faUserSecret} />
                <span>사전 섭외</span>
                <PopOverIcon
                  title="사전 섭외"
                  text=" 모집 인원에서 사전 섭외 인원 자리가 먼저 고정됩니다. 암호키를 복사해서 전달해주세요."
                />
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.pre}
                onChange={(e) => toggleSwitch(e, "pre")}
              />
            </Item>
            {condition.pre && (
              <GatherWritingConditionPre
                preCnt={preCnt}
                setPreCnt={setPreCnt}
                password={password}
              />
            )}
            {isManager && (
              <Item>
                <Name>
                  <FontAwesomeIcon icon={faUserPolice} />
                  <span>운영진 참여</span>
                  <PopOverIcon
                    title="운영진 기능"
                    text="운영진에게만 표시되는 기능입니다. 본인의 참여 여부를 선택할 수 있습니다."
                  />
                </Name>
                <Switch
                  mr="var(--gap-1)"
                  colorScheme="mintTheme"
                  isChecked={condition.manager}
                  onChange={(e) => toggleSwitch(e, "manager")}
                />
              </Item>
            )}
          </Container>
        </RegisterLayout>
        <BottomNav onClick={() => onClickNext()} text="완료" />
      </>
      {isConfirmModal && (
        <GatherWritingConfirmModal setIsModal={setIsConfirmModal} gatherData={gatherContent} />
      )}
    </>
  );
}

const Name = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-left: var(--gap-2);
  }
`;

const Container = styled.div`
  font-size: 14px;
  margin-top: var(--gap-5);
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--gap-4) 0;
  align-items: center;
  border-bottom: var(--border);
`;

export default WritingCondition;
