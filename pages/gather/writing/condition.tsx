import { Box, Button, Flex, Switch } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { PopOverIcon } from "../../../components/atoms/Icons/PopOverIcon";
import { Input } from "../../../components/atoms/Input";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import GatherWritingConfirmModal from "../../../modals/gather/GatherWritingConfirmModal";
import GatherWritingUserConditionModal from "../../../modals/gather/GatherWritingUserConditionModal";
import GatherWritingConditionLocation from "../../../pageTemplates/gather/writing/condition/GatherWritingConditionLocation";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherWriting } from "../../../types/models/gatherTypes/gatherTypes";
import { Location } from "../../../types/services/locationTypes";
import { randomPassword } from "../../../utils/validationUtils";

export type GatherConditionType = "gender" | "age" | "pre" | "location" | "manager" | "kakaoUrl";

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
    kakaoUrl: false,
  });

  const [isMemberConditionModal, setIsMemberConditionModal] = useState(false);
  const [password, setPassword] = useState(gatherContent?.password);
  const [location, setLocation] = useState<Location | CombinedLocation>(
    gatherContent?.place || session?.user.location,
  );
  const [kakaoUrl, setKakaoUrl] = useState<string>("");
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const isManager = ["manager", "previliged"].includes(session?.user.role);

  const onClickNext = async () => {
    const gatherData: IGatherWriting = {
      ...gatherContent,
      preCnt: condition.pre ? 1 : 0,
      genderCondition: condition.gender,
      password,
      user: session?.user.id,
      place: location || session?.user.location,
      isAdminOpen: !condition.manager,
      kakaoUrl,
    };
    setGatherContent(gatherData);
    setIsConfirmModal(true);
  };

  useEffect(() => {
    if (!password) setPassword(randomPassword());
  }, [password]);

  const toggleSwitch = (e: ChangeEvent<HTMLInputElement>, type: GatherConditionType) => {
    const isChecked = e.target.checked;
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
    if (gatherContent?.memberCnt) {
      temp.push("인원");
    }
    return String(temp) + " " + "제한";
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
                <div>
                  <i className="fa-solid fa-user-lock" />
                </div>
                <span>참여 가능 조건</span>
              </Name>
              <Box ml="auto" mr="20px" fontSize="12px" color="var(--color-mint)">
                {getMemberConditionText() || "기본값"}
              </Box>
              <Button
                colorScheme="mintTheme"
                size="sm"
                onClick={() => setIsMemberConditionModal(true)}
              >
                설정
              </Button>
            </Item>
            <Item>
              <Name>
                <div>
                  <i className="fa-solid fa-location-crosshairs" />
                </div>
                <span>지역 필터</span>
                <PopOverIcon title="지역 필터" text="기본으로는 본인이 속한 지역으로 한정합니다." />
              </Name>{" "}
              <Box ml="auto" mr="32px" fontSize="12px" color="var(--color-mint)">
                {condition.location && `${session?.user.location}만`}
              </Box>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.location}
                onChange={(e) => toggleSwitch(e, "location")}
              />
            </Item>
            {!condition.location && <GatherWritingConditionLocation setLocation={setLocation} />}
            {/* <Item>
              <Name>
                <div>
                  <i className="fa-solid fa-key" />
                </div>
                <span>암호키</span>
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.pre}
                onChange={(e) => toggleSwitch(e, "pre")}
              />
            </Item> */}

            <Item>
              <Name>
                <div>
                  <i className="fa-solid fa-comments" />
                </div>
                <span>오픈채팅방</span>
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={condition.kakaoUrl}
                onChange={(e) => toggleSwitch(e, "kakaoUrl")}
              />
            </Item>
            {condition.kakaoUrl && (
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
                <Input size="sm" value={kakaoUrl} onChange={(e) => setKakaoUrl(e.target.value)} />
              </Flex>
            )}
            {isManager && (
              <Item>
                <Name>
                  <div>
                    <i className="fa-solid fa-user-police" />
                  </div>
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
      {isMemberConditionModal && (
        <GatherWritingUserConditionModal
          type="gather"
          setIsModal={setIsMemberConditionModal}
          gatherContent={gatherContent}
          isGenderCondition={condition.gender}
          isAgeCondition={condition.age}
          toggleSwitch={toggleSwitch}
        />
      )}
    </>
  );
}

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
