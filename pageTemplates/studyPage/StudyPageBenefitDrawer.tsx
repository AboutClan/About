import { Box, Collapse, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { usePointPlusLogQuery, useUserInfoQuery } from "../../hooks/user/queries";

type BenefitName = "study" | "event" | "host" | "etc";

const BENEFIT_MAPPING = {
  study: "스터디",
  event: "이벤트",
  host: "모임 개설",
  etc: "기타",
};
interface StudyPageBenefitDrawerProps {
  onClose: () => void;
}

function StudyPageBenefitDrawer({ onClose }: StudyPageBenefitDrawerProps) {
  const { data: userInfo } = useUserInfoQuery();

  const { data: logs } = usePointPlusLogQuery();

  const [isBenefit, setIsBenefit] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [benefitProps, setBenefitProps] = useState<Record<BenefitName, number>>({
    study: 0,
    event: 0,
    host: 0,
    etc: 0,
  });

  const benefitArr: { category: string; text: string }[] = (
    Object.entries(benefitProps) as [BenefitName, number][]
  ).map(([name, value]) => ({
    category: BENEFIT_MAPPING[name],
    text: value.toLocaleString() + "원",
  }));

  useEffect(() => {
    if (!logs?.length) return;

    const temp = benefitProps;
    logs.forEach((log) => {
      const sub = log.meta.sub;
      const value = log.meta.value;
      if (["study", "event", "host"].includes(sub)) {
        temp[sub] += value;
      } else if (sub === "coupon") {
        temp["event"] += value;
      } else {
        temp["etc"] += value;
      }

      setTotalValue((old) => (old += value));
    });
    setBenefitProps(temp);
  }, [logs]);

  return (
    <RightDrawer title="혜택" px={false} onClose={onClose}>
      <Flex px={5} h="120px" justify="space-between" py={3}>
        <Box fontSize="16px">
          <Box as="span" fontWeight="bold" fontSize="18px">
            {userInfo?.name}
          </Box>
          님이
          <br />
          지금까지 받은 혜택 💚{" "}
        </Box>
        <Flex flexDir="column" justify="flex-end">
          <Box as="span" color="mint" fontSize="16px" fontWeight="extrabold">
            <Box as="span" fontSize="28px">
              {userInfo?.role === "guest" ? "23,700" : totalValue.toLocaleString()}
            </Box>{" "}
            원
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
          받은 혜택 자세히 보기
          <Box ml={1}>
            <ShortArrowIcon dir={isBenefit ? "top" : "bottom"} color="white" />
          </Box>
        </Flex>
      </Box>{" "}
      <Flex py={4} justify="space-between" px={10} borderBottom="var(--border)">
        <Avatar size="xl2" user={{ avatar: { type: 5, bg: 6 } }} />
        <Flex flexDir="column" alignItems="flex-end">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            카공 스터디 참여
          </Box>
          <Box as="p" textAlign="end">
            동네 친구와 함께하는 카공 스터디!
            <br />
            매번{" "}
            <Box as="b" color="inherit">
              최대 1,000원
            </Box>{" "}
            적립
          </Box>
        </Flex>
      </Flex>{" "}
      <Flex py={4} flexDir="row-reverse" justify="space-between" align="center" px={10}>
        <Avatar size="xl2" user={{ avatar: { type: 17, bg: 8 } }} />
        <Flex flexDir="column">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            스터디 랭킹 도전
          </Box>
          <Box as="p" fontSize="14px">
            공부하고 랭킹을 올려보세요!
            <br />
            <Box as="b" color="inherit">
              월 최대 30,000원
            </Box>{" "}
            지급
          </Box>
        </Flex>
      </Flex>
      <Flex py={4} justify="space-between" px={10} align="center">
        <Avatar size="xl2" user={{ avatar: { type: 7, bg: 3 } }} />
        <Flex flexDir="column" align="flex-end">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            개인 스터디 인증
          </Box>
          <Box as="p" textAlign="end">
            매일 공부하고 사진 인증해요!
            <br />
            매번{" "}
            <Box as="b" color="inherit">
              최대 500원
            </Box>{" "}
            적립
          </Box>
        </Flex>
      </Flex>
      <Flex py={4} flexDir="row-reverse" align="center" justify="space-between" px={10}>
        <Avatar size="xl2" user={{ avatar: { type: 19, bg: 2 } }} />
        <Flex flexDir="column">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            카공 장소 등록
          </Box>
          <Box as="p">
            나만 알던 카공 맛집 있나요?
            <br />
            등록하고 상품 받아가세요!
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

export default StudyPageBenefitDrawer;
