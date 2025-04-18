import { Box, Button, Flex, Switch } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";

import { Input } from "../../../components/atoms/Input";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import GatherWritingUserConditionModal from "../../../modals/gather/GatherWritingUserConditionModal";
import GroupConfirmModal from "../../../modals/groupStudy/WritingConfirmModal";
import QuestionBottomDrawer from "../../../pageTemplates/group/writing/QuestionBottomDrawer";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IGroupWriting } from "../../../types/models/groupTypes/group";
import { Location, LocationFilterType } from "../../../types/services/locationTypes";
import { setLocalStorageObj } from "../../../utils/storageUtils";

export type GroupConditionType =
  | "gender"
  | "age"
  | "pre"
  | "location"
  | "isAgree"
  | "fee"
  | "challenge"
  | "link"
  | "isSecret";

function WritingCondition() {
  const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const { data: session } = useSession();

  const { data: userInfo } = useUserInfoQuery();

  const [condition, setCondition] = useState({
    gender: groupWriting?.gender || false,
    age: !groupWriting?.age
      ? false
      : groupWriting.age[0] === 19 && groupWriting.age[1] === 28
      ? false
      : true,
    isAgree: groupWriting?.isFree !== undefined ? !groupWriting?.isFree : true,
    location:
      groupWriting?.location !== undefined ? groupWriting?.location === userInfo?.location : false,
    challenge: groupWriting?.challenge ? true : false,
    fee:
      groupWriting?.fee !== undefined
        ? groupWriting?.fee !== 200 && groupWriting?.fee !== 0
        : false,

    isSecret: groupWriting?.isSecret || false,
    link: !!groupWriting?.link || false,
  });

  const [challenge, setChallenge] = useState("");

  const [fee, setFee] = useState(groupWriting?.fee || "1000");
  const [feeText, setFeeText] = useState(groupWriting?.feeText || "기본 참여비");

  const [question, setQuestion] = useState(groupWriting?.questionText || "");
  const [location, setLocation] = useState<Location | LocationFilterType>(
    groupWriting?.location || userInfo?.location,
  );
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isMemberConditionModal, setIsMemberConditionModal] = useState(false);
  const [isQuestionModal, setIsQuestionModal] = useState(false);
  const [link, setLink] = useState(groupWriting?.link || "");

  useEffect(() => {
    if (condition.isAgree) setIsQuestionModal(true);
    else setIsQuestionModal(false);
  }, [condition.isAgree]);

  const onClickNext = async () => {
    const groupData: IGroupWriting = {
      age: [19, 28],
      memberCnt: {
        min: 4,
        max: 0,
      },
      ...groupWriting,
      fee: condition.fee ? +fee : 0,
      feeText,
      isFree: !condition.isAgree,
      location: location || userInfo?.location,
      link,
      gender: condition.gender,
      organizer: userInfo,
      questionText: condition.isAgree ? question || "어떤 목적으로 가입을 희망하시나요?" : "",
      isSecret: condition.isSecret,
      challenge,
    };

    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...groupData,
    });
    setIsConfirmModal(true);
  };

  const toggleSwitch = (e: ChangeEvent<HTMLInputElement>, type: GroupConditionType) => {
    const isChecked = e.target.checked;

    if (type === "isSecret") {
      setCondition((old) => {
        return { ...old, [type]: isChecked, kakaoUrl: true };
      });
    }

    if (type === "location" && isChecked) {
      setLocation(session?.user.location);
    }
    setCondition((old) => {
      return { ...old, [type]: isChecked };
    });
  };

  const getMemberConditionText = () => {
    const temp = [];
    if (condition.age) {
      temp.push("나이");
    }
    if (condition.gender) {
      temp.push("성별");
    }
    if (groupWriting?.memberCnt?.max) {
      temp.push("인원");
    }
    if (temp.length) return String(temp) + " " + "제한";
    return null;
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={100} />
        <Header isSlide={false} title="" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>조건을 선택해 주세요.</span>
        </RegisterOverview>
        <Container>
          <Item>
            <Name>
              <div>
                <i className="fa-solid fa-user-lock" />
              </div>
              <span>참여 가능 조건</span>
            </Name>
            <Box ml="auto" mr="20px" fontSize="12px" color="var(--color-mint)">
              {getMemberConditionText() || "기본값"}
            </Box>
            <Button colorScheme="mint" size="sm" onClick={() => setIsMemberConditionModal(true)}>
              설정
            </Button>
          </Item>
          <Item>
            <Name>
              <i className="fa-regular fa-person-to-door" />
              <span>승인제 사용</span>
            </Name>
            <Switch
              mr="var(--gap-1)"
              colorScheme="mint"
              isChecked={condition.isAgree}
              onChange={(e) => toggleSwitch(e, "isAgree")}
            />
          </Item>
          <Item>
            <Name>
              <i className="fa-regular fa-bell-on" />
              <span>챌린지</span>
            </Name>
            <Switch
              mr="var(--gap-1)"
              colorScheme="mint"
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
              <i className="fa-regular fa-dollar-sign" />
              <span>참여비</span>
            </Name>
            <Switch
              mr="var(--gap-1)"
              colorScheme="mint"
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
          <Item>
            <Name>
              <div>
                <i className="fa-regular fa-user-secret" />
              </div>
              <span>익명으로 진행</span>
            </Name>
            <Switch
              mr="var(--gap-1)"
              colorScheme="mint"
              isChecked={condition.isSecret}
              onChange={(e) => toggleSwitch(e, "isSecret")}
            />
          </Item>{" "}
          <Item>
            <Name>
              <div>
                <i className="fa-regular fa-comments" />
              </div>
              <span>오픈채팅방</span>
            </Name>
            <Switch
              mr="var(--gap-1)"
              colorScheme="mint"
              isChecked={condition.link}
              onChange={(e) => toggleSwitch(e, "link")}
            />
          </Item>{" "}
          {condition.link && (
            <Flex align="center" mr="4px">
              <Box
                fontSize="12px"
                bgColor="var(--gray-500)"
                color="white"
                p="2px 6px"
                borderRadius="4px"
                mr="8px"
              >
                URL
              </Box>
              <Input size="sm" value={link} onChange={(e) => setLink(e.target.value)} />
            </Flex>
          )}
        </Container>
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} text="완료" />
      <QuestionBottomDrawer
        isModal={isQuestionModal}
        setIsModal={() => {
          setIsQuestionModal(false);
          setCondition((old) => ({ ...old, isAgree: false }));
        }}
        onClickRight={() => {
          setCondition((old) => ({ ...old, isAgree: true }));
          setIsQuestionModal(false);
        }}
        question={question}
        setQuestion={setQuestion}
      />
      {isConfirmModal && (
        <GroupConfirmModal setIsModal={setIsConfirmModal} groupWriting={groupWriting} />
      )}{" "}
      {isMemberConditionModal && (
        <GatherWritingUserConditionModal
          type="group"
          setIsModal={setIsMemberConditionModal}
          gatherContent={groupWriting}
          isGenderCondition={condition.gender}
          isAgeCondition={condition.age}
          toggleSwitch={toggleSwitch}
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
    outline-color: var(--gray-800);
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
        outline-color: var(--gray-800);
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
