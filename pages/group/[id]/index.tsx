import "dayjs/locale/ko"; // 로케일 플러그인 로드

import { Badge, Box, Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { GROUP_GATHERING_IMAGE } from "../../../assets/images/randomImages";
import WritingButton from "../../../components/atoms/buttons/WritingButton";
import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import BlurredLink from "../../../components/molecules/BlurredLink";
import InfoBoxCol from "../../../components/molecules/InfoBoxCol";
import TabNav from "../../../components/molecules/navs/TabNav";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { checkGroupGathering } from "../../../libs/group/checkGroupGathering";
import GroupBottomNav from "../../../pageTemplates/group/detail/GroupBottomNav";
import GroupComments from "../../../pageTemplates/group/detail/GroupComment";
import ContentFeed from "../../../pageTemplates/group/detail/GroupContent/ContentFeed";
import GroupCover from "../../../pageTemplates/group/detail/GroupCover";
import GroupHeader from "../../../pageTemplates/group/detail/GroupHeader";
import GroupParticipation from "../../../pageTemplates/group/detail/GroupParticipation";
import { transferGroupDataState } from "../../../recoils/transferRecoils";
import { convertMeetingTypeToKr } from "../../../utils/convertUtils/convertText";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

export type GroupSectionCategory = "정 보" | "피 드";
const TAB_LIST: GroupSectionCategory[] = ["정 보", "피 드"];

function GroupDetail() {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const { id } = useParams<{ id: string }>() || {};

  const [category, setCategory] = useState<GroupSectionCategory>("정 보");

  const [group, setTransferGroup] = useRecoilState(transferGroupDataState);

  const { data: groupData, refetch } = useGroupIdQuery(id, { enabled: !!id && !group });

  useEffect(() => {
    if (groupData) {
      setTransferGroup(groupData);
    }
  }, [groupData]);
  console.log(group, groupData);

  // useEffect(() => {
  //   if (!group) return;
  //   const firstDate = group.attendance.firstDate;
  //   if (!firstDate) return;
  //   if (firstDate !== dayjsToStr(dayjs().subtract(1, "day").startOf("week").add(1, "day")))
  //     patchAttendance();
  // }, [group?.attendance?.firstDate]);

  const belong = group && checkGroupGathering(group.hashTag);

  const isMember =
    group &&
    [group.organizer, ...group.participants.map((who) => who.user)].some(
      (who) => who?.uid === session?.user.uid,
    );

  const resetCache = () => {
    setTransferGroup(null);
    refetch();
  };

  return (
    <>
      {group && <GroupHeader group={group} />}
      <Slide isNoPadding>
        {group && (
          <>
            <GroupCover image={belong ? GROUP_GATHERING_IMAGE : group?.image} />
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
                  { category: "진행 방식", text: convertMeetingTypeToKr(group?.meetingType) },
                  { category: "보증금", text: group.fee ? group.fee + "원" : "없음" },
                ]}
                size="md"
              />
            </Flex>
            <Box mt={5} h={2} bg="gray.100" />
            <Flex direction="column" mb={10}>
              <Box px={5}>
                <TabNav
                  tabOptionsArr={TAB_LIST.map((category) => ({
                    text: category,
                    func: () => setCategory(category),
                    flex: 1,
                  }))}
                  selected={category}
                  isFullSize
                  isBlack
                />
              </Box>
              {category === "정 보" ? (
                <Box px={5}>
                  <Box my={4} fontSize="18px" fontWeight="bold" lineHeight="28px">
                    소개
                  </Box>
                  {group.category.main === "시험기간" && (
                    <Box fontSize="12px" mb={4} color="mint">
                      ※ 해당 챌린지는 카톡방에서 진행됩니다. 관련 사항은 동아리 공지방을
                      확인해주세요!
                    </Box>
                  )}
                  <Box
                    color="gray.600"
                    fontWeight="regular"
                    fontSize="12px"
                    lineHeight="18px"
                    fontFamily="apple"
                    whiteSpace="pre-wrap"
                    mb={4}
                  >
                    {group.content}
                  </Box>
                  {group.rules.length ? (
                    <>
                      <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px">
                        <UnorderedList>
                          <ListItem>규칙</ListItem>
                        </UnorderedList>
                      </Box>
                      <Box
                        fontWeight="light"
                        fontSize="12px"
                        lineHeight="20px"
                        bg="rgba(160, 174, 192, 0.08)"
                        px={3}
                        py={4}
                        borderRadius="8px"
                      >
                        <UnorderedList>
                          {group.rules.map((rule, idx) => (
                            <ListItem key={idx}>{rule}</ListItem>
                          ))}
                        </UnorderedList>
                      </Box>
                    </>
                  ) : null}
                  {group?.link ? (
                    <Box lineHeight="20px" mt={4} fontSize="13px">
                      <Box>
                        <b style={{ color: "var(--gray-800)" }}>단톡방 링크</b>(가입 후 입장)
                      </Box>
                      <BlurredLink isBlur={!isMember} url={group.link} />
                    </Box>
                  ) : null}
                  <Flex mt={4}>
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
              ) : (
                <ContentFeed group={group} />
              )}
              <Box h="1px" my={5} bg="gray.100" />
              {group.category.main !== "시험기간" ? (
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
      {group && category === "정 보" && !isMember && !isGuest ? (
        <GroupBottomNav data={group} />
      ) : category === "피 드" && isMember ? (
        <WritingButton
          url={`/feed/writing/group?id=${id}`}
          isBottomNav={false}
          onClick={resetCache}
        />
      ) : null}
    </>
  );
}

export default GroupDetail;
