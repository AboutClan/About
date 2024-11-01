import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import AlertSimpleModal, { IAlertSimpleModalOptions } from "../../components/AlertSimpleModal";
import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import PickerRowButton from "../../components/molecules/PickerRowButton";
import BottomFlexDrawer, {
  BottomFlexDrawerOptions,
} from "../../components/organisms/drawer/BottomFlexDrawer";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyPreferenceMutation } from "../../hooks/study/mutations";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getStudyViewDayjs } from "../../libs/study/date/getStudyDateStatus";
import { IModal } from "../../types/components/modalTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";

interface StudyPreferenceDrawerProps extends IModal {
  handleClick: () => void;
}

function StudyPreferenceDrawer({ setIsModal, handleClick }: StudyPreferenceDrawerProps) {
  const { data: session } = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();

  const resetStudy = useResetStudyQuery();
  const [location, setLocation] = useState<ActiveLocation>(session?.user.location);

  const [placeArr, setPlaceArr] = useState<StudyThumbnailCardProps[]>();
  const [pickPreferences, setPickPreferences] = useState<{
    mainPlace: string;
    subPlaceArr: string[];
  }>({ mainPlace: null, subPlaceArr: [] });
  const [alertOptions, setAlertOptions] = useState<IAlertModalOptions>();
  const [alertSimpleOptions, setAlertSimpleOptions] = useState<IAlertSimpleModalOptions>();

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: handleStudyPreference, isLoading: isStudyPreferenceLoading } =
    useStudyPreferenceMutation("post", {
      onSuccess() {
        setAlertOptions(null);
        toast("success", pickPreferences?.mainPlace ? "등록되었습니다" : "초기화 완료");

        if (pickPreferences?.mainPlace) {
          resetStudy();
          queryClient.invalidateQueries([USER_INFO]);
          setIsModal(false);
        }
      },
    });

  useEffect(() => {
    if (!session) return;
    setLocation(session?.user.location);
  }, [session]);

  const preference = userInfo?.studyPreference;
  const userLocationDetail = userInfo.locationDetail;

  const { data: studyVoteData } = useStudyVoteQuery(
    dayjsToStr(getStudyViewDayjs(dayjs())),
    location,
    {
      enabled: !!location,
    },
  );

  useEffect(() => {
    // if (!studyVoteData || !userInfo) return;
    // const participations = studyVoteData?.participations;
    // const sortedData = setStudyToThumbnailInfo(
    //   participations,
    //   preference,
    //   { lat: userLocationDetail.lat, lon: userLocationDetail.lon },
    //   null,
    //   true,
    //   null,
    //   null,
    //   null,
    //   true,
    // );
    // setPlaceArr(sortedData);
    // if (pickPreferences?.subPlaceArr.length < 2) {
    //   setPickPreferences({
    //     mainPlace: sortedData[0].id,
    //     subPlaceArr: [sortedData[1].id, sortedData[2].id],
    //   });
    // }
    // if (
    //   preference?.place &&
    //   !studyVoteData.participations.some((par) => par.place._id === preference.place)
    // ) {
    //   const tempOptions: IAlertModalOptions = {
    //     title: "지역과 즐겨찾기 장소 불일치",
    //     subTitle:
    //       "즐겨찾기 장소가 소속 지역 내에 있지 않습니다. 지역 변경을 원하시면 운영진에게 문의해 주세요.",
    //     text: "즐겨찾기 초기화",
    //     defaultText: "이대로 쓸게요",
    //     func: () => {
    //       setPickPreferences({ mainPlace: null, subPlaceArr: [] });
    //       handleStudyPreference({ place: null, subPlace: [] });
    //     },
    //   };
    //   setAlertOptions(tempOptions);
    //   return;
    // }
    // const changeLocation = getLocationByCoordinates(userLocationDetail.lat, userLocationDetail.lon);
    // if (changeLocation !== session?.user.location || changeLocation !== userInfo?.location) {
    //   const tempOptions: IAlertModalOptions = {
    //     title: "지역과 주 활동 장소 불일치",
    //     subTitle:
    //       "주 활동 장소가 소속 지역 내에 있지 않습니다. 지역 변경을 원하시면 운영진에게 문의해 주세요.",
    //     func: () => {},
    //   };
    //   setAlertSimpleOptions(tempOptions);
    // }
  }, [studyVoteData, userInfo, session]);

  const drawerOptions2: BottomFlexDrawerOptions = {
    header: {
      title: "즐겨찾기 장소 등록",
    },
    footer: {
      text: "즐겨찾기 등록 완료",
      func: () => {
        if (!pickPreferences?.mainPlace) {
          toast("warning", "장소를 선택해 주세요");
          return;
        }
        handleStudyPreference({
          place: pickPreferences.mainPlace,
          subPlace: pickPreferences.subPlaceArr,
        });
      },
      loading: pickPreferences?.mainPlace && isStudyPreferenceLoading,
    },
  };

  const onClickBox = (id: string) => {
    if (!pickPreferences?.mainPlace) {
      setPickPreferences({ mainPlace: id, subPlaceArr: [] });
    }
    if (pickPreferences?.mainPlace === id) {
      setPickPreferences({ mainPlace: null, subPlaceArr: [] });
    } else if (pickPreferences?.subPlaceArr.includes(id)) {
      setPickPreferences((old) => ({
        ...old,
        subPlaceArr: old.subPlaceArr.filter((sub) => sub !== id),
      }));
    } else {
      setPickPreferences((old) => ({ ...old, subPlaceArr: [...old.subPlaceArr, id] }));
    }
  };

  return (
    <>
      <BottomFlexDrawer
        isOverlay
        isHideBottom
        isDrawerUp
        zIndex={1400}
        height={600}
        setIsModal={setIsModal}
        drawerOptions={drawerOptions2}
      >
        <Box w="full" borderBottom="var(--border)" mb={3}>
          <Flex justify="space-between" align="center" w="full" mb={3}>
            <Box color="gray.600" fontSize="12px" lineHeight="16px">
              주 활동 장소:{" "}
              <Box as="span" fontWeight="semibold" color="gray.700">
                {userLocationDetail.text}
              </Box>
            </Box>
            <Button
              mt="auto"
              as="div"
              fontSize="12px"
              fontWeight={500}
              size="xs"
              variant="ghost"
              height="20px"
              color="var(--color-blue)"
              onClick={handleClick}
            >
              수정
            </Button>
          </Flex>
          <Flex justify="space-between" align="center" w="full" mb={2}>
            <Box color="gray.600" fontSize="12px" lineHeight="16px">
              원하시는 장소가 없으신가요?
            </Box>
            <Link href="/study/writing/place">
              <Button
                mt="auto"
                as="div"
                fontSize="12px"
                fontWeight={500}
                size="xs"
                variant="ghost"
                height="20px"
                color="var(--color-blue)"
              >
                장소 추가 요청
              </Button>
            </Link>
          </Flex>
        </Box>
        <Flex
          w="full"
          direction="column"
          h="382px"
          overflowY="scroll"
          overscrollBehaviorY="contain"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {placeArr?.map((place, idx) => (
            <Box key={idx} mb={2}>
              <PickerRowButton
                {...place}
                hasLocationDetail
                isOnlyPlaceInfo
                onClick={() => onClickBox(place.id)}
                pickType={
                  place.id === pickPreferences?.mainPlace
                    ? "main"
                    : pickPreferences?.subPlaceArr.includes(place.id)
                      ? "second"
                      : null
                }
              />
            </Box>
          ))}
        </Flex>
      </BottomFlexDrawer>

      {alertOptions && (
        <AlertModal
          options={alertOptions}
          isLoading={isStudyPreferenceLoading}
          setIsModal={() => setAlertOptions(null)}
        />
      )}
      {alertSimpleOptions && (
        <AlertSimpleModal
          options={alertSimpleOptions}
          setIsModal={() => setAlertSimpleOptions(null)}
        />
      )}
    </>
  );
}

export default StudyPreferenceDrawer;
