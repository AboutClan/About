import { Box, Button, Flex } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Textarea from "../../../components/atoms/Textarea";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import WritingConditionLayout, {
  WritingConditionProps,
} from "../../../components/organisms/WritingConditionLayout";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import GroupConfirmModal from "../../../modals/groupStudy/WritingConfirmModal";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IGroupWriting } from "../../../types/models/groupTypes/group";
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
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit");
  const toast = useToast();

  const { data: userInfo } = useUserInfoQuery();

  const defaultCondition: WritingConditionProps = {
    memberMaxCnt: groupWriting?.memberCnt?.max ?? 4,
    isGenderCondition: groupWriting?.gender ?? false,
    age: groupWriting?.age ?? [19, 28],
    kakaoUrl: groupWriting?.link ?? null,
    isApprovalRequired: groupWriting?.isFree === undefined ? false : !groupWriting?.isFree,
    fee: groupWriting?.fee ?? 0,
    questionText: groupWriting?.questionText ?? [""],
  };

  const [conditions, setConditions] = useState<WritingConditionProps>(defaultCondition);
  const [isQuestionModal, setIsQuestionModal] = useState(false);

  useEffect(() => {
    if (conditions.isApprovalRequired) {
      if (isEdit) {
        setConditions((old) => ({ ...old, questionText: groupWriting.questionText }));
      }
      setIsQuestionModal(true);
    } else {
      setConditions((old) => ({ ...old, questionText: [""] }));
    }
  }, [conditions.isApprovalRequired]);

  useEffect(() => {
    if (isQuestionModal) return;
    if (conditions.questionText.length && conditions.questionText[0] !== "") {
      setConditions((old) => ({ ...old, isApprovalRequired: true }));
    } else {
      setConditions((old) => ({ ...old, isApprovalRequired: false }));
    }
  }, [isQuestionModal]);

  // const [condition, setCondition] = useState({
  //   isAgree: groupWriting?.isFree !== undefined ? !groupWriting?.isFree : true,
  //   location:
  //     groupWriting?.location !== undefined ? groupWriting?.location === userInfo?.location : false,
  //   challenge: groupWriting?.challenge ? true : false,
  //   fee:
  //     groupWriting?.fee !== undefined
  //       ? groupWriting?.fee !== 200 && groupWriting?.fee !== 0
  //       : false,

  //   isSecret: groupWriting?.isSecret || false,
  //   link: !!groupWriting?.link || false,
  // });

  // const [fee, setFee] = useState(groupWriting?.fee || "1000");
  // const [feeText, setFeeText] = useState(groupWriting?.feeText || "기본 참여비");

  // const [question, setQuestion] = useState(groupWriting?.questionText || "");
  // const [location, setLocation] = useState<Location | LocationFilterType>(
  //   groupWriting?.location || userInfo?.location,
  // );
  // const [link, setLink] = useState(groupWriting?.link || "");
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  // useEffect(() => {
  //   if (condition.isAgree) setIsQuestionModal(true);
  //   else setIsQuestionModal(false);
  // }, [condition.isAgree]);

  const onClickNext = async () => {
    const groupData: IGroupWriting = {
      ...groupWriting,

      age: conditions.age,
      memberCnt: {
        min: 0,
        max: conditions.memberMaxCnt,
      },
      fee: conditions.fee,

      isFree: !conditions.isApprovalRequired,

      link: conditions.kakaoUrl,
      gender: conditions.isGenderCondition,
      organizer: groupWriting?.organizer || userInfo,
      questionText: conditions.questionText.filter((text) => text.length > 0),
    };

    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...groupData,
    });
    setIsConfirmModal(true);
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={100} />
        <Header isSlide={false} title="" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>어떤 인원과 함께하고 싶나요?</span>
          <span>조건을 선택해 주세요</span>
        </RegisterOverview>
        <WritingConditionLayout conditions={conditions} setConditions={setConditions} />
        {/* <Container>
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
              <i className="fa-regular fa-dollar-sign" />
              <span>보증금</span>
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
                <span>보증금: </span>
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
          </Item>
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
              <Input isLine size="sm" value={link} onChange={(e) => setLink(e.target.value)} />
            </Flex>
          )}
        </Container> */}
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} text="완료" />
      {isQuestionModal && (
        <RightDrawer
          title="가입 질문"
          onClose={() => {
            setConditions((old) => ({ ...old, questionText: [""] }));
            setIsQuestionModal(false);
          }}
        >
          {conditions.questionText.map((text, idx) => (
            <Flex flexDir="column" mb={5} key={idx}>
              <Box fontWeight="semibold" my={2} fontSize="16px">
                질문 {idx + 1}
              </Box>
              <Textarea
                minH="48px"
                onChange={(e) => {
                  setConditions((old) => {
                    const texts = old.questionText;
                    texts[idx] = e.target.value;
                    return { ...old, questionText: texts };
                  });
                  // setTextArr((old) => {
                  //   const copy = [...old];
                  //   copy[idx] = e.target.value;
                  //   return copy;
                  // });
                }}
                value={conditions.questionText[idx]}
                placeholder="질문을 작성해 주세요."
              />
            </Flex>
          ))}
          <Flex>
            <Button
              ml="auto"
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={() => {
                if (conditions.questionText.length <= 1) {
                  toast("warning", "승인제 모임은 최소 1개 이상의 질문지가 필요합니다.");
                  return;
                }
                setConditions((old) => ({ ...old, questionText: old.questionText.slice(0, -1) }));
              }}
            >
              질문 삭제
            </Button>
            <Button
              ml={2}
              colorScheme="mint"
              size="sm"
              onClick={() => {
                if (conditions.questionText.length >= 3) {
                  toast("warning", "질문은 최대 3개까지 가능합니다.");
                  return;
                }
                setConditions((old) => ({ ...old, questionText: [...old.questionText, ""] }));
              }}
            >
              질문 추가
            </Button>
          </Flex>
          <BottomNav text="저 장" onClick={() => setIsQuestionModal(false)} isSlide={false} />
        </RightDrawer>
      )}
      {/* <QuestionBottomDrawer
        isModal={true || isQuestionModal}
        setIsModal={() => {
          setIsQuestionModal(false);
          // setCondition((old) => ({ ...old, isAgree: false }));
        }}
        onClickRight={() => {
          // setCondition((old) => ({ ...old, isAgree: true }));
          setIsQuestionModal(false);
        }}
        question={conditions?.questionText}
        setQuestion={(texts: string[]) => {
          setConditions((old) => ({ ...old, questionText: texts }));
        }}
      /> */}
      {isConfirmModal && (
        <GroupConfirmModal setIsModal={setIsConfirmModal} groupWriting={groupWriting} />
      )}
    </>
  );
}

export default WritingCondition;
