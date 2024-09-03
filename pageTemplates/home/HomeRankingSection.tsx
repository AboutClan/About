import RecommendationBannerCard from "../../components/organisms/cards/RecommendationBannerCard";
import { HOME_RECOMMENDATION_TAB_CONTENTS } from "../../constants/contents/homeRecommendationTab2";

function HomeRankingSection() {
  return (
    <>
      {HOME_RECOMMENDATION_TAB_CONTENTS.map((content) => (
        <RecommendationBannerCard key={content.title} {...content} />
      ))}
    </>
  );
}

export default HomeRankingSection;
