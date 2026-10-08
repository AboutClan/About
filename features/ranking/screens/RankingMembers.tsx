import { Box, Button, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import Avatar from "@/components/atoms/Avatar";
import { GiftIcon } from "@/components/Icons/GiftIcon";
import { RankingNumIcon } from "@/components/Icons/RankingIcons";
import { StarIcon } from "@/components/Icons/StarIcons";
import { ModalLayout } from "@/components/modals/Modals";
import SocialingScoreBadge from "@/components/molecules/SocialingScoreBadge";
import { getStudyBadgePrizeTier } from "@/constants/serviceConstants/studyConstants/studyBadgeConstant";
import { RANKING_ANONYMOUS_USERS } from "@/constants/storage/anonymous";
import { RANK_MAP, UserRankingProps } from "@/pages/ranking";

interface IRankingMembers {
  users: UserRankingProps[];
  fieldName: "study" | "monthScore" | "temperature";
}

const GIFT_MAP = {
  gold: [
    "배달의민족 10,000원권",
    "올리브영 10,000원권",
    "스타벅스 기프티콘",
    "스타벅스 기프티콘",
    "베스킨라빈스 기프티콘",
  ],
  silver: ["+ 3,000 Point", "+ 2,000 Point", "+ 1,000 Point", "+ 1,000 Point", "+ 1,000 Point"],
  bronze: ["+ 3,000 Point", "+ 2,000 Point", "+ 1,000 Point", "+ 1,000 Point", "+ 1,000 Point"],
  temperature: [
    "+ 5,000 Point",
    "+ 3,000 Point",
    "+ 1,000 Point",
    "+ 1,000 Point",
    "+ 1,000 Point",
  ],
};

function RankingMembers({ users, fieldName }: IRankingMembers) {
  const { data: session } = useSession();
  const [giftContent, setGiftContent] = useState<{ title: string; text: string }>();

  const onClickGift = (
    type: "gold" | "silver" | "bronze" | "temperature" | "study",
    idx: number,
  ) => {
    // 스터디 보상은 구간 단위라(1~5등 / 6~20등 / 21~50등) 등수별 목록을 따로 두지 않는다.
    if (type === "study") {
      const tier = getStudyBadgePrizeTier(idx + 1);

      setGiftContent({
        title: `스터디 랭킹 ${idx + 1}위 상품`,
        text: tier ? `${tier.emoji} ${tier.label}` : "-",
      });
      return;
    }

    setGiftContent({
      title: `${type === "temperature" ? "인기" : RANK_MAP[type]} 랭킹 ${idx + 1}위 상품`,
      text: `${GIFT_MAP[type][idx]}`,
    });
  };

  return (
    <>
      {users?.map((user, idx) => {
        const who = user.user;
        // 스터디 탭만 서버가 계산한 순위를 쓴다(동점이면 같은 등수). 나머지 두 탭은
        // 지금까지 인덱스를 등수로 보여 왔으므로 표시를 바꾸지 않는다.
        const rankNum = fieldName === "study" ? user.rank : idx + 1;
        // 스터디 탭은 배지 개수(user.value)를 그대로 쓴다.
        const value = fieldName === "monthScore" ? who.monthScore : who.temperature?.temperature;
        return (
          <Flex px={3} py={1} pr={5} align="center" key={idx} id={`ranking${who._id}`}>
            <Flex justify="center" mr="10px">
              <RankingNumIcon num={rankNum} />
            </Flex>
            <Flex flex={1} align="center">
              <Flex w={9} h={9} justify="center" align="center" mr={0.5}>
                <Avatar
                  user={user?.user}
                  size="xs1"
                  isPriority={idx < 6}
                  isLink={!RANKING_ANONYMOUS_USERS.includes(who?.uid)}
                />
              </Flex>
              <Box
                fontWeight={who.uid === session?.user.uid ? "semibold" : "medium"}
                color={who.uid === session?.user.uid ? "mint" : "inherit"}
              >
                {who.name}
              </Box>
            </Flex>
            <Flex align="center">
              {fieldName === "study" ? (
                <BadgeCountLabel cnt={user.value} />
              ) : // <Box fontSize="14px" mt="2px" lineHeight="20px" mr={2} fontWeight="bold">
              //   {value}점
              // </Box>
              fieldName !== "temperature" ? (
                <Box fontSize="14px" mt="2px" lineHeight="20px" mr={2} fontWeight="bold">
                  {value}점
                </Box>
              ) : (
                <Box mt="2px" mr={2}>
                  <SocialingScoreBadge user={who} size="sm" />
                </Box>
              )}
              <Button
                onClick={() =>
                  onClickGift(fieldName === "monthScore" ? user.user.rank : fieldName, idx)
                }
                variant="unstyled"
              >
                {idx < 5 && <GiftIcon />}
              </Button>
            </Flex>
          </Flex>
        );
      })}
      {giftContent && (
        <ModalLayout
          footerOptions={{}}
          title={giftContent.title}
          setIsModal={() => setGiftContent(null)}
        >
          <b>{giftContent.text}</b>
        </ModalLayout>
      )}
    </>
  );
}

/**
 * 이번 달 배지 개수. 스터디 출석 스탬프와 같은 표현(민트 원형 + 별)을 써서
 * 여기 숫자가 그 스탬프를 센 것이라는 걸 설명 없이 알아보게 한다.
 */
function BadgeCountLabel({ cnt }: { cnt: number }) {
  return (
    <Flex align="center" mr={2}>
      <Flex w="22px" h="22px" justify="center" align="center" borderRadius="50%" bg="mint" mr={1}>
        <StarIcon />
      </Flex>
      <Box fontSize="14px" lineHeight="20px" fontWeight="bold">
        {cnt}
      </Box>
    </Flex>
  );
}

export default RankingMembers;
