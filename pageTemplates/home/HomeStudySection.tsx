import HomeNewStudySpace from "./study/HomeNewStudySpace";
import StudyController from "./study/studyController/StudyController";

interface HomeStudySectionProps{
    
}

function HomeStudySection({}:HomeStudySectionProps){

  return (
    <>
      <StudyController />
      <HomeStudySection />
      <HomeNewStudySpace />
    </>
  );
}

export default HomeStudySection
