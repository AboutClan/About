import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import Divider from "../../components/atoms/Divider";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import PollItem from "../../pageTemplates/square/SecretSquare/PollItem";
import { AVATAR_IMAGE_ARR } from "../../storage/avatarStorage";
import { SecretSquareItem } from "../../types/models/square";

function SecretSquareDetailPage() {
  // TODO API
  // POST poll
  // PATCH poll
  // POST comment
  // DELETE comment
  // GET square detail
  // TODO remove mock data
  const detail: SecretSquareItem = {
    category: "일상",
    title: "테스트",
    content:
      "테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.",
    id: "35",
    type: "poll",
    author: "이승주",
    createdAt: "2023-05-30",
    viewCount: 124,
    pollList: [
      { id: "0", value: "떡볶이", count: 3 },
      { id: "1", value: "떡볶이", count: 3 },
      { id: "2", value: "연어", count: 3 },
      { id: "3", value: "대창", count: 3 },
    ],
    canMultiple: true,
  };

  const [poll, setPoll] = useState<Map<string, string>>(new Map());

  return (
    <>
      <Header title="" />
      <Slide>
        <Flex px={4} py={4} direction="column" gap={2} as="section" bg="white">
          <Box bg="gray.200" rounded="full" w="fit-content" px={2} py={1}>
            # {detail.category}
          </Box>
          <Flex as="section" align="center" gap={4}>
            <Avatar isLink={false} image={AVATAR_IMAGE_ARR[0]} size="md" />
            <Flex direction="column">
              <Text fontWeight={500}>익명</Text>
              <Text color="GrayText">{detail.createdAt}</Text>
            </Flex>
          </Flex>
          <Box as="section">
            <Text as="h1" fontSize="xl" fontWeight={700}>
              {detail.title}
            </Text>
            <Text mt={2}>{detail.content}</Text>
          </Box>
          {detail.type === "poll" && (
            <Box
              p={4}
              my={4}
              sx={{
                width: "100%",
                borderRadius: "var(--rounded-lg)",
                border: "var(--border-main)",
                background: "white",
              }}
            >
              <VStack as="ul" align="flex-start">
                <Text fontWeight={600}>투표</Text>
                {detail.pollList.map(({ id, value }, index) => {
                  return (
                    <PollItem
                      key={index}
                      isChecked={poll.has(id)}
                      value={value}
                      onChange={() => {
                        if (detail.canMultiple) {
                          setPoll((prev) => {
                            const cloned = new Map(prev);
                            if (cloned.has(id)) cloned.delete(id);
                            else cloned.set(id, value);
                            return cloned;
                          });
                        } else {
                          setPoll((prev) => {
                            const cloned = new Map(prev);
                            if (cloned.has(id)) {
                              cloned.delete(id);
                            } else if (cloned.size !== 0) {
                              cloned.clear();
                              cloned.set(id, value);
                            } else {
                              cloned.set(id, value);
                            }
                            return cloned;
                          });
                        }
                      }}
                    />
                  );
                })}
                <Button type="button" rounded="lg" w="100%" colorScheme="mintTheme">
                  투표하기
                </Button>
              </VStack>
            </Box>
          )}

          <Text color="GrayText">{detail.viewCount}명이 봤어요</Text>
        </Flex>
        <Divider />
        {/* comments section */}
        <Box px={4} as="section" bg="white">
          comments section
        </Box>
      </Slide>
    </>
  );
}

export default SecretSquareDetailPage;
