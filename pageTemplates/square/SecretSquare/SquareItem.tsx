import { Box, Flex, Image, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styled from "styled-components";

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
    <Layout href={`/square/secret/${item._id}`} onClick={onClick}>
      <IconCategory category={item.category} />
      <Text
        fontSize="16px"
        fontWeight={600}
        sx={{
          width: "240px",
          display: "-webkit-box",
          WebkitLineClamp: "1",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {item.title}
      </Text>
      <Flex justifyContent="space-between" gap={4}>
        <Box
          mt={1}
          mb={2}
          sx={{
            color: "var(--font-h7)",
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
        <Flex gap={3}>
          <Flex gap={1} align="center">
            <i className="fa-regular fa-thumbs-up" />
            <span>{item.likeCount}</span>
          </Flex>
          <Flex gap={1} align="center">
            <i className="fa-regular fa-comment" />
            <span>{item.commentsCount}</span>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
}

function IconCategory({ category }: { category: string }) {
  return <IconLayout>#{category}</IconLayout>;
}

const Layout = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-bottom: var(--border-main);
  padding: 12px 16px;
`;

const IconLayout = styled.span`
  background-color: var(--font-h6);
  color: var(--gray-600);
  font-size: 12px;
  width: max-content;
  text-align: center;
  margin-bottom: 2px;
`;
