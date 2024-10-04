import { Box } from "@chakra-ui/react";
import PageIntro from "../../../components/atoms/PageIntro";
import SectionTitle from "../../../components/atoms/SectionTitle";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ImageUploadInput from "../../../components/molecules/ImageUploadInput";
import LocationSearch from "../../../components/organisms/location/LocationSearch";

function Certification() {
  return (
    <>
      <Box minH="calc(100dvh - var(--header-h))" bgColor="white">
        <Header title="" isBorder={false} />
        <Slide>
          <PageIntro main={{ first: "출석 인증하기" }} sub="스터디 출석을 인증해 보세요" />
          <ImageUploadInput />
          <Box mx={4}>
            <Box mb={3}>
              <SectionTitle text="현재 장소" darkness="sub" />
            </Box>
            <LocationSearch />
          </Box>
        </Slide>
      </Box>
      <BottomNav />
    </>
  );
}

export default Certification;
