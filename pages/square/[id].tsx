import { Box, Button, ButtonGroup, Flex, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import Divider from "../../components/atoms/Divider";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import {
  useDeleteLikeSecretSquareMutation,
  usePatchPollMutation,
  usePutLikeSecretSquareMutation,
} from "../../hooks/secretSquare/mutations";
import {
  useCurrentPollStatusQuery,
  useGetSquareDetailQuery,
  useLikeStatus,
} from "../../hooks/secretSquare/queries";
import PollItemButton from "../../pageTemplates/square/SecretSquare/PollItemButton";
import SecretSquareComments from "../../pageTemplates/square/SecretSquare/SecretSquareComments";
import { AVATAR_IMAGE_ARR } from "../../storage/avatarStorage";
import { getDateDiff } from "../../utils/dateTimeUtils";

function SecretSquareDetailPage() {
  const router = useRouter();
  const squareId = router.query.id as string;

  const { data: session } = useSession();
  const { mutate: putLikeMutate, isLoading: isPutLikeLoading } = usePutLikeSecretSquareMutation({
    squareId,
  });
  const { mutate: deleteLikeMutate, isLoading: isDeleteLikeLoading } =
    useDeleteLikeSecretSquareMutation({ squareId });
  const { data: likeStatus, isFetching: isLikeStatusFetching } = useLikeStatus(
    { squareId },
    { staleTime: Infinity },
  );
  const { mutate: mutatePoll, isLoading: isPollLoading } = usePatchPollMutation({ squareId });
  const { data: squareDetail, isFetching: isSquareDetailFetching } = useGetSquareDetailQuery(
    { squareId },
    { staleTime: Infinity },
  );
  const { data: pollStatus } = useCurrentPollStatusQuery(
    { squareId },
    {
      enabled: !!session?.user.id,
      staleTime: Infinity,
    },
  );
  const initialSelectedPollItems = new Set(pollStatus?.pollItems);

  const [selectedPollItems, setSelectedPollItems] = useState<Set<string>>(new Set());
  // calculate the difference btw poll and initialPoll
  const isModified =
    selectedPollItems.size !== initialSelectedPollItems.size ||
    selectedPollItems.keys().some((id) => !initialSelectedPollItems.has(id)) ||
    initialSelectedPollItems.keys().some((id) => !selectedPollItems.has(id));

  const [showRePollButton, setShowRePollButton] = useState(false);
  const [isActiveRePollButton, setIsActiveRePollButton] = useState(false);

  const likeButtonDisabled =
    isPutLikeLoading || isDeleteLikeLoading || isLikeStatusFetching || isSquareDetailFetching;

  useEffect(() => {
    if (pollStatus) {
      setSelectedPollItems(new Set(pollStatus.pollItems));
      if (pollStatus.pollItems.length !== 0) {
        setShowRePollButton(true);
        setIsActiveRePollButton(true);
      } else {
        setIsActiveRePollButton(false);
      }
    }
  }, [pollStatus]);

  const handlePatchPoll = () => {
    if (!isModified) return;

    mutatePoll({ user: session?.user.id, pollItems: Array.from(selectedPollItems.keys()) });
  };

  const handleLikeSquare = () => {
    if (!likeStatus) return;
    if (likeStatus.isLike) {
      deleteLikeMutate();
    } else {
      putLikeMutate();
    }
  };

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
              <section id="avatar-section">
                <Flex align="center" gap={4}>
                  <Avatar isLink={false} image={AVATAR_IMAGE_ARR[0]} size="md" />
                  <Flex direction="column">
                    <Text fontWeight={500}>익명</Text>
                    <Text color="GrayText">{getDateDiff(dayjs(squareDetail.createdAt))}</Text>
                  </Flex>
                </Flex>
              </section>
              <section id="content-section">
                <Text as="h1" fontSize="xl" fontWeight={700}>
                  {squareDetail.title}
                </Text>
                <Text mt={2} whiteSpace="break-spaces">
                  {squareDetail.content}
                </Text>
              </section>

              {squareDetail.type === "poll" && (
                <Box
                  as="section"
                  id="poll-section"
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
                      <Box as="span" display="flex" alignItems="center">
                        <i className="fa-regular fa-check-to-slot" />
                      </Box>
                      <span>투표</span>
                    </Text>
                    {squareDetail.poll.pollItems.map(({ _id, name, count }, index) => {
                      return (
                        <PollItemButton
                          key={index}
                          isChecked={selectedPollItems.has(_id)}
                          isDisabled={showRePollButton}
                          name={name}
                          count={count}
                          onClick={() => {
                            const isChecked = selectedPollItems.has(_id);
                            if (squareDetail.poll.canMultiple) {
                              setSelectedPollItems((prev) => {
                                const cloned = new Set(prev);
                                if (isChecked) cloned.delete(_id);
                                else cloned.add(_id);
                                return cloned;
                              });
                            } else {
                              setSelectedPollItems((prev) => {
                                const cloned = new Set(prev);
                                if (isChecked) {
                                  cloned.delete(_id);
                                } else if (cloned.size !== 0) {
                                  // if already checking other poll item
                                  cloned.clear();
                                  cloned.add(_id);
                                } else {
                                  cloned.add(_id);
                                }
                                return cloned;
                              });
                            }
                          }}
                        />
                      );
                    })}

                    {showRePollButton ? (
                      <Button
                        type="button"
                        rounded="lg"
                        w="100%"
                        colorScheme="gray"
                        onClick={() => setShowRePollButton(false)}
                      >
                        <i className="fa-regular fa-rotate-right" style={{ marginRight: "4px" }} />
                        다시 투표하기
                      </Button>
                    ) : (
                      <ButtonGroup w="100%">
                        <Button
                          type="button"
                          rounded="lg"
                          w="100%"
                          colorScheme="mintTheme"
                          isDisabled={!isModified}
                          isLoading={isPollLoading}
                          onClick={handlePatchPoll}
                        >
                          투표하기
                        </Button>
                        {isActiveRePollButton && (
                          <Button
                            type="button"
                            rounded="lg"
                            w="100%"
                            colorScheme="gray"
                            onClick={() => {
                              setShowRePollButton(true);
                              setSelectedPollItems(new Set(pollStatus.pollItems));
                            }}
                          >
                            취소
                          </Button>
                        )}
                      </ButtonGroup>
                    )}
                  </VStack>
                </Box>
              )}

              {squareDetail.images.length !== 0 && (
                <section id="images-section">
                  <VStack as="ul">
                    {squareDetail.images.map((src, index) => {
                      return (
                        <Box
                          as="li"
                          w="100%"
                          borderRadius="var(--rounded-lg)"
                          listStyleType="none"
                          overflow="hidden"
                          key={index}
                        >
                          <Image
                            src={src}
                            alt={`image ${index}`}
                            style={{
                              width: "100%",
                              height: "auto",
                            }}
                            width={400}
                            height={400}
                            // TODO remove unoptimized prop
                            unoptimized
                          />
                        </Box>
                      );
                    })}
                  </VStack>
                </section>
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
                  border={likeStatus?.isLike ? "var(--border-mint-light)" : "var(--border-main)"}
                  rounded="full"
                  color={likeStatus?.isLike ? "var(--color-mint)" : "GrayText"}
                  gap={1}
                  fontWeight={400}
                  size="sm"
                  sx={{
                    // hover state is NOT removed on mobile device.
                    // It could be confused for user so we remove the style of hover state.
                    // see https://github.com/chakra-ui/chakra-ui/issues/6173
                    _hover: {},
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={handleLikeSquare}
                  isDisabled={likeButtonDisabled}
                >
                  <i className="fa-light fa-thumbs-up" />
                  <span>{squareDetail.likeCount}</span>
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
