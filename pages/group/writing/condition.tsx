import { Switch } from "@chakra-ui/react";
import {
  faBellOn,
  faDollarSign,
  faLocationCrosshairs,
  faPersonToDoor,
  faUser,
  faUserGroup,
  faVenusMars,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { PopOverIcon } from "../../../components/atoms/Icons/PopOverIcon";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import GroupConfirmModal from "../../../modals/groupStudy/WritingConfirmModal";
import GatherWritingConditionAgeRange from "../../../pageTemplates/gather/writing/condition/GatherWritingConditionAgeRange";
import GatherWritingConditionCnt from "../../../pageTemplates/gather/writing/condition/GatherWritingConditionCnt";
import GatherWritingConditionLocation from "../../../pageTemplates/gather/writing/condition/GatherWritingConditionLocation";
import QuestionBottomDrawer from "../../../pageTemplates/group/writing/QuestionBottomDrawer";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGroupWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherMemberCnt } from "../../../types/models/gatherTypes/gatherTypes";
import { IGroupWriting } from "../../../types/models/groupTypes/group";
import { Location, LocationFilterType } from "../../../types/services/locationTypes";

type ButtonType = "gender" | "age" | "pre" | "location" | "isFree" | "fee" | "challenge";

export type CombinedLocation = "전체" | "수원/안양" | "양천/강남";

function WritingCondition() {
  const [groupWriting, setGroupWriting] = useRecoilState(sharedGroupWritingState);

  const { data: userInfo } = useUserInfoQuery();

  const [condition, setCondition] = useState({
    gender: groupWriting?.gender || false,
    age: groupWriting?.age ? true : false,
    isFree: groupWriting?.isFree !== undefined ? groupWriting?.isFree : true,
    location:
      groupWriting?.location !== undefined ? groupWriting?.location === userInfo?.location : true,
    challenge: groupWriting?.challenge ? true : false,
    fee:
      groupWriting?.fee !== undefined
        ? groupWriting?.fee !== 200 && groupWriting?.fee !== 0
        : false,
  });

  const [memberCnt, setMemberCnt] = useState<IGatherMemberCnt>({
    min: groupWriting?.memberCnt?.min || 4,
    max: groupWriting?.memberCnt?.max === undefined ? 8 : groupWriting?.memberCnt?.max,
  });

  const [age, setAge] = useState(groupWriting?.age || [19, 28]);

  const [challenge, setChallenge] = useState("");

  const [fee, setFee] = useState(groupWriting?.fee || "1000");
  const [feeText, setFeeText] = useState(groupWriting?.feeText || "기본 참여비");

  const [question, setQuestion] = useState(groupWriting?.questionText || "");
  const [location, setLocation] = useState<Location | CombinedLocation | LocationFilterType>(
    groupWriting?.location || userInfo?.location,
  );
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const [isQuestionModal, setIsQuestionModal] = useState(false);

  useEffect(() => {
    if (!condition.isFree) setIsQuestionModal(true);
    else setIsQuestionModal(false);
  }, [condition.isFree]);

  const onClickNext = async () => {
    const GroupData: IGroupWriting = {
      ...groupWriting,
      fee: condition.fee ? +fee : 0,
      feeText,
      isFree: condition.isFree,
      location: location || userInfo?.location,
      age,
      memberCnt,
      gender: condition.gender,
      organizer: userInfo,
      questionText: question,
      challenge,
    };
    setGroupWriting(GroupData);
    setIsConfirmModal(true);
  };

  const toggleSwitch = (e: ChangeEvent<HTMLInputElement>, type: ButtonType) => {
    const isChecked = e.target.checked;

    if (type === "location" && isChecked) {
      setLocation(userInfo.location);
    }

    setCondition((old) => {
      return { ...old, [type]: isChecked };
    });
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={100} />
        <Header isSlide={false} title="" url="/group/writing/hashTag" />
      </Slide>
      <Slide>
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
                defaultBoolean={memberCnt.max === 0 ? true : false}
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
                <FontAwesomeIcon icon={faPersonToDoor} />
                <span>자유 가입</span>
                <PopOverIcon title="자유 가입" text="조건에 맞는다면 자유롭게 가입이 가능합니다." />
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.isFree}
                onChange={(e) => toggleSwitch(e, "isFree")}
              />
            </Item>
            <Item>
              <Name>
                <FontAwesomeIcon icon={faBellOn} />
                <span>챌린지</span>
                <PopOverIcon title="챌린지" text="달성 챌린지를 진행하는 경우만 체크해주세요." />
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.challenge}
                onChange={(e) => toggleSwitch(e, "challenge")}
              />
            </Item>
            {condition.challenge && (
              <ChallengeText
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="2월까지 모든 인증 성공시 +5000원"
              />
            )}
            <Item>
              <Name>
                <FontAwesomeIcon icon={faDollarSign} />
                <span>참여비</span>
                <PopOverIcon
                  title="참여비"
                  text="기본 참여비는 1000원이고, 특별한 사용처가 없더라도 운영을 위해 그룹장에게 지급됩니다. 그 외 추가적인 활동비가 필요한 경우에도 변경할 수 있고, 아예 참여비를 원하지 않는 경우 설정하지 않아도 됩니다."
                />
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.fee}
                onChange={(e) => toggleSwitch(e, "fee")}
              />
            </Item>
            {condition.fee && (
              <Fee>
                <div>
                  <span>참여비: </span>
                  <input value={fee} onChange={(e) => setFee(e.target.value)} placeholder="2000" />
                </div>

                <div>
                  <span>사용처: </span>
                  <input
                    value={feeText}
                    onChange={(e) => setFeeText(e.target.value)}
                    placeholder="출석에 대한 벌금"
                  />
                </div>
              </Fee>
            )}
          </Container>
        </RegisterLayout>
      </Slide>

      <BottomNav onClick={() => onClickNext()} text="완료" />

      <QuestionBottomDrawer
        isModal={isQuestionModal}
        setIsModal={setIsQuestionModal}
        question={question}
        setQuestion={setQuestion}
      />

      {isConfirmModal && (
        <GroupConfirmModal
          setIsModal={setIsConfirmModal}
          groupWriting={groupWriting}
          setGroupWriting={setGroupWriting}
        />
      )}
    </>
  );
}

const ChallengeText = styled.textarea`
  margin-top: var(--gap-4);
  width: 100%;
  padding: 4px 8px;
  :focus {
    outline-color: var(--gray-1);
  }
`;

const Fee = styled.div`
  padding: var(--gap-3) 0;
  > div {
    margin-bottom: var(--gap-3);
    > input {
      width: 60px;
      padding: var(--gap-1) var(--gap-2);
      border-radius: var(--rounded);
      border: var(--border);
      :focus {
        outline-color: var(--gray-1);
      }
    }
  }
  > div:last-child {
    > input {
      width: 280px;
    }
  }
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  > span {
    margin-left: var(--gap-2);
  }
  > svg {
    width: 16px;
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
