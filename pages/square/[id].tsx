import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import Divider from "../../components/atoms/Divider";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { usePrevious } from "../../hooks/custom/usePrevious";
import { useGetSquareDetailQuery } from "../../hooks/secretSquare/queries";
import PollItem from "../../pageTemplates/square/SecretSquare/PollItem";
import SecretSquareComments from "../../pageTemplates/square/SecretSquare/SecretSquareComments";
import { AVATAR_IMAGE_ARR } from "../../storage/avatarStorage";
import { getDateDiff } from "../../utils/dateTimeUtils";

function SecretSquareDetailPage() {
  const router = useRouter();
  const squareId = router.query.id as string;
  // TODO remove mock data
  // TODO API
  const { data: session } = useSession();
  // PATCH poll
  // GET poll current status (staleTime infinity)
  // DELETE comment
  const { data: squareDetail } = useGetSquareDetailQuery({ squareId }, { staleTime: Infinity });

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
        {squareDetail && (
          <>
            <Flex px={4} py={4} direction="column" gap={2} as="section" bg="white">
              <Box bg="gray.200" rounded="full" w="fit-content" px={2} py={1}>
                # {squareDetail.category}
              </Box>
              <Flex as="section" align="center" gap={4}>
                <Avatar isLink={false} image={AVATAR_IMAGE_ARR[0]} size="md" />
                <Flex direction="column">
                  <Text fontWeight={500}>익명</Text>
                  <Text color="GrayText">{getDateDiff(dayjs(squareDetail.createdAt))}</Text>
                </Flex>
              </Flex>
              <Box as="section">
                <Text as="h1" fontSize="xl" fontWeight={700}>
                  {squareDetail.title}
                </Text>
                <Text mt={2}>{squareDetail.content}</Text>
              </Box>
              {squareDetail.type === "poll" && (
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
                    <Text fontWeight={600} display="flex" gap={1} align="center">
                      <Box display="flex" alignItems="center">
                        <i className="fa-regular fa-check-to-slot" />
                      </Box>
                      <span>투표</span>
                    </Text>
                    {squareDetail.poll.pollItems.map(({ _id, name }, index) => {
                      return (
                        <PollItem
                          key={index}
                          isChecked={poll.has(_id)}
                          value={name}
                          onChange={() => {
                            const isChecked = poll.has(_id);
                            if (squareDetail.poll.canMultiple) {
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
                  <VStack as="ul"></VStack>
                </Box>
              )}

              <Flex color="GrayText" align="center" gap={1}>
                <i className="fa-light fa-eye" />
                <span>{squareDetail.viewCount}명이 봤어요</span>
              </Flex>

              <Flex justify="space-between">
                <Button
                  type="button"
                  px="2"
                  py="1"
                  maxW="fit-content"
                  backgroundColor="white"
                  border="var(--border-main)"
                  rounded="full"
                  color="GrayText"
                  gap={1}
                  fontWeight={400}
                  size="sm"
                  sx={{
                    // hover state is NOT removed on mobile device. It's confused for user
                    // see https://github.com/chakra-ui/chakra-ui/issues/6173
                    _hover: {},
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    // TODO put or delete like
                    console.log("put or delete like");
                  }}
                >
                  <i className="fa-light fa-thumbs-up" />
                  <span>공감하기</span>
                </Button>
                <Flex gap={1} align="center">
                  <i className="fa-light fa-comment" />
                  <span>{squareDetail.comments.length}</span>
                </Flex>
              </Flex>
            </Flex>
            <Divider />
            {/* comments section */}
            <Box px={4} as="section" bg="white">
              <SecretSquareComments />
            </Box>
          </>
        )}
      </Slide>
    </>
  );
}

export default SecretSquareDetailPage;
