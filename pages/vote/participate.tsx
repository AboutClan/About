import { Box, Button, Flex } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LocationSelector from "../../components/atoms/LocationSelector";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { IImageTileData } from "../../components/molecules/layouts/ImageTileFlexLayout";
import ImageTileGridLayout from "../../components/molecules/layouts/ImageTitleGridLayout";
import { LOCATION_OPEN } from "../../constants/location";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { Location, LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";

function Participate() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location") as LocationEn;
  const dateParam = searchParams.get("date");

  const [location, setLocation] = useState<Location>();

  const [placeId, setPlaceId] = useState<string>();

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });

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
      text: place.branch,
      func: () => {
        setPlaceId(place._id);
      },
      id: place._id,
    };
  });
  console.log(studyVoteData);
  return (
    <>
      <Header title="" isBorder={false}>
        <Button
          fontSize="13px"
          fontWeight={500}
          size="xs"
          variant="ghost"
          height="20px"
          color="var(--color-blue)"
        >
          직접 입력
        </Button>
      </Header>
      <Slide>
        <Box pt={2} pb={10} px={5} bgColor="white">
          <Box mb={2} fontSize="24px" fontWeight={600}>
            스터디를 진행할 <br /> 장소를 선택해 주세요
          </Box>
          <Box fontWeight={300} color="var(--gray-500)" fontSize="13px">
            예정인 장소가 없다면 직접 입력하실 수 있습니다.
          </Box>
        </Box>

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
          <Box>
            {imageDataArr && (
              <ImageTileGridLayout
                imageDataArr={imageDataArr}
                grid={{ row: null, col: 4 }}
                selectedId={[placeId]}
                hasToggleHeart
              />
            )}
          </Box>
          {/* <Box mt={4} fontSize="18px" fontWeight={600}>
            신규 장소 직접 입력
          </Box>
          <Box mt={3}>
            <span>추가하고 싶은 스터디 장소를 검색해 주세요!</span>
          </Box>
          <Box mt={3}>
            <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} />
          </Box> */}
        </Flex>
      </Slide>
      <BottomNav text="스터디 신청" />
    </>
  );
}

export default Participate;
