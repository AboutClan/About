import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import Divider from "../../components/atoms/Divider";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import PollItem from "../../pageTemplates/square/SecretSquare/PollItem";
import SecretSquareComments from "../../pageTemplates/square/SecretSquare/SecretSquareComments";
import { AVATAR_IMAGE_ARR } from "../../storage/avatarStorage";
import { SecretSquareItem } from "../../types/models/square";
import { getDateDiff } from "../../utils/dateTimeUtils";

function SecretSquareDetailPage() {
  // TODO remove mock data
  // TODO API
  // PATCH poll
  // GET poll current status (staleTime infinity)
  // DELETE comment
  // GET square detail (staleTime infinity)

  // poll logic (initial)
  // users check poll items (inactive 투표하기)
  //    if diff from before, active
  //    else, inactive
  // click poll button
  // users can see poll items checked
  // active poll button(다시 투표하기)

  // poll logic (modification)
  // click poll button(다시 투표하기) for checking poll items again (inactive 투표하기)
  // that can activate poll items for selecting
  // check poll items again
  //    if different from before, active 투표하기
  //    else, inactive 투표하기
  //  if empty poll item => go to initial state
  //  else ...
  // click poll button
  // users can see poll items modified

  // click button
  // -> mutate patch poll
  // -> invalidate current poll status

  const handlePatchPoll = () => {};

  const [poll, setPoll] = useState<Map<string, string>>(new Map());
  const prevPoll = usePrevious(poll);
  // calculate the difference btw poll and prevPoll
  const isDirtyPoll =
    poll.size !== prevPoll.size ||
    poll.keys().some((id) => !prevPoll.has(id)) ||
    prevPoll.keys().some((id) => !poll.has(id));

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
              <Text color="GrayText">{getDateDiff(dayjs(detail.createdAt))}</Text>
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
                {detail.poll.pollItems.map(({ _id, name }, index) => {
                  return (
                    <PollItem
                      key={index}
                      isChecked={poll.has(_id)}
                      value={name}
                      onChange={() => {
                        const isChecked = poll.has(_id);
                        if (detail.poll.canMultiple) {
                          setPoll((prev) => {
                            const cloned = new Map(prev);
                            if (isChecked) cloned.delete(_id);
                            else cloned.set(_id, name);
                            return cloned;
                          });
                        } else {
                          setPoll((prev) => {
                            const cloned = new Map(prev);
                            if (isChecked) {
                              cloned.delete(_id);
                            } else if (cloned.size !== 0) {
                              // if already checking other poll item
                              cloned.clear();
                              cloned.set(_id, name);
                            } else {
                              cloned.set(_id, name);
                            }
                            return cloned;
                          });
                        }
                      }}
                    />
                  );
                })}
                <Button
                  type="button"
                  rounded="lg"
                  w="100%"
                  colorScheme="mintTheme"
                  isActive={isDirtyPoll}
                  onClick={handlePatchPoll}
                >
                  투표하기
                </Button>
              </VStack>
            </Box>
          )}

          <Flex color="GrayText" align="center" gap={1}>
            <i className="fa-light fa-eye" />
            <span>{detail.viewCount}명이 봤어요</span>
          </Flex>

          <Flex justify="space-between">
            <Flex
              as="button"
              px="2"
              py="1"
              maxW="fit-content"
              backgroundColor="white"
              border="var(--border-main)"
              rounded="full"
              color="GrayText"
              type="button"
              gap={1}
              align="center"
              onClick={() => {
                // TODO put or delete like
                console.log("put or delete like");
              }}
            >
              <i className="fa-light fa-thumbs-up" />
              <span>공감하기</span>
            </Flex>
            <Flex gap={1} align="center">
              <i className="fa-light fa-comment" />
              <span>{detail.comments.length}</span>
            </Flex>
          </Flex>
        </Flex>
        <Divider />
        {/* comments section */}
        <Box px={4} as="section" bg="white">
          <SecretSquareComments />
        </Box>
      </Slide>
    </>
  );
}
function usePrevious<T>(value: T): T {
  const ref = useRef<T>(value);

  // execute whenever initial render and re-render
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

const detail: SecretSquareItem = {
  _id: "66a89681d03a0dcf5b8cb216",
  category: "일상",
  title: "test title",
  content: "테스트 본문입니다. 테스트 본문입니다. 테스트 본문입니다. ",
  type: "poll",
  poll: {
    canMultiple: true,
    pollItems: [
      {
        _id: "66a89681d03a0dcf5b8cb217",
        name: "test1",
        count: 1,
      },
      {
        _id: "66a89681d03a0dcf5b8cb218",
        name: "test2",
        count: 1,
      },
      {
        _id: "66a89681d03a0dcf5b8cb219",
        name: "test3",
        count: 0,
      },
    ],
  },
  images: [
    "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  viewCount: 13,
  createdAt: "2024-07-30T07:30:09.027Z",
  updatedAt: "2024-07-30T23:45:57.650Z",
  likeCount: 0,
  comments: [
    {
      _id: "66a89c87774db8d2e59f7e5e",
      comment: "댓글 예시입니다.",
      createdAt: "2024-07-30T07:55:51.848Z",
      updatedAt: "2024-07-30T07:55:51.848Z",
    },
    {
      _id: "66a89c8d774db8d2e59f7e63",
      comment: "댓글 예시입니다.1",
      createdAt: "2024-07-30T07:55:57.663Z",
      updatedAt: "2024-07-30T07:55:57.663Z",
    },
    {
      _id: "66a8ae32e86eb8c7b4afd3a2",
      comment: "1",
      createdAt: "2024-07-30T09:11:14.100Z",
      updatedAt: "2024-07-30T09:11:14.100Z",
    },
  ],
};

export default SecretSquareDetailPage;
