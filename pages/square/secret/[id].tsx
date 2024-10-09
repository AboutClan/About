import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

import AlertModal from "../../../components/AlertModal";
import { Badge } from "../../../components/atoms/badges/Badges";
import Divider from "../../../components/atoms/Divider";
import KakaoShareBtn from "../../../components/atoms/Icons/KakaoShareBtn";
import { MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import OrganizerBar from "../../../components/molecules/OrganizerBar";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import { usePollState } from "../../../hooks/custom/usePollState";
import {
  useDeleteLikeSecretSquareMutation,
  useDeleteSecretSquareMutation,
  usePatchPollMutation,
  usePutLikeSecretSquareMutation,
} from "../../../hooks/secretSquare/mutations";
import {
  useCurrentPollStatusQuery,
  useGetSquareDetailQuery,
  useLikeStatus,
} from "../../../hooks/secretSquare/queries";
import PollItemButton from "../../../pageTemplates/square/SecretSquare/PollItemButton";
import SecretSquareComments from "../../../pageTemplates/square/SecretSquare/SecretSquareComments";

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
    { staleTime: Infinity, enabled: !!squareId },
  );
  const { mutate: mutatePoll, isLoading: isPollLoading } = usePatchPollMutation({ squareId });
  const { mutate: deleteSquareMutate } = useDeleteSecretSquareMutation({ squareId });
  const {
    data: squareDetail,
    isFetching: isSquareDetailFetching,
    refetch,
  } = useGetSquareDetailQuery({ squareId }, { staleTime: Infinity, enabled: !!squareId });
  const { data: pollStatus } = useCurrentPollStatusQuery(
    { squareId },
    {
      enabled: !!session?.user.id && squareDetail?.type === "poll",
      staleTime: Infinity,
    },
  );

  const {
    selectedPollItems,
    isModified,
    isActiveRePollButton,
    showRePollButton,
    handlePoll,
    isSelected,
    hideRePollButton,
    cancelPoll,
  } = usePollState({
    initialPollItems: pollStatus?.pollItems,
  });

  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const likeButtonDisabled =
    isPutLikeLoading || isDeleteLikeLoading || isLikeStatusFetching || isSquareDetailFetching;

  const failToast = useFailToast();

  const handlePatchPoll = () => {
    if (!isModified) return;

    mutatePoll({ user: session?.user.id, pollItems: selectedPollItems });
  };

  const handleLikeSquare = () => {
    if (!likeStatus) return;
    if (likeStatus.isLike) {
      deleteLikeMutate();
    } else {
      putLikeMutate();
    }
  };

  const openAlertModal = () => {
    setIsAlertOpen(true);
    onMenuClose();
  };

  const handleDeleteSquare = () => {
    deleteSquareMutate(
      { category: squareDetail?.category },
      {
        onSuccess: () => {
          router.replace("/square");
        },
        onError: () => {
          failToast("error");
        },
      },
    );
  };

  return (
    <>
      <Header title="">
        <KakaoShareBtn
          type="secretSquare"
          title={squareDetail?.title}
          subtitle={squareDetail?.content}
          img="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0.jpg"
          url={`/square/secret/${squareId}`}
        />
      </Header>
      <>
        <Slide>
          <Flex py={4} direction="column" gap={2} as="section" bg="white" minH="326px">
            <Box minH="83px">
              {squareDetail && (
                <>
                  <Box mb={2} px={4}>
                    <Badge text={`# ${squareDetail.category}`} colorScheme="grayTheme" size="md" />
                  </Box>
                  <Box id="avatar-section">
                    <OrganizerBar
                      avatar={
                        <OrganizerBar.Avatar
                          avatar={squareDetail.isAnonymous ? { bg: 7, type: 0 } : undefined}
                          uid={squareDetail.isAnonymous ? "" : squareDetail.uid}
                          image={squareDetail.isAnonymous ? "" : squareDetail.profileImage}
                          isLink={!squareDetail.isAnonymous}
                          size="md"
                        />
                      }
                      name={squareDetail.isAnonymous ? "익명" : squareDetail.name}
                      createdAt={squareDetail.createdAt}
                      right={
                        <>
                          {squareDetail.isMySquare && (
                            <>
                              <Box as="button" type="button" onClick={onMenuOpen}>
                                <i className="fa-regular fa-ellipsis fa-xl" />
                              </Box>
                              <Drawer placement="bottom" onClose={onMenuClose} isOpen={isMenuOpen}>
                                <DrawerOverlay />
                                <DrawerContent pt={3} pb={5}>
                                  <DrawerBody>
                                    <Box
                                      fontSize="16px"
                                      as="button"
                                      w="100%"
                                      color="var(--color-red)"
                                      textAlign="center"
                                      onClick={openAlertModal}
                                    >
                                      삭제
                                    </Box>
                                  </DrawerBody>
                                </DrawerContent>
                              </Drawer>
                              {isAlertOpen && (
                                <AlertModal
                                  setIsModal={setIsAlertOpen}
                                  options={{
                                    title: "게시글을 삭제할까요?",
                                    subTitle:
                                      "게시글을 삭제하면 모든 데이터가 삭제되고 다시는 볼 수 없어요.",
                                    func: handleDeleteSquare,
                                    text: "삭제하기",
                                  }}
                                />
                              )}
                            </>
                          )}
                        </>
                      }
                    />
                  </Box>
                </>
              )}
            </Box>

            <Box id="content-section" as="section" position="relative" minH="120px" px={4}>
              {squareDetail ? (
                <>
                  <Text py="8px" as="h1" fontSize="xl" fontWeight={700}>
                    {squareDetail.title}
                  </Text>
                  <Text mt={2} whiteSpace="break-spaces">
                    {squareDetail.content}
                  </Text>
                </>
              ) : (
                <MainLoadingAbsolute size="sm" />
              )}
            </Box>
            {squareDetail && (
              <>
                {squareDetail.type === "poll" && (
                  <Box as="section" id="poll-section" px={4} my={4}>
                    <Box
                      p={4}
                      sx={{
                        width: "100%",
                        borderRadius: "var(--rounded-lg)",
                        border: "var(--border-main)",
                        background: "white",
                      }}
                    >
                      <VStack as="ul" align="flex-start">
                        <Text fontWeight={600} display="flex" mb="4px" gap={1} align="center">
                          <Box as="span" display="flex" alignItems="center">
                            <i className="fa-solid fa-check-to-slot" />
                          </Box>
                          <span>투표</span>
                        </Text>
                        {squareDetail.poll.pollItems.map(({ _id, name, count }) => {
                          return (
                            <PollItemButton
                              key={_id}
                              isChecked={isSelected(_id)}
                              isDisabled={showRePollButton}
                              name={name}
                              count={count}
                              onClick={() =>
                                handlePoll({
                                  canMultiple: squareDetail.poll.canMultiple,
                                  pollItem: _id,
                                })
                              }
                            />
                          );
                        })}

                        {showRePollButton ? (
                          <Button
                            type="button"
                            rounded="lg"
                            w="100%"
                            colorScheme="gray"
                            mt="8px"
                            onClick={hideRePollButton}
                          >
                            <i
                              className="fa-regular fa-rotate-right"
                              style={{ marginRight: "4px" }}
                            />
                            다시 투표하기
                          </Button>
                        ) : (
                          <ButtonGroup w="100%" mt="8px">
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
                                onClick={cancelPoll}
                              >
                                취소
                              </Button>
                            )}
                          </ButtonGroup>
                        )}
                      </VStack>
                    </Box>
                  </Box>
                )}

                {squareDetail.images.length !== 0 && (
                  <section id="images-section">
                    <VStack as="ul" mt="8px" px={4}>
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
                            />
                          </Box>
                        );
                      })}
                    </VStack>
                  </section>
                )}

                <Flex color="var(--gray-600)" px={4} align="center" gap={1} fontSize="12px">
                  <i className="fa-regular fa-eye" />
                  <span>{squareDetail.viewCount}명이 봤어요</span>
                </Flex>
                <Flex justify="space-between" mt="8px" px={4}>
                  <Button
                    type="button"
                    px="3"
                    py="1"
                    maxW="fit-content"
                    backgroundColor="white"
                    border={likeStatus?.isLike ? "var(--border-mint-light)" : "var(--border-main)"}
                    rounded="full"
                    color={likeStatus?.isLike ? "var(--color-mint)" : "var(--gray-700)"}
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
                </Flex>
              </>
            )}
          </Flex>
          {squareDetail && <Divider />}
        </Slide>
        {squareDetail && (
          <Box as="section" bg="white">
            <SecretSquareComments
              author={squareDetail.author}
              comments={squareDetail?.comments}
              refetch={refetch}
            />
          </Box>
        )}
      </>
    </>
  );
}

export default SecretSquareDetailPage;
