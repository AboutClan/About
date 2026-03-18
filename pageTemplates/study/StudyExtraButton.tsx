import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

import InfoList from "../../components/atoms/lists/InfoList";
import Slide from "../../components/layouts/PageSlide";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import ReviewForm from "../../components/organisms/StarRatingForm";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { usePointToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { usePlaceReviewMutation, useStudyPlaceChangeMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { ModalLayout } from "../../modals/Modals";
import { CoordinatesProps } from "../../types/common";
import { PlaceReviewProps } from "../../types/models/studyTypes/entityTypes";
import {
  MyStudyStatus,
  StudyConfirmedMemberProps,
  StudyPlaceProps,
} from "../../types/models/studyTypes/study-entity.types";
import { getTodayStr } from "../../utils/dateTimeUtils";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import StudyPageMap from "../studyPage/studyPageMap/StudyPageMap";
import { CheckIcon } from "../vote/StudyControlButton";
import { StudyApplyIcon, StudyOpenIcon } from "./modals/StudyControlDrawer";
interface StudyExtraButtonProps {
  placeId: string;
  date: string;
  myStudyInfo: StudyConfirmedMemberProps;
  defaultLocation: CoordinatesProps;
  myStudyStatus: MyStudyStatus;
  studyType: "results" | "openRealTimes";
}

function StudyExtraButton({
  placeId,
  myStudyInfo,
  defaultLocation,
  myStudyStatus,
  date,
  studyType,
}: StudyExtraButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const userInfo = useUserInfo();
  const [isReviewModal, setIsReviewModal] = useState(false);

  const isAttend = myStudyInfo?.attendance?.type === "arrived";
  const [isModal, setIsModal] = useState(false);
  const [isChangeModal, setIsChangeModal] = useState(false);
  const [isCafeMap, setIsCafeMap] = useState(false);
  const [isReviewDrawer, setIsReviewDrawer] = useState(false);
  const [isGuideModal, setIsGuideModal] = useState(false);

  const handleCondition = () => {
    if (userInfo?.role === "previliged") return true;

    if (myStudyStatus !== "participation") {
      toast("info", "스터디 참여자만 이용 가능합니다.");
      return false;
    }
    if (studyType !== "results") {
      toast("info", "매칭 스터디만 장소 변경이 가능합니다.");
      return false;
    }
    if (studyType !== "results") {
      toast("info", "매칭 스터디만 장소 변경이 가능합니다.");
      return false;
    }
    if (dayjs(date).hour(9).minute(0).isAfter(dayjs())) {
      toast("info", "스터디 매칭 확정 후에 변경이 가능합니다.");
      return;
    }
    return true;
  };

  const buttonProps: {
    text: string;
    icon: JSX.Element;
    func: () => void;
    isDisabled?: boolean;
  }[] = [
    {
      text: "출석 이후 가이드",
      icon: <StudyApplyIcon />,
      func: () => {
        setIsModal(false);
        setIsGuideModal(true);
      },
    },
    {
      text: "스터디 장소 변경",
      icon: <PlaceChangeIcon />,
      func: () => {
        if (!handleCondition()) {
          return;
        }

        setIsChangeModal(true);
        setIsModal(false);
      },
    },
    {
      text: "카공 장소 리뷰 (+100 Point)",
      icon: <StudyOpenIcon />,
      func: () => {
        if (!handleCondition()) {
          return;
        }
        toast("info", "3월 20일 오픈");
        return;
        setIsReviewDrawer(true);
      },
    },
  ];

  const resetStudy = useResetStudyQuery();

  const { mutate } = useStudyPlaceChangeMutation(placeId, {
    onSuccess(_, param) {
      setIsCafeMap(false);
      resetStudy();
      toast("success", "변경 완료");
      setTimeout(() => {
        router.push(`/study/${param?.placeId}/${getTodayStr()}?type=results`);
      }, 800);
    },
  });

  return (
    <>
      <Slide isFixed zIndex={200}>
        <Flex
          position="fixed"
          zIndex={100}
          fontSize="12px"
          lineHeight="24px"
          fontWeight={700}
          bottom={isAttend ? getSafeAreaBottom(76) : getSafeAreaBottom(76)}
          right="20px"
        >
          <Button
            fontSize="12px"
            h="40px"
            color="white"
            px={4}
            borderRadius="20px"
            lineHeight="24px"
            iconSpacing={1}
            colorScheme="black"
            rightIcon={<CheckIcon />}
            onClick={() => setIsModal(true)}
            _hover={{
              background: undefined,
            }}
          >
            추가 기능
          </Button>
        </Flex>
      </Slide>

      {isReviewModal && (
        <ModalLayout title="출석 이후 가이드" setIsModal={setIsReviewModal} footerOptions={{}}>
          <Box mb={3}>스터디 출석 후 난감해 하고 있는 당신을 위해 ...!</Box>
          <InfoList
            items={[
              "다른 사람의 출석 정보를 먼저 확인해요.",
              "먼저 온 멤버를 찾아 가볍게 인사해 주세요!",
              "못 찾겠다면, 스터디 톡방에 물어보면 됩니다.",
              "같이 공부해도 되고, 혼자 공부해도 돼요!",
              "식사 의향이 있다면, 같이 먹을지 물어봐요.",
              "스터디를 마칠 때도 가볍게 인사해 주세요!",
              "장소를 변경한다면, 톡방에도 알려주세요.",
            ]}
          />
        </ModalLayout>
      )}

      {isModal && (
        <BottomFlexDrawer
          isOverlay
          isDrawerUp
          setIsModal={() => setIsModal(false)}
          isHideBottom
          drawerOptions={{ footer: { text: "닫 기", func: () => setIsModal(false) } }}
          height={251}
          zIndex={800}
        >
          {buttonProps.map((props, idx) => (
            <Button
              key={idx}
              h="52px"
              justifyContent="flex-start"
              display="flex"
              variant="unstyled"
              py={4}
              w="100%"
              lineHeight="20px"
              onClick={props.func}
              isDisabled={props?.isDisabled}
            >
              <Box w="20px" h="20px" mr={4} opacity={0.28}>
                {props.icon}
              </Box>
              <Box fontSize="13px" color="var(--gray-600)" fontWeight="500">
                {props.text}
              </Box>
            </Button>
          ))}
        </BottomFlexDrawer>
      )}
      {isChangeModal && (
        <ModalLayout
          title="스터디 장소 변경"
          setIsModal={setIsChangeModal}
          footerOptions={{
            main: {
              text: "변 경",
              func: () => {
                setIsCafeMap(true);
                setIsChangeModal(false);
              },
            },
            sub: { text: "취 소" },
          }}
        >
          <Box as="p">
            스터디 참여원들의 <b>동의를 모두 구한 뒤</b>에 변경이 가능합니다. 일방적으로 스터디
            장소를 변경하여 피해가 발생하면 패널티가 부여될 수 있습니다.
          </Box>
        </ModalLayout>
      )}
      {isCafeMap && (
        <StudyPageMap
          handleVotePick={(place: StudyPlaceProps) => {
            mutate({ placeId: place._id });
          }}
          isDefaultOpen
          onClose={() => setIsCafeMap(false)}
          isCafeMap={false}
          defaultLocation={defaultLocation}
        />
      )}
      {isReviewDrawer && (
        <RightReviewDrawer placeId={placeId} onClose={() => setIsReviewDrawer(false)} />
      )}
      {isGuideModal && (
        <ModalLayout
          title="출석 이후 가이드"
          setIsModal={() => {
            setIsGuideModal(false);
          }}
          footerOptions={{}}
        >
          <Box mb={3}>스터디 출석 후 난감해 하고 있는 당신을 위해 ...!</Box>
          <InfoList
            items={[
              "다른 사람의 출석 정보를 먼저 확인해요.",
              "먼저 온 멤버를 찾아 가볍게 인사해 주세요!",
              "못 찾겠다면, 스터디 톡방에 물어보면 됩니다.",
              "같이 공부해도 되고, 혼자 공부해도 돼요!",
              "식사 의향이 있다면, 같이 먹을지 물어봐요.",
              "스터디를 마칠 때도 가볍게 인사해 주세요!",
              "장소를 변경한다면, 톡방에도 알려주세요.",
            ]}
          />
        </ModalLayout>
      )}
    </>
  );
}

export default StudyExtraButton;

function PlaceChangeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#424242"
    >
      <path d="M240-160q-33 0-56.5-23.5T160-240v-295l-40 31q-14 10-30 8t-26-16q-10-14-7.5-30T72-568l359-275q11-8 23.5-12t25.5-4q13 0 25.5 4t23.5 12l360 275q13 10 15 26.5t-8 29.5q-10 13-26 15t-29-8l-41-30v26q-19-6-39-8.5t-41-2.5q-117 0-198.5 81.5T440-240q0 9 .5 18t1.5 17q2 18-8.5 31.5T406-160H240ZM550-40q-13 0-21.5-8.5T520-70q0-13 8.5-21.5T550-100h27q-26-27-41.5-63T520-240q0-61 33-110.5t87-72.5q11-5 20.5 0t14.5 16q5 11 1 22.5T657-365q-35 17-56 50.5T580-240q0 29 10.5 54t29.5 44v-28q0-13 8.5-21.5T650-200q13 0 21.5 8.5T680-170v90q0 17-11.5 28.5T640-40h-90Zm251-17q-11 5-21 0t-15-16q-5-11-1-22.5t19-19.5q35-18 56-51t21-74q0-29-10.5-54T820-338v28q0 13-8.5 21.5T790-280q-13 0-21.5-8.5T760-310v-90q0-17 11.5-28.5T800-440h90q13 0 21.5 8.5T920-410q0 13-8.5 21.5T890-380h-27q26 27 41.5 63t15.5 77q0 61-33 110.5T801-57Z" />
    </svg>
  );
}

function RightReviewDrawer({ placeId, onClose }: { placeId: string; onClose: () => void }) {
  const resetStudy = useResetStudyQuery();
  const pointToast = usePointToast();
  const { data: userInfo } = useUserInfoQuery();

  const { mutate: updatePoint } = usePointSystemMutation("point");
  const { mutate } = usePlaceReviewMutation({
    onSuccess() {
      resetStudy();
      onClose();
    },
  });

  const handleSubmit = (data: PlaceReviewProps) => {
    mutate({ ...data, placeId });
    updatePoint({ value: data.isSecret ? 30 : 100, message: "카페 후기 작성", sub: "study" });
    pointToast(data.isSecret ? 30 : 100);
  };

  return (
    <RightDrawer title="카페 후기" onClose={onClose}>
      <Box mt={5}>
        <ReviewForm user={userInfo} onSubmit={handleSubmit} />
      </Box>
    </RightDrawer>
  );
}
