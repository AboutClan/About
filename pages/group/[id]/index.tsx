import "dayjs/locale/ko"; // 로케일 플러그인 로드

import { Badge, Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import BlurredLink from "../../../components/molecules/BlurredLink";
import InfoBoxCol from "../../../components/molecules/InfoBoxCol";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import GroupBottomNav from "../../../pageTemplates/group/detail/GroupBottomNav";
import GroupComments from "../../../pageTemplates/group/detail/GroupComment";
import GroupCover from "../../../pageTemplates/group/detail/GroupCover";
import GroupHeader from "../../../pageTemplates/group/detail/GroupHeader";
import GroupParticipation from "../../../pageTemplates/group/detail/GroupParticipation";
import { transferGroupDataState } from "../../../recoils/transferRecoils";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

export type GroupSectionCategory = "정 보" | "피 드";

function GroupDetail() {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const { id } = useParams<{ id: string }>() || {};

  const [group, setTransferGroup] = useRecoilState(transferGroupDataState);

  const { data: groupData } = useGroupIdQuery(id, { enabled: !!id && !group });

  const isOnlyView = group?.category.main === "콘텐츠";

  useEffect(() => {
    if (groupData) {
      setTransferGroup(groupData);
    }
  }, [groupData]);

  // useEffect(() => {
  //   if (!group) return;
  //   const firstDate = group.attendance.firstDate;
  //   if (!firstDate) return;
  //   if (firstDate !== dayjsToStr(dayjs().subtract(1, "day").startOf("week").add(1, "day")))
  //     patchAttendance();
  // }, [group?.attendance?.firstDate]);

  const isMember =
    group &&
    [...group.participants.map((who) => who.user)].some((who) => who?.uid === session?.user.uid);

  return (
    <>
      {group && <GroupHeader group={group} />}
      <Slide isNoPadding>
        {group && (
          <>
            <GroupCover image={group?.image} />
            {!isOnlyView && (
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
                          : "2024년 12월 22일",
                    },
                    { category: "가입 방식", text: group.isFree ? "자유 가입" : "승인제" },
                    { category: "보증금", text: group.fee ? group.fee + "원" : "없음" },
                    {
                      category: "활동 톡방",
                      rightChildren: <BlurredLink isBlur={!isMember} url={group?.link} />,
                    },
                  ]}
                  size="md"
                />
              </Flex>
            )}
            <Box mt={isOnlyView ? 0 : 5} h={2} bg="gray.100" />
            <Flex direction="column" mb={10}>
              <Box px={5}>
                <Box my={4} fontSize="18px" fontWeight="bold" lineHeight="28px">
                  소개
                </Box>
                {group.category.main === "시험기간" ? (
                  <Box fontSize="12px" mb={4} color="mint">
                    ※ 해당 챌린지는 카톡방에서 진행됩니다. 관련 사항은 동아리 공지방을 확인해주세요!
                  </Box>
                ) : group.status === "resting" ? (
                  <Box fontSize="12px" mb={4} color="mint">
                    ※ 현재 휴식중인 소모임입니다. 방학 중 활동 예정!
                  </Box>
                ) : null}
                <Box
                  color="gray.600"
                  fontWeight="regular"
                  fontSize="12px"
                  fontFamily="apple"
                  whiteSpace="pre-wrap"
                  lineHeight="18px"
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
                      <UnorderedList>
                        {group.rules.map((rule, idx) => (
                          <ListItem key={idx}>
                            <Text lineHeight="20px">{rule}</Text>
                          </ListItem>
                        ))}
                      </UnorderedList>
                    </Box>
                  </>
                ) : null}
                {group?.notionUrl ? (
                  <Box fontSize="13px" lineHeight="20px">
                    <a
                      href={group.notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: "600", color: "var(--color-blue)" }}
                    >
                      <u>&gt;&gt; 활동 기록 보러가기</u>
                    </a>
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
              {!isOnlyView ? (
                <>
                  <GroupParticipation data={group} />
                  <GroupComments comments={group.comments} hasAutority={isMember} />
                </>
              ) : null}
            </Flex>
          </>
        )}
      </Slide>

      {!group && <MainLoading />}
      {group && !isMember && !isGuest ? <GroupBottomNav data={group} /> : null}
    </>
  );
}

export default GroupDetail;
