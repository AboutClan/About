import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import PageIntro from "../../../components/atoms/PageIntro";
import Select from "../../../components/atoms/Select";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { IImageTileData } from "../../../components/molecules/layouts/ImageTileFlexLayout";
import ImageTileGridLayout from "../../../components/molecules/layouts/ImageTitleGridLayout";
import StudyVoteDrawer from "../../../components/services/studyVote/StudyVoteDrawer";
import { LOCATION_OPEN } from "../../../constants/location";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useStudyParticipationMutation } from "../../../hooks/study/mutations";
import { useStudyVoteQuery } from "../../../hooks/study/queries";
import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";
import { Location, LocationEn } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";

function Participate() {
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();
  const searchParams = useSearchParams();
  const resetStudy = useResetStudyQuery();
  const newSearchParams = new URLSearchParams(searchParams);

  const locationParam = searchParams.get("location") as LocationEn;
  const dateParam = searchParams.get("date");

  const [location, setLocation] = useState<Location>();
  const [placeId, setPlaceId] = useState<string>();
  const [imageDataArr, setImageDataArr] = useState<IImageTileData[]>();
  const [isVoteDrawer, setIsVoteDrawer] = useState(false);

  const { data: studyVoteData } = useStudyVoteQuery(dateParam, location, false, false, {
    enabled: !!dateParam && !!location,
  });

  const participations = studyVoteData?.[0]?.participations;

  const { mutate, isLoading } = useStudyParticipationMutation(dayjs(), "post", {
    onSuccess() {
      typeToast("vote");
      resetStudy();

      router.push(`/vote?${newSearchParams.toString()}&category=votePlace`);
    },
  });

  useEffect(() => {
    setLocation(convertLocationLangTo(locationParam, "kr"));
  }, [locationParam]);

  useEffect(() => {
    if (!studyVoteData) return;

    setImageDataArr(
      participations.map((par) => {
        const place = par.place;
        return {
          imageUrl: place.image,
          text: place.fullname,
          func: () => {
            setPlaceId(place._id);
          },
          id: place._id,
        };
      }),
    );
  }, [studyVoteData]);

  const handleBottomNav = () => {
    if (!placeId) {
      toast("warning", "장소를 입력해 주세요");
      return;
    }
    setIsVoteDrawer(true);
  };

  const handleSubmit = (voteTime: IStudyVoteTime) => {
    mutate({
      place: placeId,
      ...voteTime,
    });
  };

  return (
    <>
      <Header title="" isBorder={false}>
        <Button
          as="div"
          fontSize="13px"
          fontWeight={500}
          size="xs"
          variant="ghost"
          height="20px"
          color="var(--color-blue)"
        >
          <Link href={`/vote/participate/place?${searchParams.toString()}`}>직접 입력</Link>
        </Button>
      </Header>
      <Slide>
        <PageIntro
          main={{ first: "스터디를 진행할", second: "장소를 선택해 주세요" }}
          sub="예정인 장소가 없다면 직접 입력하실 수 있습니다."
        />

        <Flex direction="column" bgColor="white">
          <Flex justify="space-between" align="center" mb={5}>
            <Box fontSize="16px" fontWeight={700}>
              기존 스터디 장소
            </Box>
            <Select
              options={LOCATION_OPEN}
              defaultValue={location}
              setValue={setLocation}
              type="location"
              size="sm"
            />
          </Flex>
          <Box pb={20}>
            {imageDataArr && (
              <ImageTileGridLayout
                imageDataArr={imageDataArr}
                grid={{ row: null, col: 4 }}
                selectedId={[placeId]}
                hasToggleHeart
              />
            )}
          </Box>
        </Flex>
      </Slide>
      <BottomNav text="스터디 신청" onClick={handleBottomNav} />
      {isVoteDrawer && (
        <StudyVoteDrawer
          hasPlace
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          setIsModal={setIsVoteDrawer}
        />
      )}
    </>
  );
}

export default Participate;
