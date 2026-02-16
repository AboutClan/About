import { Box, Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import BlurredPart from "../../components/molecules/BlurredPart";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../utils/convertUtils/convertTypes";
import { decodeByAES256 } from "../../utils/utils";

function DetailInfo({
  user,
  groups,
}: {
  user: IUser;
  groups: { title: string; isMember: boolean }[];
}) {
  const router = useRouter();
  const isPublic = router.query.isPublic === "true";

  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest" && !isPublic;

  const isPrivate =
    !isPublic &&
    user?.isPrivate &&
    !user?.friend.includes(session?.user.uid) &&
    user?.uid !== session?.user.uid;

  const age = birthToAge(user?.birth);

  const isAdmin = session?.user.uid === "2259633694" || session?.user.uid === "3224546232";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemMapping: { category: string; text?: string; texts?: string[] | any[] }[] = !user
    ? []
    : [
        {
          category: "성별",
          text: user?.gender,
        },
        {
          category: "나이",
          text: !isPrivate
            ? "만" + " " + age + "세"
            : age <= 21
            ? "20대 초반"
            : age <= 23
            ? "20대 초중반"
            : age <= 25
            ? "20대 중반"
            : "20대 중후반",
        },
        {
          category: "MBTI",
          text: isPrivate ? "비공개" : user?.mbti,
        },
        {
          category: "전공",
          text: isPrivate ? "비공개" : user?.majors?.[0]?.detail,
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
        ...(isAdmin
          ? [
              {
                category: "연락처",
                text:
                  user?.telephone?.length > 0 && user?.telephone?.length < 14
                    ? user?.telephone
                    : decodeByAES256(user?.telephone),
              },
            ]
          : []),
      ];

  return (
    <BlurredPart isBlur={isGuest} text={isPrivate ? "프로필 비공개 (친구에게만 공개)" : undefined}>
      <Flex flexDir="column" py={2}>
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
              <UnorderedList
                mx={0}
                my={0}
                px={3}
                pl={1.5}
                py={2}
                bg="gray.100"
                border="1px solid var(--gray-200)"
                borderColor="gray.100"
                borderRadius="8px"
                fontSize="12px"
                lineHeight="24px"
                fontWeight="light"
                whiteSpace="nowrap"
                color="gray.800"
                w="full"
              >
                {item.texts.slice(0, 5).map((item, idx) => (
                  <ListItem key={idx} textAlign="start">
                    {item.isMember ? <b style={{ marginRight: "4px" }}>[정규]</b> : <></>}
                    {item?.title}
                  </ListItem>
                ))}
              </UnorderedList>
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
