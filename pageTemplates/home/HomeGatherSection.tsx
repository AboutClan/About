import SectionHeader from "../../components/atoms/SectionHeader";
import HomeGatherCol from "./HomeGatherCol";

interface HomeGatherSectionProps {}

function HomeGatherSection({}: HomeGatherSectionProps) {
  return (
    <>
      <SectionHeader title="About 번개" subTitle="Meeting" />
      <HomeGatherCol />
    </>
  );
}

export default HomeGatherSection;
