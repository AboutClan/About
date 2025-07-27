import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSession } from "next-auth/react";

import Avatar from "../../components/atoms/Avatar";
import ThumbIcon from "../../components/Icons/ThumbIcon";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import type { SecretSquareCategory, SecretSquareType } from "../../types/models/square";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { getDateDiff } from "../../utils/dateTimeUtils";

interface SquareItemProps {
  item: {
    _id: string;
    category: SecretSquareCategory;
    title: string;
    content: string;
    type: SecretSquareType;
    viewCount: number;
    thumbnail: string;
    likeCount: number;
    commentsCount: number;
    createdAt: string;
    author: string | UserSimpleInfoProps;
  };
  isSecret: boolean;
}

export default function SquareItem({ item, isSecret = true }: SquareItemProps) {
  const { data: session } = useSession();
  const typeToast = useTypeToast();
  const isGuest = session?.user.name === "guest";

  const onClick = (e) => {
    if (isGuest) {
      e.preventDefault();
      typeToast("guest");
      return;
    }
  };

  return (
    <Link
      href={`/community/${item._id}?type=${isSecret ? "anonymous" : "blindness"}`}
      onClick={onClick}
    >
      <Flex flexDir="column" borderBottom="var(--border)" px={5} py={3}>
        <Badge mb={1} colorScheme="gray" size="smd" w="max-content">
          {`# ${item?.category}`}
        </Badge>
        <Text
          fontSize="16px"
          fontWeight="semibold"
          sx={
            item?.thumbnail
              ? {
                  width: "240px",
                  display: "-webkit-box",
                  WebkitLineClamp: "1",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {item.title}
        </Text>
        <Flex justifyContent="space-between" gap={4}>
          <Box
            mt={1}
            mb={2}
            sx={{
              color: "var(--gray-600)",
              fontSize: "13px",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.type === "poll" && (
              <i
                className="fa-solid fa-check-to-slot"
                style={{ color: "var(--gray-500)", marginRight: "8px" }}
              />
            )}
            {item.content}
          </Box>
          {item.thumbnail && (
            <Box position="relative" overflow="visible" mb="8px">
              <Box
                w="64px"
                aspectRatio="1/1"
                borderRadius="var(--rounded-lg)"
                position="relative"
                overflow="hidden"
                rounded="md"
                border="var(--border)"
                bgColor="white"
              >
                <Image
                  src={item.thumbnail}
                  alt="thumbnailImage"
                  sizes="80px"
                  objectFit="cover"
                  objectPosition="center"
                />
                <Box
                  py="2px"
                  color="white"
                  fontSize="10px"
                  pos="absolute"
                  bottom="0"
                  w="100%"
                  bgColor="black"
                  textAlign="center"
                >
                  대표사진
                </Box>
              </Box>
            </Box>
          )}
        </Flex>
        <Flex fontSize="12px" color="var(--gray-600)" justify="space-between">
          <Flex>
            {!isSecret && <Avatar size="xxs1" user={item?.author as UserSimpleInfoProps} />}
            <Flex
              ml={isSecret ? 0 : 1}
              sx={{
                "& :after": {
                  height: "100%",
                  content: "'•'",
                  margin: "0 4px",
                  verticalAlign: "middle",
                  fontSize: "8px",
                },

                "& :last-child:after": {
                  content: "''",
                },
              }}
            >
              <span>{getDateDiff(dayjs(item.createdAt))}</span>
              <span>조회 {item.viewCount + (item.title === "정보 게시판 출시 안내" ? 25 : 0)}</span>
            </Flex>
          </Flex>
          <Flex gap={2} color="gray.500" align="center">
            <Flex gap={1} align="center">
              <ThumbIcon colorType="400" />
              <span>{item.likeCount + (item.title === "정보 게시판 출시 안내" ? 4 : 0)}</span>
            </Flex>
            <Flex gap={1} align="center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14px"
                viewBox="0 -960 960 960"
                width="14px"
                fill="var(--gray-400)"
              >
                <path d="m240-240-92 92q-19 19-43.5 8.5T80-177v-623q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Zm40-160h240q17 0 28.5-11.5T560-440q0-17-11.5-28.5T520-480H280q-17 0-28.5 11.5T240-440q0 17 11.5 28.5T280-400Zm0-120h400q17 0 28.5-11.5T720-560q0-17-11.5-28.5T680-600H280q-17 0-28.5 11.5T240-560q0 17 11.5 28.5T280-520Zm0-120h400q17 0 28.5-11.5T720-680q0-17-11.5-28.5T680-720H280q-17 0-28.5 11.5T240-680q0 17 11.5 28.5T280-640Z" />
              </svg>
              <span>{item.commentsCount}</span>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}
