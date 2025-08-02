import { Box, Button, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import { RankingNumIcon } from "../../components/Icons/RankingIcons";
import SocialingScoreBadge from "../../components/molecules/SocialingScoreBadge";
import { RANKING_ANONYMOUS_USERS } from "../../constants/storage/anonymous";
import { ModalLayout } from "../../modals/Modals";
import { RANK_MAP, UserRankingProps } from "../../pages/ranking";
import { formatMinutesToTime } from "../../utils/dateTimeUtils";

interface IRankingMembers {
  users: UserRankingProps[];
  fieldName: "study" | "monthScore" | "temperature";
}

const GIFT_MAP = {
  gold: [
    "배달의민족 10,000원권",
    "올리브영 10,000원권",
    "다이소 10,000원권",
    "스타벅스 기프티콘",
    "베스킨라빈스 기프티콘",
  ],
  silver: ["+ 5,000 Point", "+ 3,000 Point", "+ 2,000 Point", "+ 1,000 Point", "+ 1,000 Point"],
  bronze: ["+ 3,000 Point", "+ 2,000 Point", "+ 1,000 Point", "+ 1,000 Point", "+ 1,000 Point"],
  temperature: [
    "올리브영 10,000원권",
    "스타벅스 기프티콘",
    "스타벅스 기프티콘",
    "베스킨라빈스 기프티콘",
    "베스킨라빈스 기프티콘",
  ],
};

function RankingMembers({ users, fieldName }: IRankingMembers) {
  const { data: session } = useSession();
  const [giftContent, setGiftContent] = useState<{ title: string; text: string }>();
  console.log(users);

  const onClickGift = (type: "gold" | "silver" | "bronze" | "temperature", idx: number) => {
    setGiftContent({
      title: `${type === "temperature" ? "인기" : RANK_MAP[type]} 랭킹 ${idx + 1}위 상품`,
      text: `${GIFT_MAP[type][idx]}`,
    });
  };

  return (
    <>
      {users?.map((user, idx) => {
        const who = user.user;
        const rankNum = idx + 1;
        const value =
          fieldName === "study"
            ? `${formatMinutesToTime(who[fieldName].monthMinutes)}(${who[fieldName].monthCnt}회)`
            : fieldName === "temperature"
            ? who.temperature.temperature
            : who[fieldName];
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
                {!RANKING_ANONYMOUS_USERS.includes(who?.uid) ? who.name : "비공개"}
              </Box>
            </Flex>
            <Flex align="center">
              {fieldName === "monthScore" ? (
                <Box fontSize="14px" mt="2px" lineHeight="20px" mr={2} fontWeight="bold">
                  {value}
                  {fieldName === "monthScore" ? "점" : "°C"}
                </Box>
              ) : (
                <Box mt="2px" mr={2}>
                  <SocialingScoreBadge user={who} size="sm" />
                </Box>
              )}
              <Button
                onClick={() =>
                  onClickGift(fieldName === "monthScore" ? user.user.rank : "temperature", idx)
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

function GiftIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
    <g clip-path="url(#clip0_4007_11)">
      <path
        d="M3.94995 5.27854C5.26723 5.27493 6.59147 5.26808 7.90618 5.29442L7.93547 5.33771L7.9406 18.9525C5.92441 18.9522 3.87527 19.0297 1.84699 18.9865C1.57277 18.9518 1.05765 18.5669 1.05765 18.2851V9.42764C0.549851 9.49403 0.134677 9.31075 0.0420506 8.78688C0.0991644 7.90222 -0.0670514 6.8469 0.0325316 5.98209C0.075367 5.61047 0.370089 5.32076 0.746454 5.27854C1.6665 5.17572 2.98305 5.28107 3.94995 5.27854Z"
        fill="var(--color-yellow)"
      />
      <path
        d="M14.0912 5.27919C15.1698 5.28172 16.2495 5.27486 17.3281 5.28244C17.6696 5.34919 17.9138 5.58947 17.9999 5.91924L17.9926 8.88927C17.9263 9.14688 17.703 9.37382 17.4328 9.42C17.301 9.44237 17.0842 9.37273 17.0568 9.51849L17.0407 18.3059C16.9308 18.6898 16.5845 18.9232 16.1968 18.9896C14.1919 19.0286 12.1666 18.9528 10.1738 18.9532V5.27919C11.479 5.28172 12.7861 5.27631 14.0912 5.27919Z"
        fill="var(--color-yellow)"
      />
      <path
        d="M14.0914 5.27866C12.7862 5.27577 11.4791 5.28118 10.1736 5.27866V18.953C9.43623 18.953 8.68679 18.953 7.94065 18.953L7.93552 5.33819L7.90624 5.29489C6.59152 5.26855 5.26729 5.27577 3.95001 5.27902C3.45905 5.05533 3.01385 4.73747 2.66971 4.32184C0.684635 1.9233 3.52824 -1.42954 6.09068 0.697687C7.30581 1.70646 8.12481 3.35275 9.02069 4.62851C9.78806 3.49671 10.4288 2.25053 11.3635 1.23743C12.3648 0.151449 13.8215 -0.542353 15.1359 0.551567C16.8859 2.00808 15.96 4.45136 14.0914 5.27902V5.27866ZM6.80533 4.59315C6.81522 4.5347 6.77751 4.49538 6.74785 4.45172C6.44288 4.00434 5.43167 2.7993 5.02894 2.46557C4.78987 2.26749 4.33626 2.04524 4.09572 2.37356C3.69299 2.92341 4.86602 3.90332 5.29365 4.15335C5.7685 4.43116 6.26275 4.52496 6.8057 4.59315H6.80533ZM11.1258 4.59279C11.6871 4.55419 12.2235 4.43765 12.7111 4.15299C13.0988 3.92677 13.9416 3.18967 13.9819 2.73472C14.0192 2.31079 13.6194 2.10694 13.2405 2.25703C12.9418 2.37537 12.4504 2.98114 12.2249 3.24055C11.8449 3.67782 11.4949 4.14613 11.1258 4.59243V4.59279Z"
        fill="var(--color-orange)"
      />
      <path
        d="M11.126 4.59255C11.4954 4.14625 11.845 3.6783 12.2251 3.24066C12.4506 2.98125 12.9419 2.37548 13.2407 2.25714C13.6196 2.10705 14.019 2.31054 13.982 2.73483C13.9421 3.18943 13.0993 3.92653 12.7113 4.1531C12.2236 4.43777 11.6869 4.5543 11.126 4.59291V4.59255Z"
        fill="white"
      />
      <path
        d="M6.80554 4.59307C6.26259 4.52488 5.76834 4.43108 5.29349 4.15327C4.86624 3.90324 3.69284 2.92369 4.09557 2.37348C4.3361 2.04516 4.78972 2.26741 5.02879 2.46549C5.43152 2.79922 6.44272 4.00426 6.7477 4.45164C6.77735 4.4953 6.81543 4.53426 6.80518 4.59307H6.80554Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_4007_11">
        <rect width="18" height="19" fill="white" />
      </clipPath>
    </defs>
  </svg>
}

export default RankingMembers;
