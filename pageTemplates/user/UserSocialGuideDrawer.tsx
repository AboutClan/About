import { Box, Collapse, Flex } from "@chakra-ui/react";
import { useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import SocialingScoreBadge from "../../components/molecules/SocialingScoreBadge";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { useUserInfoQuery } from "../../hooks/user/queries";

interface UserSocialGuideDrawerProps {
  onClose: () => void;
}

export const getTemperatureTicket = (temp: number, isGirl: boolean) => {
  let gather, group;

  if (temp <= 36.5) {
    gather = 1;
    group = 4;
  } else if (temp < 38) {
    gather = 2;
    group = 4;
  } else if (temp < 40) {
    gather = 3;
    group = 4;
  } else if (temp < 42) {
    gather = 3;
    group = 5;
  } else if (temp < 44) {
    gather = 4;
    group = 5;
  } else {
    gather = 4;
    group = 6;
  }

  // 여자일 경우 보정
  if (isGirl) {
    gather += 1;
    group += 1;
  }

  return { gather, group };
};

function UserSocialGuideDrawer({ onClose }: UserSocialGuideDrawerProps) {
  const { data: userInfo } = useUserInfoQuery();

  const isGirl = userInfo?.gender === "여성";

  const [isBenefit, setIsBenefit] = useState(false);

  const benefitArr: { category: string; text: string }[] = isGirl
    ? [
        { category: "36.5도 - 38도", text: "번개 티켓 3장 / 소모임 티켓 5장" },
        { category: "38도 - 40도", text: "번개 티켓 4장 / 소모임 티켓 5장" },
        { category: "40도 - 42도", text: "번개 티켓 4장 / 소모임 티켓 6장" },
        { category: "42도 - 44도", text: "번개 티켓 5장 / 소모임 티켓 6장" },
        { category: "44도 이상", text: "번개 티켓 5장 / 소모임 티켓 7장" },
      ]
    : [
        { category: "36.5도 - 38도", text: "번개 티켓 2장 / 소모임 티켓 4장" },
        { category: "38도 - 40도", text: "번개 티켓 3장 / 소모임 티켓 4장" },
        { category: "40도 - 42도", text: "번개 티켓 3장 / 소모임 티켓 5장" },
        { category: "42도 - 44도", text: "번개 티켓 4장 / 소모임 티켓 5장" },
        { category: "44도 이상", text: "번개 티켓 4장 / 소모임 티켓 6장" },
      ];

  //   (
  //   Object.entries(benefitProps) as [BenefitName, number][]
  // ).map(([name, value]) => ({
  //   category: BENEFIT_MAPPING[name],
  //   text: value.toLocaleString() + "원",
  // }));

  const { gather, group } = getTemperatureTicket(userInfo?.temperature.temperature, isGirl);

  return (
    <RightDrawer title="스터디 혜택" px={false} onClose={onClose}>
      <Flex px={5} justify="space-between" py={3}>
        <Flex fontSize="16px" w="full">
          <Box>
            <Box as="span" fontWeight="bold" fontSize="18px">
              {userInfo?.name}
            </Box>
            님의 소셜링 온도 =
          </Box>
          <Box ml={1}>
            <SocialingScoreBadge user={userInfo} size="sm" />
          </Box>
        </Flex>
      </Flex>
      <Flex px={5} justify="space-between" py={3} mb={1}>
        <Flex fontSize="16px" fontWeight="bold" w="full">
          <Box as="span" fontSize="16px">
            매월 받는 참여권 =
          </Box>
          <Box as="span" ml={1} color="mint" fontSize="16px">
            번개 티켓 {gather}장 / 소모임 티켓 {group}장
          </Box>
        </Flex>
      </Flex>
      <Box px={5} borderTop="var(--border)" pb={1}>
        <Collapse in={isBenefit} animateOpacity unmountOnExit>
          <Box px={5} mb={1} borderTop="var(--border)">
            <InfoBoxCol infoBoxPropsArr={benefitArr} />
          </Box>
        </Collapse>
      </Box>
      <Box
        fontSize="13px"
        mb={5}
        w="full"
        py={1.5}
        as="button"
        color="white"
        bg="mint"
        borderBottomRadius="12px"
        onClick={() => setIsBenefit((old) => !old)}
      >
        <Flex justify="center" align="center">
          소셜링 온도별 티켓 개수
          <Box ml={1}>
            <ShortArrowIcon dir={isBenefit ? "top" : "bottom"} color="white" />
          </Box>
        </Flex>
      </Box>
      <Flex py={4} justify="space-between" px={10} borderBottom="var(--border)">
        <Avatar size="xl2" user={{ avatar: { type: 2, bg: 6 } }} />
        <Flex flexDir="column" alignItems="flex-end">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            모임 참여권 지급
          </Box>
          <Box as="p" textAlign="end">
            소셜링 온도가 높을수록
            <br />
            지급되는 모임 참여권이 많아져요!
          </Box>
        </Flex>
      </Flex>{" "}
      <Flex py={4} flexDir="row-reverse" justify="space-between" align="center" px={10}>
        <Avatar size="xl2" user={{ avatar: { type: 16, bg: 8 } }} />
        <Flex flexDir="column">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            모임 우선 승인
          </Box>
          <Box as="p" fontSize="14px">
            공식 행사나 인기 모임에서는
            <br />
            소셜링 온도를 적극 반영해 승인해요.
          </Box>
        </Flex>
      </Flex>
      <Flex py={4} justify="space-between" px={10} align="center">
        <Avatar size="xl2" user={{ avatar: { type: 10, bg: 3 } }} />
        <Flex flexDir="column" align="flex-end">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            인기 랭킹 보상
          </Box>
          <Box as="p" textAlign="end">
            매월 인기 랭킹 정산으로
            <br />
            최대 5,000 Point가 지급돼요.
          </Box>
        </Flex>
      </Flex>
      <Flex py={4} flexDir="row-reverse" align="center" justify="space-between" px={10}>
        <Avatar size="xl2" user={{ avatar: { type: 20, bg: 2 } }} />
        <Flex flexDir="column">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            소셜링 신뢰 지표
          </Box>
          <Box as="p">
            누군가를 처음 만나기 전,
            <br />
            긍정적인 첫 이미지를 줄 수 있어요.
          </Box>
        </Flex>
      </Flex>{" "}
      {/* <Box bg="mint">받은 혜택 자세히 보기</Box> */}
      {/* <ValueBoxCol
        items={[
          { left: "123", right: "555" },
          { left: "123", right: "555" },
          { left: "123", right: "555" },
        ]}
      /> */}
      {/* <InfoCol infoArr={[{ left: "234", right: "1515" }]} />
      <InfoBoxCol
        infoBoxPropsArr={[
          { category: "55", text: "12" },
          { category: "55", text: "12" },
        ]}
      /> */}
    </RightDrawer>
  );
}

export default UserSocialGuideDrawer;
