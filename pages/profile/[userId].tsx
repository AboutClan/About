import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
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
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import TabNav from "../../components/molecules/navs/TabNav";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useGatherCountQuery, useGatherMyStatusQuery } from "../../hooks/gather/queries";
import { useGroupsTitleQuery } from "../../hooks/groupStudy/queries";
import { useUserFriendMutation } from "../../hooks/user/mutations";
import { useUserIdToUserInfoQuery, useUserReviewQuery } from "../../hooks/user/queries";
import { useInteractionMutation } from "../../hooks/user/sub/interaction/mutations";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { setGatherDataToCardCol } from "../../pageTemplates/home/HomeGatherCol";
import DetailInfo from "../../pageTemplates/profile/DetailInfo";
import ProfileOverview from "../../pageTemplates/profile/ProfileOverview";
import UserReviewBar from "../../pageTemplates/user/UserReviewBar";
import { transferUserName } from "../../recoils/transferRecoils";
import { IUser, UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { IUserRequest } from "../../types/models/userTypes/userRequestTypes";
import { getDateDiff } from "../../utils/dateTimeUtils";

function ProfilePage() {
  const { data: session } = useSession();
  const typeToast = useTypeToast();
  const toast = useToast();
  const router = useRouter();
  const isGuest = session ? session.user.name === "guest" : undefined;

  const { userId } = useParams<{ userId: string }>() || {};

  const [modalType, setModalType] = useState<"add" | "remove" | "declare">(null);
  const setTransferUserName = useSetRecoilState(transferUserName);
  const [tab, setTab] = useState<"후 기" | "모 임">("후 기");
  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>();

  const { data: user } = useUserIdToUserInfoQuery(userId as string, {
    enabled: !!userId,
  });

  const { data: count } = useGatherCountQuery(userId, { enabled: !!userId });

  const { data } = useGroupsTitleQuery(userId, {
    enabled: !!userId,
  });

  const { data: gatherData } = useGatherMyStatusQuery(0, userId, { enabled: !!userId });

  useEffect(() => {
    if (!gatherData) return;
    setCardDataArr(setGatherDataToCardCol(gatherData, true));
  }, [gatherData]);

  const { data: reviewArr } = useUserReviewQuery(user?.uid, {
    enabled: !!user?.uid,
  });

  const [isMyFriend, setIsMyFriend] = useState(false);

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
            <ProfileOverview gatherCount={count} user={user as IUser} />
          </Slide>
          <Slide isNoPadding>
            <Divider type={200} />
          </Slide>
          <Slide>
            <DetailInfo user={user as IUser} groups={data} />
          </Slide>
          <Slide isNoPadding>
            <Divider type={200} />
            <TabNav
              tabOptionsArr={[
                { text: "후 기", func: () => setTab("후 기") },
                { text: "모 임", func: () => setTab("모 임") },
              ]}
              isFullSize
              isBlack
            />
            {tab === "후 기" ? (
              <>
                <UserReviewBar user={user} />
                <Box h="1px" my={3} mt={4} bg="gray.100" />
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
              </>
            ) : (
              <Box p={5}>
                {cardDataArr?.map((cardData, idx) => (
                  <Box mb="12px" key={idx}>
                    <GatherThumbnailCard {...cardData} />
                  </Box>
                ))}
              </Box>
            )}
            <Box h={10} />
          </Slide>
        </>
      )}
      {modalType === "declare" && <DeclareDrawer2 user={user} onClose={() => setModalType(null)} />}
      {modalType === "add" && (
        <AlertModal options={alertModalOptions} setIsModal={() => setModalType(null)} />
      )}
      {modalType === "remove" && (
        <AlertModal options={cancelAlertModalOptions} setIsModal={() => setModalType(null)} />
      )}
    </>
  );
}

export const DeclareDrawer2 = ({
  user,
  onClose,
}: {
  user: UserSimpleInfoProps;
  onClose: () => void;
}) => {
  const toast = useToast();
  const [declareType, setDeclareType] = useState<"distance" | "block">(null);
  const [text, setText] = useState("");
  const [isFirstPage, setIsFirstPage] = useState(true);
  const { mutate: sendDeclaration } = useUserRequestMutation({
    onSuccess() {
      toast("success", "제출 되었습니다.");
      onClose();
    },
  });

  return (
    <BottomFlexDrawer
      isOverlay
      isDrawerUp
      setIsModal={onClose}
      isHideBottom
      drawerOptions={{
        footer: isFirstPage
          ? { text: "취소", func: () => onClose() }
          : {
              text: "완료",
              func: () => {
                const data: IUserRequest = {
                  category: "신고",
                  title: `${user?.name}-${user?.uid}-${declareType}`,
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
            불편했던 상황이나 내용을 작성해 주세요. 정확한 사실이 확인되어야 조치가 가능하고, 최대한{" "}
            <b>익명성</b>을 보장합니다.
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
  );
};

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-500)"
    >
      <path d="M176-183q-20 8-38-3.5T120-220v-180l320-80-320-80v-180q0-22 18-33.5t38-3.5l616 260q25 11 25 37t-25 37L176-183Z" />
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
      fill="var(--gray-500)"
    >
      <path d="M720-520h-80q-17 0-28.5-11.5T600-560q0-17 11.5-28.5T640-600h80v-80q0-17 11.5-28.5T760-720q17 0 28.5 11.5T800-680v80h80q17 0 28.5 11.5T920-560q0 17-11.5 28.5T880-520h-80v80q0 17-11.5 28.5T760-400q-17 0-28.5-11.5T720-440v-80Zm-473-7q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM40-240v-32q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240Z" />
    </svg>
  );
}

export function BanIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-500)"
    >
      <path d="M480-160q43 0 84-11.5t78-33.5L487-360h-7q-54 0-106 14t-99 41.78q-17 9.93-18.5 29.77-1.5 19.85 12.5 33.74 44 37.71 98 59.21T480-160ZM791-57l-90-89q-49 32-105 49T480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-59 16.5-115T145-701l-90-91q-12-12-11.5-28.5T56-849q12-12 28.5-12t28.5 12l735 736q12 12 12 28t-12 28q-12 12-28.5 12T791-57Zm12-235q-10 0-19-3.5T767-307L604-470q-8-8-8.5-18.5T601-509q10-16 14.5-34t4.5-37q0-58-41-99t-99-41q-19 0-37 5t-34 14q-10 5-20.5 5t-18.5-8l-63-63q-8-8-11.5-17t-3.5-19q0-14 6.5-25.5T319-846q38-17 78.5-25.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 42-8.5 82.5T846-319q-6 14-17.5 20.5T803-292Z" />
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
      fill="var(--gray-500)"
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
      fill="var(--gray-500)"
    >
      <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm80-200q17 0 28.5-11.5T600-320q0-17-11.5-28.5T560-360H440v-80h80q33 0 56.5-23.5T600-520v-80q0-33-23.5-56.5T520-680H400q-17 0-28.5 11.5T360-640q0 17 11.5 28.5T400-600h120v80h-80q-33 0-56.5 23.5T360-440v120q0 17 11.5 28.5T400-280h160Z" />
    </svg>
  );
}

export default ProfilePage;
