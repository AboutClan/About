import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import Divider from "../../components/atoms/Divider";
import WritingIcon from "../../components/atoms/Icons/WritingIcon";
import Slide from "../../components/layouts/PageSlide";
import { GATHER_INTRO_MODAL } from "../../constants/keys/localStorage";
import GatherIntroModal from "../../modals/gather/GatherIntroModal";
import GatherHeader from "../../pageTemplates/gather/GatherHeader";
import GatherLocationFilter from "../../pageTemplates/gather/GatherLocationFilter";
import GatherMain from "../../pageTemplates/gather/GatherMain";
import GatherReviewSlider from "../../pageTemplates/gather/GatherReviewSlider";
import { isGatherAlertState } from "../../recoils/renderRecoils";
import { checkAndSetLocalStorage } from "../../utils/storageUtils";

function Gather() {
  const { data: session } = useSession();

  const isGuest = session?.user.name === "guest";

  const [isModal, setIsModal] = useState(false);
  const setIsGatherAlert = useSetRecoilState(isGatherAlertState);

  useEffect(() => {
    if (!checkAndSetLocalStorage(GATHER_INTRO_MODAL, 7)) {
      setIsModal(true);
      setIsGatherAlert(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GatherHeader />
      <Slide>
        <GatherReviewSlider />
        <Divider />
        <GatherLocationFilter />
        <GatherMain />
      </Slide>
      {!isGuest && <WritingIcon url="/gather/writing/category" />}
      {isModal && <GatherIntroModal setIsModal={setIsModal} />}
    </>
  );
}

export default Gather;
