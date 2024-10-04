import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LocationSelector from "../../../components/atoms/LocationSelector";
import PageIntro from "../../../components/atoms/PageIntro";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { IImageTileData } from "../../../components/molecules/layouts/ImageTileFlexLayout";
import ImageTileGridLayout from "../../../components/molecules/layouts/ImageTitleGridLayout";
import { LOCATION_OPEN } from "../../../constants/location";
import { useStudyVoteQuery } from "../../../hooks/study/queries";
import { Location, LocationEn } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";

function Participate() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location") as LocationEn;
  const dateParam = searchParams.get("date");

  const [location, setLocation] = useState<Location>();

  const [placeId, setPlaceId] = useState<string>();

  useEffect(() => {
    setLocation(convertLocationLangTo(locationParam, "kr"));
  }, [locationParam]);

  const { data: studyVoteData } = useStudyVoteQuery(dateParam, location, false, false, {
    enabled: !!dateParam && !!location,
  });

  const imageDataArr: IImageTileData[] = studyVoteData?.[0]?.participations?.map((par) => {
    const place = par.place;
    return {
      imageUrl: place.image,
      text: place.fullname,
      func: () => {
        setPlaceId(place._id);
      },
      id: place._id,
    };
  });

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
          <Link href={`/vote/participate/place`}>직접 입력</Link>
        </Button>
      </Header>
      <Slide>
        <PageIntro
          main={{ first: "스터디를 진행할", second: "장소를 선택해 주세요" }}
          sub="예정인 장소가 없다면 직접 입력하실 수 있습니다."
        />

        <Flex direction="column" px={5} bgColor="white">
          <Flex justify="space-between" align="center" mb={5}>
            <Box fontSize="16px" fontWeight={700}>
              기존 스터디 장소
            </Box>{" "}
            <LocationSelector
              options={LOCATION_OPEN}
              defaultValue={location}
              setValue={setLocation}
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
      <BottomNav text="스터디 신청" />
    </>
  );
}

export default Participate;
