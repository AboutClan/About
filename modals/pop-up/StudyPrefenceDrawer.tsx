import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AlertSimpleModal, { IAlertSimpleModalOptions } from "../../components/AlertSimpleModal";
import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import PickerRowButton from "../../components/molecules/PickerRowButton";
import BottomFlexDrawer, {
  BottomFlexDrawerOptions,
} from "../../components/organisms/drawer/BottomFlexDrawer";
import { USER_LOCATION } from "../../constants/keys/localStorage";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getStudyViewDayjs } from "../../libs/study/date/getStudyDateStatus";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { IModal } from "../../types/components/modalTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";

interface StudyPrefencerDrawerProps extends IModal {}

function StudyPrefenceDrawer({ setIsModal }: StudyPrefencerDrawerProps) {
  const { data: session } = useSession();
  const userLocation =
    (localStorage.getItem(USER_LOCATION) as ActiveLocation) || session?.user.location;

  const [placeArr, setPlaceArr] = useState<StudyThumbnailCardProps[]>();
  const [pickPreferences, setPickPreferences] = useState<{
    mainPlace: string;
    subPlaceArr: string[];
  }>({ mainPlace: null, subPlaceArr: [] });

  const { data: userInfo } = useUserInfoQuery();

  const preference = userInfo?.studyPreference;
  const userLocationDetail = userInfo.locationDetail;

  const { data: studyVoteData } = useStudyVoteQuery(
    dayjsToStr(getStudyViewDayjs(dayjs())),
    userLocation,
    {
      enabled: !!userLocation,
    },
  );

  useEffect(() => {
    if (!studyVoteData || !preference) return;
    const participations = studyVoteData?.participations;
    setPlaceArr(
      setStudyToThumbnailInfo(
        participations,
        preference,
        { lat: userLocationDetail.lat, lon: userLocationDetail.lon },
        null,
        true,
        null,
        null,
        null,
        true,
      ),
    );
    setPickPreferences({ mainPlace: preference.place, subPlaceArr: preference.subPlace });
  }, [studyVoteData, preference]);

  const drawerOptions2: BottomFlexDrawerOptions = {
    header: {
      title: "즐겨찾기 장소 등록",
    },
    footer: {
      text: "즐겨찾기 등록 완료",
      func: () => {},
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

  const alertOptions: IAlertSimpleModalOptions = {
    title: "즐겨찾기된 장소와 현재 활동 장소가 다릅니다.",
    subTitle: "취소할래?",
  };

  return (
    <>
      <BottomFlexDrawer
        isOverlay
        isHideBottom
        isDrawerUp
        zIndex={2000}
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
              // onClick={() => onClickPlaceSelectButton()}
            >
              수정
            </Button>
          </Flex>
          <Flex justify="space-between" align="center" w="full" mb={2}>
            <Box color="gray.600" fontSize="12px" lineHeight="16px">
              원하시는 장소가 없으신가요?"
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
              // onClick={() => onClickPlaceSelectButton()}
            >
              장소 추가 요청
            </Button>
          </Flex>
        </Box>
        <Flex
          w="full"
          direction="column"
          h="500px"
          overflowY="scroll"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {placeArr?.map((place, idx) => (
            <Box key={idx} mb={2} h="120px">
              <PickerRowButton
                {...place}
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
        {/* <Box mb={2} w="full">
        <PickerRowButton
          {...convertData(findMyPickMainPlace)}
          onClick={() => setIsModal(false)}
          pickType="main"
        />
      </Box> */}
        {/* {subArr?.map((props, idx) => {
        const id = props.place._id;

        return (
          <Box key={idx} mb={2} w="full">
            <PickerRowButton
              {...convertData(props)}
              onClick={() =>
                subPlace.includes(id)
                  ? setSubPlace((old) => old.filter((placeId) => placeId !== id))
                  : setSubPlace((old) => [...old, id])
              }
              pickType="second"
              isNoSelect={!subPlace.includes(id)}
            />
          </Box>
        );
      })} */}
      </BottomFlexDrawer>

      {<AlertSimpleModal options={alertOptions} />}
    </>
  );
}

export default StudyPrefenceDrawer;
