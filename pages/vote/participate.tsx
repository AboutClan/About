import { Box, Flex } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Selector from "../../components/atoms/Selector";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { IImageTileData } from "../../components/molecules/layouts/ImageTileFlexLayout";
import ImageTileGridLayout from "../../components/molecules/layouts/ImageTitleGridLayout";
import SearchLocation from "../../components/organisms/SearchLocation";
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

  return (
    <>
      <Header title="스터디 예약" />
      <Slide>
        <Flex direction="column" p={4}>
          <Flex justify="space-between" align="center" mb={2}>
            <Box fontSize="18px" fontWeight={600}>
              기존 스터디 장소
            </Box>
            <Selector options={LOCATION_OPEN} defaultValue={location} setValue={setLocation} />
          </Flex>
          <Box h={"240px"} p={4} border="var(--border-mint)" overflowY="auto">
            {imageDataArr && (
              <ImageTileGridLayout
                imageDataArr={imageDataArr}
                grid={{ row: null, col: 4 }}
                selectedId={[placeId]}
              />
            )}
          </Box>
          <Box mt={4} fontSize="18px" fontWeight={600}>
            신규 장소 직접 입력
          </Box>
          <Box mt={3}>
            <span>추가하고 싶은 스터디 장소를 검색해 주세요!</span>
          </Box>
          <Box mt={3}>
            <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} />
          </Box>
        </Flex>
      </Slide>
      <BottomNav text="스터디 신청" />
    </>
  );
}

export default Participate;
