import Divider from "../../components/atoms/Divider";
import Slide from "../../components/layouts/PageSlide";
import GatherHeader from "../../pageTemplates/gather/GatherHeader";
import GatherLocationFilter from "../../pageTemplates/gather/GatherLocationFilter";
import GatherMain from "../../pageTemplates/gather/GatherMain";
import GatherReviewSlider from "../../pageTemplates/gather/GatherReviewSlider";

function Gather() {
  return (
    <>
      <GatherHeader />
      <Slide isNoPadding>
        <GatherReviewSlider />
        <Divider />
        <GatherLocationFilter />
        <GatherMain />
      </Slide>
    </>
  );
}

export default Gather;
