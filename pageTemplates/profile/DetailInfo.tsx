import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import InfoList from "../../components/atoms/lists/InfoList";
import BlurredPart from "../../components/molecules/BlurredPart";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../utils/convertUtils/convertTypes";

function DetailInfo({ user, groups }: { user: IUser; groups: string[] }) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const isPrivate =
    user?.isPrivate && !user?.friend.includes(session?.user.uid) && user?.uid !== session?.user.uid;

  const itemMapping: { category: string; text?: string; texts?: string[] }[] = !user
    ? []
    : [
        {
          category: "성별",
          text: user?.gender,
        },
        {
          category: "나이",
          text: "만" + " " + birthToAge(user?.birth) + "세",
        },
        {
          category: "MBTI",
          text: user?.mbti,
        },
        {
          category: "전공",
          text: user?.majors?.[0]?.detail,
        },
        {
          category: "활동지",
          text:
            user?.locationDetail?.address?.split(" ")[0] +
            " " +
            user?.locationDetail?.address?.split(" ")[1],
        },
        {
          category: "소모임",
          // text:
          //   (groups?.[0] || "--") +
          //   (groups?.[1] ? `, ${groups[1]}` : "") +
          //   (groups?.[2] ? `, ${groups[2]}` : "") +
          //   (groups?.[3] ? `...` : ""),
          texts: groups,
        },
      ];

  return (
    <BlurredPart
      isBlur={isGuest || isPrivate}
      text={isPrivate ? "프로필 비공개 (친구에게만 공개)" : undefined}
    >
      <Flex flexDir="column" py={3}>
        {itemMapping.map((item, idx) => (
          <Flex key={idx} fontSize="13px" fontWeight="semibold" py={2}>
            <Box w="64px" color="gray.500">
              {item.category}
            </Box>
            {item?.text ? (
              <Box
                flex={1}
                color="gray.800"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {item.text}
              </Box>
            ) : item?.texts?.length ? (
              <InfoList items={item?.texts?.slice(0, 5)} isSmall />
            ) : (
              "없음"
            )}
          </Flex>
        ))}

        {/* <ProfileItem>
            <span>소모임</span>
            <Box
              flex={1}
              fontWeight={600}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2, // 최대 2줄
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {groups?.map((group, idx) => (
                <Fragment key={idx}>
                  <span>{group}</span>
                  <span>{idx !== groups.length - 1 && ", "}</span>
                </Fragment>
              ))}
            </Box>
          </ProfileItem> */}
      </Flex>
    </BlurredPart>
  );
}

export default DetailInfo;
