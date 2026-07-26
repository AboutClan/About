import { CheckIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import BottomNav from "../components/layouts/BottomNav";
import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import { navigateExternalLink } from "../utils/navigateUtils";

const APP_INSTALL_LINK = "https://about20s.club/download/app";
const KAKAO_CHANNEL_LINK = "https://pf.kakao.com/_SaWXn";
const PARTNER_BENEFIT_LINK = "https://study-about.club/partner";
const CONTACT_CHANNEL_LINK = "https://pf.kakao.com/_SaWXn/chat";
const DETAIL_GUIDE_LINK = "https://guide.about20s.club";
const GATHER_GUIDE_LINK = "https://gather-guide.about20s.club";
const GROUP_GUIDE_LINK = "https://group-guide.about20s.club";

function NumberBadge({ num }: { num: number }) {
  return (
    <Flex
      align="center"
      justify="center"
      w="20px"
      h="20px"
      mt="1px"
      borderRadius="6px"
      bg="var(--color-mint)"
      color="white"
      flexShrink={0}
      fontSize="11px"
      fontWeight={700}
    >
      {num}
    </Flex>
  );
}

function LinkButton({
  text,
  onClick,
  variant = "outline",
}: {
  text: string;
  onClick: () => void;
  variant?: "outline" | "kakao";
}) {
  if (variant === "kakao") {
    return (
      <Button
        mt={2}
        w="100%"
        h="44px"
        bg="#FEE500"
        color="#181600"
        _hover={{ bg: "#FDD800" }}
        _active={{ bg: "#FDD800" }}
        fontSize="14px"
        fontWeight={700}
        rightIcon={<ChevronRightIcon boxSize="18px" color="#181600" />}
        justifyContent="space-between"
        px={4}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  }

  return (
    <Button
      mt={2}
      w="100%"
      h="44px"
      variant="outline"
      borderColor="gray.200"
      color="gray.700"
      fontSize="14px"
      rightIcon={<ChevronRightIcon boxSize="18px" color="gray.400" />}
      justifyContent="space-between"
      px={4}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

function SectionTitle({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <Flex align="flex-start" gap={2} mb={2}>
      <NumberBadge num={num} />
      <Box fontSize="15px" fontWeight={800} color="gray.800" lineHeight="20px">
        {children}
      </Box>
    </Flex>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <Flex align="flex-start" gap={1.5} mt={1.5} pl="28px">
      <Box mt="7px" w="4px" h="4px" borderRadius="50%" bg="gray.400" flexShrink={0} />
      <Box fontSize="13.5px" lineHeight="20px" color="gray.700">
        {children}
      </Box>
    </Flex>
  );
}

function NewbieGuidePage() {
  const router = useRouter();

  // 뒤로가기(브라우저/기기 back)로 register/access 등 이전 화면에 돌아가지 않고 홈으로 이동
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      router.replace("/home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  return (
    <>
      <Header title="뉴비가이드" url="/home" />
      <Slide>
        <Box pb="96px" px={1}>
          <Box mt={2} mb={6}>
            <Box fontSize="20px" fontWeight={800} color="gray.800" lineHeight="28px">
              어바웃에 처음 오셨군요! 👋
            </Box>
            <Box mt={1.5} fontSize="13.5px" color="gray.500" lineHeight="19px">
              시작하기 전에 꼭 알아야 할 내용만 간단히 정리했어요.
            </Box>
          </Box>

          <Box mb={7}>
            <SectionTitle num={1}>앱 설치하기 (필수)</SectionTitle>
            <LinkButton
              text="어바웃 앱 설치하기"
              onClick={() => navigateExternalLink(APP_INSTALL_LINK)}
            />
          </Box>

          <Box
            mb={7}
            p={4}
            borderRadius="14px"
            bg="rgba(255, 205, 0, 0.1)"
            border="1px solid rgba(255, 205, 0, 0.35)"
          >
            <SectionTitle num={2}>카카오 채널 친구 추가하기 (선택)</SectionTitle>
            <Box fontSize="13.5px" lineHeight="20px" color="gray.700" pl="28px" mb={2}>
              카카오 채널을 친구 추가하면 <b>1,000 포인트</b>를 받을 수 있어요. 또한 채널 버튼에서{" "}
              <b>[어바웃 공지 톡방]</b>에 입장할 수 있습니다.
            </Box>
            <Box pl="28px">
              <LinkButton
                text="카카오 채널 바로가기"
                variant="kakao"
                onClick={() => navigateExternalLink(KAKAO_CHANNEL_LINK)}
              />
            </Box>
          </Box>
          <Box
            mb={7}
            p={4}
            borderRadius="14px"
            bg="rgba(0, 194, 179, 0.06)"
            border="1px solid rgba(0, 194, 179, 0.16)"
          >
            <SectionTitle num={3}>뉴비 멤버십 챙기기</SectionTitle>
            <Box fontSize="13.5px" lineHeight="20px" color="gray.700" pl="28px">
              앱 접속 시 뜨는 팝업에서 인스타 팔로우 및 카톡 채널 추가를 하면 뉴비 멤버십이
              적용돼요.
            </Box>
            <Flex align="flex-start" gap={2} mt={2} pl="28px">
              <Flex
                align="center"
                justify="center"
                w="16px"
                h="16px"
                mt="1px"
                borderRadius="50%"
                bg="var(--color-mint)"
                flexShrink={0}
              >
                <CheckIcon boxSize="8px" color="white" />
              </Flex>
              <Box fontSize="13px" lineHeight="18px" color="gray.700" fontWeight={600}>
                포인트 획득량 증가 및 <br />
                월간 번개 참여권 및 소모임 참여권 추가 지급
              </Box>
            </Flex>
          </Box>

          <Box mb={7}>
            <SectionTitle num={4}>어바웃 콘텐츠 소개</SectionTitle>
            <Box fontSize="13.5px" lineHeight="20px" color="gray.700" pl="28px" mb={2}>
              어바웃은 크게 세 가지 콘텐츠로 나뉘어요.
            </Box>
            <Bullet>
              <b>스터디</b>: 가까운 동네로 참여할 수 있는 카공 스터디!
              <br /> 원하는 날짜·장소로 신청하면 스터디가 예정되고, 당일 오전 9시에 참여 인원 확정!
              스터디에 참여하면 포인트도 획득할 수 있습니다.
            </Bullet>
            <Bullet>
              <b>번개</b>: 날짜와 주제가 확정되어 있는 일일 모임!
              <br /> 선착순 모임과 승인제 모임이 존재하고, 번개 참여권 1장이 소모됩니다.
            </Bullet>
            <Bullet>
              <b>소모임</b>: 관심사를 기반으로 지속적으로 활동하는 모임! <br /> 하나의 동아리라고
              생각하면 이해가 쉬워요. 매월 가입중인 소모임 기준으로 소모임 참여권이 소모됩니다.
            </Bullet>
          </Box>

          <Box mb={7}>
            <SectionTitle num={5}>참여권 & 포인트 운영 규칙</SectionTitle>
            <Bullet>
              매월 번개 참여권과 소모임 참여권이 자동 리필돼요!
              <br /> 나의 <b>소셜링 온도</b>에 따라 최대 6장까지 지급됩니다.
            </Bullet>
            <Bullet>
              매월 리필되는 번개 참여권보다 더 많은 모임에 참여하고 싶다면 포인트로 참여권을 추가
              구매할 수 있어요!
            </Bullet>
            <Bullet>
              매월 내가 받는 참여권보다 정산되는 소모임 참여권이 더 많다면, 부족한 만큼{" "}
              <b>포인트로 대체 차감</b>됩니다.
            </Bullet>
            <Bullet>
              포인트는 참여권 구매뿐 아니라 모임 참여 보증금 역할도 해요. 그래서 번개나 스터디 당일
              노쇼 시에도 포인트가 차감될 수 있어요.
            </Bullet>
            <Bullet>
              한 달 동안 앱에 접속조차 하지 않았다면 <b>1,000 포인트</b>가 월간 패널티로 차감돼요.
              한 달에 한번 홈 화면의 일일 출석체크만 눌러도 최소 활동 기준이 만족돼요!
            </Bullet>
          </Box>

          <Box mb={7}>
            <SectionTitle num={6}>신뢰 시스템</SectionTitle>
            <Bullet>
              어바웃은 거리두기, 신고하기, 매너 평가 등 신뢰 시스템을 기반으로 운영돼요. 남에게
              피해를 주는 행위(이성 간 일방적인 연락, 모임 내 불쾌한 언행, 잦은 당일 노쇼 등을
              포함함)으로 신고가 누적되면 활동이 정지될 수 있으니 유의해 주세요.
            </Bullet>
          </Box>

          <Box mb={7}>
            <SectionTitle num={7}>어바웃 제휴 혜택</SectionTitle>
            <Box fontSize="13.5px" lineHeight="20px" color="gray.700" pl="28px" mb={1}>
              어바웃 멤버분들은 전용 제휴처 혜택을 받을 수 있어요.
            </Box>
            <Box pl="28px">
              <LinkButton
                text="제휴 혜택 보러가기"
                onClick={() => navigateExternalLink(PARTNER_BENEFIT_LINK)}
              />
            </Box>
          </Box>

          <Box mb={2}>
            <SectionTitle num={8}>문의하기</SectionTitle>
            <Box fontSize="13.5px" lineHeight="20px" color="gray.700" pl="28px" mb={1}>
              궁금한 점이 있으면 언제든 문의해 주세요.
            </Box>
            <Box pl="28px">
              <LinkButton
                text="어바웃에 문의하기"
                onClick={() => navigateExternalLink(CONTACT_CHANNEL_LINK)}
              />
            </Box>
          </Box>

          <Box mt={8} pt={5} borderTop="var(--border)" textAlign="center">
            <Box fontSize="12px" color="gray.500" mb={1}>
              더 자세한 내용이 궁금하다면
            </Box>
            <Box
              as="span"
              fontSize="13px"
              fontWeight={700}
              color="var(--color-mint)"
              cursor="pointer"
              onClick={() => navigateExternalLink(DETAIL_GUIDE_LINK)}
            >
              상세가이드 보러가기
            </Box>
          </Box>
        </Box>
      </Slide>
      <BottomNav text="홈 화면으로" onClick={() => router.push("/home")} />
    </>
  );
}

export default NewbieGuidePage;
