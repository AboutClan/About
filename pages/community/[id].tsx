import { Badge, Box, Button, ButtonGroup, Flex, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import AlertModal from "../../components/AlertModal";
import MenuButton, { MenuProps } from "../../components/atoms/buttons/MenuButton";
import Divider from "../../components/atoms/Divider";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import ThumbIcon from "../../components/Icons/ThumbIcon";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import PostAuthorCard from "../../components/molecules/cards/PostAuthorCard";
import { SECRET_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import {
  useDeleteLikeSecretSquareMutation,
  useDeleteSecretSquareMutation,
  usePatchPollMutation,
  usePutLikeSecretSquareMutation,
} from "../../hooks/secretSquare/mutations";
import {
  useCurrentPollStatusQuery,
  useGetSquareDetailQuery,
  useLikeStatus,
} from "../../hooks/secretSquare/queries";
import PollItemButton from "../../pageTemplates/community/PollItemButton";
import SecretSquareComments from "../../pageTemplates/community/SecretSquareComments";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";

function SecretSquareDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const squareId = router.query.id as string;
  const { data: session } = useSession();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const typeParams = searchParams.get("type");
  const isSecret = typeParams === "anonymous";

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
  const initialSelectedPollItems = new Set(pollStatus?.pollItems);

  const [selectedPollItems, setSelectedPollItems] = useState<Set<string>>(new Set());
  // calculate the difference btw poll and initialPoll
  const isModified =
    selectedPollItems.size !== initialSelectedPollItems.size ||
    Array.from(selectedPollItems.keys()).some((id) => !initialSelectedPollItems.has(id)) ||
    Array.from(initialSelectedPollItems.keys()).some((id) => !selectedPollItems.has(id));

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

  const handleDeleteSquare = () => {
    deleteSquareMutate();
  };

  const menuArr: MenuProps[] = [
    ...((isSecret ? squareDetail?.author : (squareDetail?.author as IUserSummary)?._id) ===
    session?.user.id
      ? [
          {
            icon: <DeleteIcon />,
            text: "삭제하기",
            func: () => {
              setIsDeleteModal(true);
            },
          },
        ]
      : []),

    {
      kakaoOptions: {
        title: squareDetail?.title,
        subtitle: squareDetail?.content,
        img: "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0.jpg",

        url: "https://study-about.club" + router.asPath,
      },
    },
  ];
  console.log(44, squareDetail);
  return (
    <>
      <Header title="">
        <MenuButton menuArr={menuArr} />
      </Header>
      <>
        <Slide>
          <Flex py={4} direction="column" gap={1} as="section" bg="white" minH="326px">
            <Box minH="83px">
              {squareDetail && (
                <>
                  <Badge colorScheme="gray" size="smd" w="max-content">
                    {`# ${squareDetail?.category}`}
                  </Badge>

                  <section id="avatar-section">
                    <PostAuthorCard
                      organizer={
                        isSecret ? SECRET_USER_SUMMARY : (squareDetail.author as IUserSummary)
                      }
                      createdAt={squareDetail.createdAt}
                    ></PostAuthorCard>
                  </section>
                </>
              )}
            </Box>

            <section id="content-section" style={{ position: "relative", minHeight: "120px" }}>
              {squareDetail ? (
                <>
                  <Box fontSize="18px" fontWeight="bold">
                    {squareDetail.title}
                  </Box>
                  <Box as="p" fontSize="14px" color="gray.800" mt={2} whiteSpace="break-spaces">
                    {squareDetail.content}
                  </Box>
                </>
              ) : (
                <MainLoadingAbsolute size="sm" />
              )}
            </section>
            {squareDetail && (
              <>
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
                      <Text fontWeight={600} display="flex" mb="4px" gap={1} align="center">
                        <Box as="span" display="flex" alignItems="center">
                          <i className="fa-solid fa-check-to-slot" />
                        </Box>
                        <span>투표</span>
                      </Text>
                      {squareDetail.poll.pollItems.map(({ _id, name, users }) => {
                        return (
                          <PollItemButton
                            key={_id}
                            isChecked={selectedPollItems.has(_id)}
                            isDisabled={showRePollButton}
                            name={name}
                            count={users?.length || 0}
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
                          mt="8px"
                          onClick={() => setShowRePollButton(false)}
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
                            colorScheme="mint"
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
                    <VStack mt="8px">
                      {squareDetail.images.map((src, index) => {
                        return (
                          <Box
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

                <Flex color="var(--gray-600)" align="center" mt={4} gap={1} fontSize="12px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="var(--gray-500)"
                  >
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-134 0-244.5-72T61-462q-5-9-7.5-18.5T51-500q0-10 2.5-19.5T61-538q64-118 174.5-190T480-800q134 0 244.5 72T899-538q5 9 7.5 18.5T909-500q0 10-2.5 19.5T899-462q-64 118-174.5 190T480-200Z" />
                  </svg>
                  <span>
                    {squareDetail.viewers.length +
                      (squareDetail.title === "정보 게시판 출시 안내" ? 25 : 0)}
                    명이 봤어요
                  </span>
                </Flex>
                <Flex justify="space-between" mt={3}>
                  <Button
                    type="button"
                    backgroundColor="white"
                    border={likeStatus?.isLike ? "var(--border-mint-light)" : "var(--border-main)"}
                    rounded="full"
                    color={likeStatus?.isLike ? "var(--color-mint)" : "var(--gray-800)"}
                    gap={2}
                    h="36px"
                    px={4}
                    fontWeight={400}
                    size="md"
                    sx={{
                      // hover state is NOT removed on mobile device.
                      // It could be confused for user so we remove the style of hover state.
                      // see https://github.com/chakra-ui/chakra-ui/issues/6173
                      _hover: {},
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={handleLikeSquare}
                    fontSize="13px"
                    isDisabled={likeButtonDisabled}
                  >
                    {/* <i className="fa-regular fa-thumbs-up" />
                  <span>공감하기</span> */}
                    <Box>
                      <ThumbIcon colorType={likeStatus?.isLike ? "mint" : "600"} />
                    </Box>
                    <Box>
                      {squareDetail.like.length +
                        (squareDetail.title === "정보 게시판 출시 안내" ? 4 : 0)}
                    </Box>
                  </Button>
                </Flex>
              </>
            )}
          </Flex>
        </Slide>
        <Slide isNoPadding>{squareDetail && <Divider />}</Slide>

        {squareDetail && (
          <Box as="section" bg="white">
            <SecretSquareComments
              author={squareDetail?.author}
              comments={squareDetail?.comments}
              refetch={refetch}
              isSecret={isSecret}
            />
          </Box>
        )}
      </>
      {isDeleteModal && (
        <AlertModal
          setIsModal={setIsDeleteModal}
          options={{
            title: "게시글을 삭제할까요?",
            subTitle: "게시글을 삭제하면 모든 데이터가 삭제되고 다시는 볼 수 없어요.",
            func: handleDeleteSquare,
            text: "삭제하기",
          }}
        />
      )}
    </>
  );
}

function DeleteIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 -960 960 960"
    width="16px"
    fill="var(--color-gray)"
  >
    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
  </svg>
}

export default SecretSquareDetailPage;
