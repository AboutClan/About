import Slide from "../../../components/layouts/PageSlide";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import GatherParticipateDrawer from "../GatherParticipateDrawer";
interface IGatherBottomNav {
  data: IGather;
}

function GatherBottomNav({ data }: IGatherBottomNav) {
  return (
    <>
      <Slide isFixed={true} posZero="top">
        <GatherParticipateDrawer data={data} />
      </Slide>
    </>
  );
}

export default GatherBottomNav;
