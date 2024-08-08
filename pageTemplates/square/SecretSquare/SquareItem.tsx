import { Box, Flex, Image, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import styled from "styled-components";

import { SecretSquareItem } from "../../../types/models/square";
import { getDateDiff } from "../../../utils/dateTimeUtils";

interface SquareItemProps {
  item: Omit<SecretSquareItem, "comments" | "images"> & {
    thumbnail: string;
    commentsCount: number;
  };
}

export default function SquareItem({ item }: SquareItemProps) {
  return (
    <Layout>
      <IconCategory category={item.category} />

      <Text
        fontSize="16px"
        fontWeight={600}
        sx={{
          width: "240px",
          display: "-webkit-box",
          "-webkit-line-clamp": "1",
          "-webkit-box-orient": "vertical",
          overflow: "hidden",
        }}
      >
        {item.title}
      </Text>
      <Flex>
        <Box
          mt={1}
          mb={2}
          sx={{
            color: "var(--font-h7)",
            fontSize: "13px",

            display: "-webkit-box",
            "-webkit-line-clamp": "4",
            "-webkit-box-orient": "vertical",
            overflow: "hidden",
          }}
        >
          {item.content}
        </Box>
        {item.thumbnail && (
          <Box position="relative" overflow="visible" my="8px">
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
              content: "'•'",
              margin: "0 4px",
            },

            "& :last-child:after": {
              content: "''",
            },
          }}
        >
          <span>{getDateDiff(dayjs(item.createdAt))}</span>
          <span>조회 {item.viewCount}</span>
        </Flex>
        <Flex>
          <span>{item.likeCount}</span>
          <span>{item.commentsCount}</span>
        </Flex>
      </Flex>
    </Layout>
  );
}

function IconCategory({ category }: { category: string }) {
  return <IconLayout>#{category}</IconLayout>;
}

const Layout = styled.div`
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
