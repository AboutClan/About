import { useState } from "react";

import RuleIcon from "../../components/atoms/Icons/RuleIcon";
import Header from "../../components/layouts/Header";
import GatherRuleModal from "../../modals/gather/GatherRuleModal";

function GatherHeader() {
  const [isModal, setIsModal] = useState(false);
  return (
    <>
      <Header title="모임" url="/home?tab=gather">
        <RuleIcon setIsModal={setIsModal} />
      </Header>
      {isModal && <GatherRuleModal setIsModal={setIsModal} />}
    </>
  );
}

export default GatherHeader;
