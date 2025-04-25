import { Box, Flex, Image, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { useTypeToast } from "../../../hooks/custom/CustomToast";
import type { SecretSquareCategory, SecretSquareType } from "../../../types/models/square";
import { getDateDiff } from "../../../utils/dateTimeUtils";

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
  };
}

export default function SquareItem({ item }: SquareItemProps) {
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
    <Link href={`/square/secret/${item._id}`} onClick={onClick}>
      <Flex flexDir="column" borderBottom="var(--border)" px={5} py={3}>
        <IconCategory category={item.category} />
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
              WebkitLineClamp: "4",
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
          <Flex
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
            <span>조회 {item.viewCount}</span>
          </Flex>
          <Flex gap={2} color="gray.500" align="center">
            <Flex gap={1} align="center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14px"
                viewBox="0 -960 960 960"
                width="14px"
                fill="var(--gray-400)"
              >
                <path d="M840-640q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14H400q-33 0-56.5-23.5T320-200v-407q0-16 6.5-30.5T344-663l217-216q15-14 35.5-17t39.5 7q19 10 27.5 28t3.5 37l-45 184h218ZM160-120q-33 0-56.5-23.5T80-200v-360q0-33 23.5-56.5T160-640q33 0 56.5 23.5T240-560v360q0 33-23.5 56.5T160-120Z" />
              </svg>
              <span>{item.likeCount}</span>
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

function IconCategory({ category }: { category: string }) {
  return (
    <Box
      bg="gray.100"
      color="gray.600"
      w="max-content"
      fontWeight="regular"
      fontSize="11px"
      mb={1}
      py={0.5}
      px={1}
    >
      #{category}
    </Box>
  );
}
