import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import Avatar from "../../components/atoms/Avatar";
import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import Divider from "../../components/atoms/Divider";
import SectionHeader from "../../components/atoms/SectionHeader";
import Textarea from "../../components/atoms/Textarea";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useGroupsTitleQuery } from "../../hooks/groupStudy/queries";
import { useUserFriendMutation } from "../../hooks/user/mutations";
import { useUserIdToUserInfoQuery, useUserReviewQuery } from "../../hooks/user/queries";
import { useInteractionMutation } from "../../hooks/user/sub/interaction/mutations";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import DetailInfo from "../../pageTemplates/profile/DetailInfo";
import ProfileOverview from "../../pageTemplates/profile/ProfileOverview";
import { transferUserName } from "../../recoils/transferRecoils";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { IUserRequest } from "../../types/models/userTypes/userRequestTypes";
import { getDateDiff } from "../../utils/dateTimeUtils";
import { decodeByAES256 } from "../../utils/utils";

function ProfilePage() {
  const { data: session } = useSession();
  const typeToast = useTypeToast();
  const toast = useToast();
  const router = useRouter();
  const isGuest = session ? session.user.name === "guest" : undefined;

  const { userId } = useParams<{ userId: string }>() || {};

  const [modalType, setModalType] = useState<"add" | "remove" | "declare">(null);
  const setTransferUserName = useSetRecoilState(transferUserName);

  const { data: user } = useUserIdToUserInfoQuery(userId as string, {
    enabled: !!userId,
  });

  const { data } = useGroupsTitleQuery(userId, {
    enabled: !!userId,
  });

  const { data: reviewArr } = useUserReviewQuery(user?.uid, {
    enabled: !!user?.uid,
  });
  console.log(51, reviewArr);
  const [isMyFriend, setIsMyFriend] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [declareType, setDeclareType] = useState<"distance" | "block">(null);
  const [text, setText] = useState("");

  console.log(decodeByAES256("U2FsdGVkX1805x7IvBX1u+aW/gmnqo4pSrMqua3v8a0="));

  useEffect(() => {
    setIsFirstPage(true);
  }, [modalType]);

  const { mutate: requestFriend } = useInteractionMutation("friend", "post", {
    onSuccess() {
      toast("success", "친구 요청이 전송되었습니다.");
      setModalType(null);
    },
  });

  const { mutate: deleteFriend } = useUserFriendMutation("delete", {
    onSuccess() {
      toast("success", "친구 목록에서 삭제되었습니다.");
      setIsMyFriend(false);
      setModalType(null);
    },
  });

  const groups = data?.map((props) => props.title);

  useEffect(() => {
    if (user) setTransferUserName(user.name);

    if (user?.friend?.some((who) => who === session?.user?.uid)) {
      setIsMyFriend(true);
    }
  }, [user, session]);

  const handleDrawer = (type: "chat" | "declare") => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    if (type === "chat") router.push(`/chat/${user._id}`);
    if (type === "declare") router.replace(`/profile/${userId}?declare=on`);
  };

  const { mutate: sendDeclaration } = useUserRequestMutation({
    onSuccess() {
      toast("success", "제출 되었습니다.");
      setModalType(null);
    },
  });

  const alertModalOptions: IAlertModalOptions = {
    title: "친구 요청",
    subTitle: "친구 요청을 보내시겠습니까?",
    func: () => {
      requestFriend({
        toUid: user?.uid,
        message: `${session?.user?.name}님의 친구추가 요청`,
      });
    },
    text: "전송",
  };

  const cancelAlertModalOptions: IAlertModalOptions = {
    title: "친구 삭제",
    subTitle: "친구 목록에서 삭제하시겠습니까?",
    func: () => deleteFriend(user.uid),
    text: "전송",
  };

  return (
    <>
      <Header title="">
        <HStack spacing={3}>
          {session?.user.id !== userId && (
            <>
              <ButtonWrapper onClick={() => handleDrawer("chat")}>
                <SendIcon />
              </ButtonWrapper>
              <ButtonWrapper
                onClick={() => {
                  if (isGuest) {
                    typeToast("guest");
                    return;
                  }
                  setModalType(isMyFriend ? "remove" : "add");
                }}
              >
                {isMyFriend ? <UserCheckIcon /> : <UserPlusIcon />}
              </ButtonWrapper>
              <ButtonWrapper onClick={() => setModalType("declare")}>
                <BanIcon />
              </ButtonWrapper>
            </>
          )}
        </HStack>
      </Header>
      {user && (
        <>
          <Slide>
            <ProfileOverview user={user as IUser} groupCnt={groups?.length} />
          </Slide>
          <Slide isNoPadding>
            <Divider type={200} />
          </Slide>
          <Slide>
            <DetailInfo user={user as IUser} groups={groups} />
          </Slide>
          <Slide isNoPadding>
            <Divider type={200} />
            <Box mx={5} my={3} mt={5}>
              <SectionHeader
                title={`받은 매너 평가 ${reviewArr?.totalCnt || 0}`}
                size="sm"
                subTitle=""
              >
                <ButtonWrapper size="sm" onClick={() => typeToast("not-yet")}>
                  <ShortArrowIcon dir="right" />
                </ButtonWrapper>
              </SectionHeader>
            </Box>
            <Flex align="center" mx={5} fontSize="13px">
              <Flex align="center" flex={1}>
                <Avatar user={{ avatar: { type: 20, bg: 1 } }} size="xs1" />
                <Box ml={2} mr={1}>
                  최고예요 😘
                </Box>
                <Box fontWeight="bold">{reviewArr?.greatCnt || 0}</Box>
              </Flex>
              <Flex align="center" flex={1}>
                <Avatar user={{ avatar: { type: 11, bg: 6 } }} size="xs1" />
                <Box ml={2} mr={1}>
                  좋아요 😉
                </Box>
                <Box fontWeight="bold">
                  {Math.floor(reviewArr?.goodCnt / 10) * 10 || 0} ~{" "}
                  {reviewArr?.goodCnt !== 0 ? Math.floor(reviewArr?.goodCnt / 10) * 10 + 10 : ""}
                </Box>
              </Flex>
            </Flex>
            <Box h="1px" my={3} bg="gray.100" />
            <Box mt={5} mx={5} mb={0}>
              <SectionHeader
                title={`받은 모임 후기 ${reviewArr?.reviewArr?.length || ""}`}
                size="sm"
                subTitle=""
              >
                <ButtonWrapper size="sm" onClick={() => typeToast("not-yet")}>
                  <ShortArrowIcon dir="right" />
                </ButtonWrapper>
              </SectionHeader>
            </Box>
            <Flex flexDir="column" minH="80px">
              {reviewArr?.reviewArr?.map((item, idx) => (
                <Flex key={idx} px={5} align="center" py={3} borderBottom="var(--border)">
                  <Flex justify="center" alignSelf="flex-start" mr={2}>
                    <Avatar user={{ avatar: { type: 15, bg: 0 } }} size="sm1" isLink={false} />
                  </Flex>
                  <Flex
                    w="full"
                    direction="column"
                    fontSize="12px"
                    lineHeight={1.6}
                    justify="space-around"
                  >
                    <Flex w="full" justify="space-between" mb={1}>
                      <Box fontWeight="bold" fontSize="13px" lineHeight="20px" color="gray.800">
                        익명 {idx + 1}
                      </Box>
                    </Flex>
                    <Box mb={2} as="p" fontWeight="light" fontSize="12px" lineHeight="18px">
                      {item.message}
                    </Box>{" "}
                    <Flex h="16px" align="center" fontSize="10px" color="gray.600">
                      <Box color="gray.600" fontWeight="500">
                        {getDateDiff(dayjs(item.createdAt))}
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Slide>
        </>
      )}
      {modalType === "declare" && (
        <BottomFlexDrawer
          isOverlay
          isDrawerUp
          setIsModal={() => setModalType(null)}
          isHideBottom
          drawerOptions={{
            footer: isFirstPage
              ? { text: "취소", func: () => setModalType(null) }
              : {
                  text: "완료",
                  func: () => {
                    const data: IUserRequest = {
                      category: "신고",
                      title: `${user?.name}-${user?.uid}`,
                      content: text,
                    };
                    sendDeclaration(data);
                  },
                },
          }}
          height={258}
          zIndex={800}
        >
          <Box fontSize="14px" mt={3} mb={2}>
            {isFirstPage ? (
              <>
                <b>[거리두기]</b>가 여러명에게 누적된 인원은 동아리 활동이 제한될 수 있고,{" "}
                <b>[신고하기]</b>는 사유에 따라 즉시 활동이 제한됩니다.
              </>
            ) : declareType === "distance" ? (
              <>
                사유가 있다면 작성해 주세요! <b>[거리두기]</b> 사유는 선택사항이지만, 어떤 이유인지
                작성한다면 운영진 판단에 도움이 됩니다!
              </>
            ) : (
              <>
                불편했던 상황이나 내용을 작성해 주세요. 정확한 사실이 확인되어야 조치가 가능하고,
                최대한 <b>익명성</b>을 보장합니다.
              </>
            )}
          </Box>
          {isFirstPage ? (
            <>
              <Button
                h="52px"
                justifyContent="flex-start"
                display="flex"
                variant="unstyled"
                py={4}
                w="100%"
                onClick={() => {
                  setDeclareType("distance");
                  setIsFirstPage(false);
                }}
                lineHeight="20px"
              >
                <Box w="20px" h="20px" mr={4}>
                  <OneIcon />
                </Box>
                <Box fontSize="13px" color="var(--color-red)">
                  거리두기 (비매너, 불편한 언행, 사적 연락 등)
                </Box>
              </Button>

              <Button
                h="52px"
                justifyContent="flex-start"
                display="flex"
                variant="unstyled"
                py={4}
                w="100%"
                onClick={() => {
                  setDeclareType("block");
                  setIsFirstPage(false);
                }}
                lineHeight="20px"
              >
                <Box w="20px" h="20px" mr={4}>
                  <TwoIcon />
                </Box>
                <Box fontSize="13px" color="var(--color-red)">
                  신고하기 (정치, 종교, 이성, 지나친 언행 등)
                </Box>
              </Button>
            </>
          ) : (
            <Textarea
              mt={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                declareType === "distance"
                  ? "ex) 타인을 비하하는 발언을 자주 하고, 기본적인 예의나 배려가 부족하다고 느껴졌습니다."
                  : "ex) 사적 만남이나 연락을 무리하게 시도해 불쾌했습니다."
              }
              minH="64px"
            />
          )}
        </BottomFlexDrawer>
      )}
      {modalType === "add" && (
        <AlertModal options={alertModalOptions} setIsModal={() => setModalType(null)} />
      )}
      {modalType === "remove" && (
        <AlertModal options={cancelAlertModalOptions} setIsModal={() => setModalType(null)} />
      )}
    </>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-800)"
    >
      <path d="M792-443 176-183q-20 8-38-3.5T120-220v-520q0-22 18-33.5t38-3.5l616 260q25 11 25 37t-25 37ZM200-280l474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-500)"
    >
      <path d="m702-593 141-142q12-12 28.5-12t28.5 12q12 12 12 28.5T900-678L730-508q-12 12-28 12t-28-12l-85-85q-12-12-12-28.5t12-28.5q12-12 28-12t28 12l57 57ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-240v-32q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240Zm80 0h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 260Zm0-340Z" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-800)"
    >
      <path d="M720-520h-80q-17 0-28.5-11.5T600-560q0-17 11.5-28.5T640-600h80v-80q0-17 11.5-28.5T760-720q17 0 28.5 11.5T800-680v80h80q17 0 28.5 11.5T920-560q0 17-11.5 28.5T880-520h-80v80q0 17-11.5 28.5T760-400q-17 0-28.5-11.5T720-440v-80Zm-360 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-240v-32q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240Zm80 0h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
    </svg>
  );
}

function BanIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-800)"
    >
      <path d="M608-522 422-708q14-6 28.5-9t29.5-3q59 0 99.5 40.5T620-580q0 15-3 29.5t-9 28.5ZM234-276q51-39 114-61.5T480-360q18 0 34.5 1.5T549-354l-88-88q-47-6-80.5-39.5T341-562L227-676q-32 41-49.5 90.5T160-480q0 59 19.5 111t54.5 93Zm498-8q32-41 50-90.5T800-480q0-133-93.5-226.5T480-800q-56 0-105.5 18T284-732l448 448ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-60Z" />
    </svg>
  );
}

export function OneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--color-gray)"
    >
      <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-20-520v280q0 17 11.5 28.5T500-280q17 0 28.5-11.5T540-320v-320q0-17-11.5-28.5T500-680h-80q-17 0-28.5 11.5T380-640q0 17 11.5 28.5T420-600h40Z" />
    </svg>
  );
}

export function TwoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--color-gray)"
    >
      <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm80-200q17 0 28.5-11.5T600-320q0-17-11.5-28.5T560-360H440v-80h80q33 0 56.5-23.5T600-520v-80q0-33-23.5-56.5T520-680H400q-17 0-28.5 11.5T360-640q0 17 11.5 28.5T400-600h120v80h-80q-33 0-56.5 23.5T360-440v120q0 17 11.5 28.5T400-280h160Z" />
    </svg>
  );
}

export default ProfilePage;
