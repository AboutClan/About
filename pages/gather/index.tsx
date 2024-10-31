import { Box } from "@chakra-ui/react";
import Divider from "../../components/atoms/Divider";
import WritingIcon from "../../components/Icons/WritingIcon";
import Slide from "../../components/layouts/PageSlide";
import GatherHeader from "../../pageTemplates/gather/GatherHeader";
import GatherMain from "../../pageTemplates/gather/GatherMain";
import GatherReviewSlider from "../../pageTemplates/gather/GatherReviewSlider";

function Gather() {
  return (
    <>
      <GatherHeader />
      <Slide isNoPadding>
        <GatherReviewSlider />
        <Divider />
        <Box h={4} />
        {/**임시 비활성화 */}
        {/* <GatherLocationFilter /> */}
        <GatherMain />
      </Slide>
      <WritingIcon url="/gather/writing/category" />
    </>
  );
}

export default Gather;
