import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/scrollbar";

import { Badge, Box, Flex, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Autoplay, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Avatar from "../../../components/atoms/Avatar";
function RegisterReview({ isShort }: { isShort: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <Flex flexDir="column" alignItems="center" mt={10} textAlign="center">
        {!isShort && (
          <Stack spacing={2} mb={5}>
            <Badge alignSelf="center" px={3} py={1} borderRadius="md" bg="mint" color="white">
              04
            </Badge>

            <Heading fontSize="2xl">생생한 리얼 후기</Heading>
            <Text color="gray.500">
              10명 중 9명이 재참여 하는 <b>실제 동아리원 후기</b>
            </Text>
          </Stack>
        )}
        <StyledSwiper
          modules={[Autoplay, Scrollbar]}
          scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
          style={{
            width: "100%",
            height: "auto",
            position: "relative",
          }}
          slidesPerView={1.2}
          spaceBetween={20}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={4000} // 숫자 클수록 천천히
          loop={true}
          onSwiper={(swiper) => {
            const kick = () => {
              swiper.update();
              swiper.autoplay?.stop();
              swiper.autoplay?.start();
            };

            // 1프레임은 부족한 경우가 많아서 2~3번 보강
            requestAnimationFrame(() => {
              kick();
              requestAnimationFrame(() => {
                kick();
                setTimeout(kick, 50);
              });
            });
          }}
        >
          {REVIEW_ARR.map((item, index) => {
            const cnt = index % 2;
            const bg = cnt === 0 ? "gray.800" : cnt === 1 ? "white" : "green";
            return (
              <SwiperSlide key={index}>
                <Box
                  bg={bg}
                  borderRadius="2xl"
                  pt={6}
                  pb={6}
                  px={5}
                  color={bg === "white" ? "gray.800" : "white"}
                  border={bg === "white" ? "1px solid var(--color-mint)" : null}
                >
                  <VStack align="start" spacing={4} h="370px">
                    <Text
                      fontSize="18px"
                      fontWeight="bold"
                      lineHeight="1.4"
                      whiteSpace="pre-line"
                      textAlign="start"
                    >
                      {`"${item.title}"`}
                    </Text>

                    {/* 본문 */}
                    <Text
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                      fontSize="14px"
                      opacity={0.9}
                      lineHeight="1.6"
                      textAlign="start"
                    >
                      {item.text}
                    </Text>

                    {/* 작성자 */}
                    <Flex alignItems="center" mt="auto">
                      <Avatar user={{ avatar: item.avatar }} size="xs1" />
                      <Text ml={2} fontSize="14px" opacity={0.7}>
                        {item.avatar.name}
                      </Text>
                    </Flex>
                  </VStack>
                </Box>
              </SwiperSlide>
            );
          })}
        </StyledSwiper>
      </Flex>
    </>
  );
}
const StyledSwiper = styled(Swiper)`
  .swiper-wrapper {
    display: -webkit-inline-box;
  }
`;
export default RegisterReview;

const REVIEW_ARR: {
  title: string;
  text: string;
  avatar: { type: number; bg: number; name: string };
}[] = [
  {
    avatar: {
      name: "김*연",
      type: 14,
      bg: 0,
    },
    title: "동아리 1개 가입비로 무제한 가입이 되니 완전 이득이죠ㅎ",
    text: `솔직히 처음엔 2만원이 살짝 고민됐어요
근데 동아리 하나 가입해도 보통 3만원은 내잖아요?

만원은 탈퇴할 때 돌려받을수도 있으니까 "찍먹 해보고 안맞으면 나가자" 하고 들어왔는데 지금 소모임 3개 활동 중이에요ㅋㅋ 이미 본전은 넘기고 새로 생기는 소모임만 기다리고 있어여ㅎㅎ`,
  },

  {
    title: "프로필이 있어서 처음 보는 사람이 덜 불편해요",
    avatar: {
      name: "이*준",
      type: 5,
      bg: 6,
    },
    text: `
예전에 에**타임에서 연합친목동아리 참여하려고 한 적이 있었는데... 알고 보니까 거기는 좀 이상한? 종교 단체였더라구요?? 

그 후로 동아리 활동이 괜히 겁나고 의심됐었는데 여기는 프로필이랑 매너 점수까지 다 공개되서 좀 안심이었어요ㅎㅎ성별, 과, MBTI까지 나와서 ㅋㅋㅋ 모르는 사람이어도 많이 어색하지 않아요`,
  },

  {
    title: "인생 친구를 만날 수 있던 썰!",
    avatar: {
      name: "박*은",
      type: 18,
      bg: 1,
    },
    text: `
타지역에서 와서 학교 친구 말고는 친구가 아예 없었어요. 학교 친구들은 수업이 달라지거나 방학이 되면 연락이 딱 끊기더라구요ㅠ 

그래서 친구를 사귈 수 있는 방법을 찾다가 여기를 들어오게됐어요. 여기는 일부러 또래랑 관심사가 같은 친구들로 활동을 묶어주셔서 자연스럽게 인생 친구를 만날 수 있었어요ㅎㅎ 동아리 가입하길 잘한 거 같아요
`,
  },
  {
    title: "당일이든 언제든 바로 참여 가능한 동아리 활동",
    avatar: {
      name: "이*준",
      type: 31,
      bg: 2,
    },
    text: `알바나 갑작스러운 과제 같은 거 때문에 약속을 잡고 또 일정이 생기는게 괜히 부담스럽기두 했어요
    
근데 여기는 제가 시간날 떄 신청하고 바로 참여할 수 있는게 너무 좋아요`,
  },

  {
    title: "공부해야지... 생각만 하던 저에게 딱이에요",
    avatar: {
      name: "장*우",
      type: 6,
      bg: 105,
    },
    text: `
혼자서는 공부가 진짜 안되는 거 같아요ㅋㅋㅋ 책만 피면 릴스가 너무 재밌구ㅋㅋㅋㅋ 여기서는 거의 매일 카공이 열려서 같이 공부하니까 확실히 집중도 잘되구 딴짓두 안하게 되더라구요!! 

그리구 약속이 잡힌거니까 안가기 좀 그래서 공부 안하고 싶어도 억지로 가서 하니까 의외로 좋더라구여
`,
  },
  {
    title: "3년차 고인물의 찐 동아리 후기",
    avatar: {
      name: "조*연",
      type: 28,
      bg: 7,
    },
    text: `벌써 가입한 지 3년... 스터디로 들어왔다가 취업 성공하구 이제는 번개랑 소모임 위주로 나가고 있어요ㅋㅋ

다른 동아리도 가보긴 했는데 여기가 확실히 나이대가 비슷하고 사람도 괜찮구ㅎㅎ 활동도 엄청 다양해서 여기로 정착했어요 

아 그리고 여기가 다른 동아리 활동보다 확실히 돈이 덜 들어요ㅋㅋㅋㅋ`,
  },
  {
    title: "모임장 맛집이에여",
    avatar: {
      name: "김*지",
      type: 17,
      bg: 8,
    },
    text: `저는 낯을 좀 가려서 누가 먼저 말걸어주면 좋겠는데 여기 운영자?모임장?님들 대박이에요ㅋㅋㅋㅋ 
    
거의 MC를 하시더라구요ㅋㅋㅋㅋ 덕분에 다른 분들과 빨리 친해지고 어색한거도 금방 풀렸어요 ㅎㅎ

그리구 운영자님 엄청 꼼꼼하신 거 같아요! 단톡방 관리도 자주 해주시고 특히 맴버관리... 철저하셔서 너무 좋았어용`,
  },
  {
    title: "여기서 연애 시작했어요 🥰",
    avatar: {
      name: "김*우",
      type: 19,
      bg: 1,
    },
    text: `
이건 진짜 비밀인데요...🤫
저 동아리 가입 2년차 커플이에요! 

예전에 가입했던 동아리는 다 놀기만 하는 분위기였는데, 어바웃은 관심사 기반으로 활동을 하다 보니 괜찮은 사람도 많고 커플도 많이 생겨요 ㅎㅎ

지금도 소모임에서 같이 활동하고 있어요!
결과적으로는 제일 큰 수확(?)이었네요
`,
  },
];
