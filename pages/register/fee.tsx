import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import InfoList from "../../components/atoms/lists/InfoList";
import BottomNav from "../../components/layouts/BottomNav";
import Accordion from "../../components/molecules/Accordion";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import TabNav from "../../components/molecules/navs/TabNav";
import TextCheckButton from "../../components/molecules/TextCheckButton";
import ValueBoxCol, { ValueBoxColItemProps } from "../../components/molecules/ValueBoxCol";
import { ACCORDION_CONTENT_FEE } from "../../constants/contentsText/accordionContents";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { ACTIVE_LOCATION_CENTER_DOT } from "../../constants/serviceConstants/studyConstants/studyVoteMapConstants";
import { useErrorToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation, useUserRegisterMutation } from "../../hooks/user/mutations";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Fee() {
  const errorToast = useErrorToast();
  const toast = useToast();
  const router = useRouter();

  const [tab, setTab] = useState<"신청 안내" | "자주 묻는 질문">("신청 안내");
  const [isChecked, setIsChecked] = useState(false);

  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const { mutate: changeRole } = useUserInfoFieldMutation("role");

  const { mutate, isLoading } = useUserRegisterMutation({
    onSuccess() {
      changeRole({ role: "waiting" });
      const getClosestLocation = (lat: number, lon: number): ActiveLocation => {
        let closestLocation: ActiveLocation = "수원";
        let minDistance = Number.MAX_VALUE;

        const toRadians = (degree: number) => (degree * Math.PI) / 180;

        const calculateDistance = (
          lat1: number,
          lon1: number,
          lat2: number,
          lon2: number,
        ): number => {
          const R = 6371; // 지구의 반지름(km)
          const dLat = toRadians(lat2 - lat1);
          const dLon = toRadians(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
              Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c; // km 거리
        };

        for (const [location, coords] of Object.entries(ACTIVE_LOCATION_CENTER_DOT)) {
          const distance = calculateDistance(lat, lon, coords.latitude, coords.longitude);

          if (distance < minDistance) {
            minDistance = distance;
            closestLocation = location as ActiveLocation;
          }
        }

        return closestLocation;
      };

      const findLocation = getClosestLocation(info.locationDetail.lat, info.locationDetail.lon);
      router.push(`/login?status=complete&location=${convertLocationLangTo(findLocation, "en")}`);
      // router.push(CONNECT_KAKAO[findLocation]);

      setLocalStorageObj(REGISTER_INFO, null);
    },
    onError: errorToast,
  });

  const onClickNext = () => {
    if (info?.telephone.length < 11) {
      toast("error", "핸드폰 번호를 확인해 주세요.");
      return;
    }
    mutate(info);
  };

  const valueBoxColItems: ValueBoxColItemProps[] = [
    {
      left: "가입비",
      right: "2,000원",
    },
    {
      left: "보증금 (환급 가능)",
      right: "3,000원",
    },
    {
      left: "총 금액",
      right: "= 5,000원",
      isFinal: true,
    },
  ];

  return (
    <>
      <ProgressHeader title="회원 가입" value={100} />
      <RegisterLayout>
        <RegisterOverview>
          <span>최종 가입</span>
          <span>아래 내용 확인 후, 동아리 단톡방으로 참여 요청이 가능합니다!</span>
        </RegisterOverview>
        <TabNav
          isFullSize
          isBlack
          tabOptionsArr={[
            {
              text: "신청 안내",
              func: () => setTab("신청 안내"),
            },
            { text: "자주 묻는 질문", func: () => setTab("자주 묻는 질문") },
          ]}
        />
        <Box mt={5}>
          {tab === "신청 안내" ? (
            <Flex direction="column">
              <ValueBoxCol items={valueBoxColItems} />
              <Box as="li" fontSize="12px" lineHeight="20px" mt="10px" color="gray.600">
                위의 회비는 동아리 가입 후 내야 할 금액입니다.
              </Box>
              <Box my={5}>
                <InfoList items={INFO_ARR} />
              </Box>
              <TextCheckButton
                text="About 동아리 가입을 희망하시나요?"
                isChecked={isChecked}
                toggleCheck={() => setIsChecked((old) => !old)}
              />
            </Flex>
          ) : (
            <Accordion contentArr={ACCORDION_CONTENT_FEE} />
          )}
        </Box>
      </RegisterLayout>
      <BottomNav
        isLoading={isLoading}
        onClick={onClickNext}
        text="동아리 팀 채팅방 참여 요청"
        isActive={isChecked}
      />
    </>
  );
}

const INFO_ARR = [
  "보증금은 일부 활동의 정산 목적으로, 상시 환급이 가능합니다.",
  "가입비는 동아리 운영 및 이벤트 진행비로 활용됩니다.",
  "참여 요청을 완료하시면, 하루 이틀 내 별도 연락을 드립니다.",
];

export default Fee;
