import "dayjs/locale/ko"; // 로케일 플러그인 로드

import { Badge, Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

import WritingButton from "../../../components/atoms/buttons/WritingButton";
import { MainLoading, MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import BlurredLink from "../../../components/molecules/BlurredLink";
import { GatherThumbnailCard } from "../../../components/molecules/cards/GatherThumbnailCard";
import ExternalLink from "../../../components/molecules/ExternalLink";
import InfoBoxCol from "../../../components/molecules/InfoBoxCol";
import TabNav from "../../../components/molecules/navs/TabNav";
import { useGatherGroupQuery } from "../../../hooks/gather/queries";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import GroupBottomNav from "../../../pageTemplates/group/detail/GroupBottomNav";
import GroupComments from "../../../pageTemplates/group/detail/GroupComment";
import GroupCover from "../../../pageTemplates/group/detail/GroupCover";
import GroupHeader from "../../../pageTemplates/group/detail/GroupHeader";
import GroupParticipation from "../../../pageTemplates/group/detail/GroupParticipation";
import { setGatherDataToCardCol } from "../../../pageTemplates/home/HomeGatherCol";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

export type GroupSectionCategory = "정 보" | "피 드";

function GroupDetail() {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const { id } = useParams<{ id: string }>() || {};

  const setGatherWriting = useSetRecoilState(sharedGatherWritingState);

  const [tab, setTab] = useState<GroupSectionCategory>("정 보");
  const { data: group } = useGroupIdQuery(id, { enabled: !!id });

  const { data: gathers, isLoading } = useGatherGroupQuery(id, {
    enabled: tab === "피 드" && !!id,
  });
  console.log(3, gathers);
  const findMyInfo =
    group?.participants && group.participants.find((who) => who?.user?._id === session?.user?.id);

  const isAdmin =
    findMyInfo?.role === "admin" ||
    findMyInfo?.role === "manager" ||
    session?.user.name === "어바웃";

  const handleGatheringButton = () => {
    setGatherWriting({
      type: { title: group.category.main, subtitle: "" },
      title: `[${group.title}] 오픈 번개`,
      content: `[${group.title}]에서 진행하는 번개입니다! 관심있는 분들 모두 환영해요 :)`,
      image: `${group.squareImage}`,
      coverImage: `${group.image}`,
    });
  };

  const gatherData = gathers && setGatherDataToCardCol(gathers, true);

  return (
    <>
      {group && <GroupHeader group={group} />}
      {group && (
        <Slide isNoPadding>
          <GroupCover image={group?.image} />

          <Flex direction="column" px={5} py={4}>
            <Flex mb={4}>
              <Badge mr={1} variant="subtle" size="lg" colorScheme="badgeMint">
                {group.category.main}
              </Badge>
              <Badge variant="subtle" size="lg">
                {group.category.sub}
              </Badge>
            </Flex>

            {/* <GroupTitle
                isAdmin={group.organizer.uid === session?.user.uid}
                memberCnt={group.participants.length}
                title={group.title}
                status={group.status}
                category={group.category.main}
                maxCnt={group.memberCnt.max}
                isWaiting={group.waiting.length !== 0}
              /> */}
            <Box mb={4} fontSize="18px" fontWeight="bold" lineHeight="28px">
              {group.title}
            </Box>
            <InfoBoxCol
              infoBoxPropsArr={[
                {
                  category: group.participants.length > 1 ? "개 설" : "개설 예정",
                  text:
                    group.participants.length > 1
                      ? dayjsToFormat(dayjs(group.createdAt), "YYYY년 M월 D일")
                      : "2025년 중",
                },
                { category: "가입 방식", text: group.isFree ? "자유 가입" : "승인제" },
                { category: "보증금", text: group.fee ? group.fee + "원" : "없음" },
                {
                  category: "활동 톡방",
                  rightChildren: <BlurredLink isBlur={!findMyInfo} url={group?.link} />,
                },
              ]}
              size="md"
            />
          </Flex>
          <Box px={5} borderBottom="var(--border)">
            <TabNav
              tabOptionsArr={[
                { text: "정 보", func: () => setTab("정 보") },
                { text: "피 드", func: () => setTab("피 드") },
              ]}
              isFullSize
              isBlack
            />
          </Box>
          {tab === "정 보" ? (
            <Flex direction="column" mb={10}>
              <Box px={5}>
                <Box my={4} fontSize="18px" fontWeight="bold" lineHeight="28px">
                  모임 소개
                </Box>
                {group.status === "resting" ? (
                  <Box fontSize="12px" mb={4} color="mint">
                    ※ 현재 휴식중인 소모임입니다. 방학 중 활동 예정!
                  </Box>
                ) : null}
                <Box
                  color="gray.800"
                  fontWeight="regular"
                  fontSize="14px"
                  fontFamily="apple"
                  whiteSpace="pre-wrap"
                  mb={5}
                >
                  {group.content}
                </Box>{" "}
                {group.rules.length ? (
                  <>
                    <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px">
                      <UnorderedList ml={-1.5}>
                        <ListItem
                          className="colored-bullet"
                          sx={{
                            "::marker": {
                              color: "blue", // 원하는 색상
                            },
                          }}
                        >
                          <Text lineHeight="20px">규 칙</Text>
                        </ListItem>
                      </UnorderedList>
                    </Box>
                    <Box
                      fontWeight="light"
                      fontSize="12px"
                      lineHeight="20px"
                      bg="rgba(160, 174, 192, 0.08)"
                      py={4}
                      borderRadius="8px"
                      mb={5}
                    >
                      {group.rules.length === 1 ? (
                        <Box px={4}>※ {group.rules[0]}</Box>
                      ) : (
                        <UnorderedList>
                          {group.rules.map((rule, idx) => (
                            <ListItem key={idx}>
                              <Text lineHeight="20px">{rule}</Text>
                            </ListItem>
                          ))}
                        </UnorderedList>
                      )}
                    </Box>
                  </>
                ) : null}
                {group?.notionUrl ? (
                  <Box fontSize="13px" lineHeight="20px">
                    <ExternalLink
                      href={group.notionUrl}
                      style={{ fontWeight: "600", color: "var(--color-blue)" }}
                    >
                      <u>&gt;&gt; 활동 기록 보러가기</u>
                    </ExternalLink>
                  </Box>
                ) : null}
                <Flex mt={5}>
                  {group.hashTag?.split("#").map((tag, idx) =>
                    tag ? (
                      <Box
                        h={5}
                        py={1}
                        px={2}
                        fontSize="10px"
                        fontWeight="medium"
                        color="gray.600"
                        borderRadius="4px"
                        bg="gray.100"
                        mr={1}
                        key={idx}
                      >
                        #{tag}
                      </Box>
                    ) : null,
                  )}
                </Flex>
              </Box>

              <Box h="1px" my={5} bg="gray.100" />

              <GroupParticipation data={group} />
              <GroupComments comments={group.comments} hasAutority={!!findMyInfo} />
            </Flex>
          ) : (
            <Box pt={3} mx={5} mb={10}>
              {gatherData?.length ? (
                gatherData?.map((cardData, idx) => (
                  <Box mb="12px" key={idx}>
                    <GatherThumbnailCard {...cardData} />
                  </Box>
                ))
              ) : isLoading ? (
                <Box mt="48px" pos="relative">
                  <MainLoadingAbsolute size="sm" />
                </Box>
              ) : (
                <Box color="gray.600" mb={40} as="p" fontSize="14px" mt={20} textAlign="center">
                  아직 업로드 된 피드가 없습니다.
                </Box>
              )}
            </Box>
          )}
        </Slide>
      )}
      {isAdmin && (
        <WritingButton
          url={`/gather/writing/category?groupId=${group?.id}`}
          type="thunder"
          isBottomNav={false}
          onClick={handleGatheringButton}
        />
      )}
      {!group && <MainLoading />}
      {group && !findMyInfo && !isGuest ? <GroupBottomNav data={group} /> : null}
    </>
  );
}

export default GroupDetail;
