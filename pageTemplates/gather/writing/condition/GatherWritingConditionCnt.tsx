import { useState } from "react";

import CountNum from "../../../../components/atoms/CountNum";

interface IGatherWritingConditionCnt {
  value: number;
}

function GatherWritingConditionCnt({ value }: IGatherWritingConditionCnt) {
  const [number, setNumber] = useState(value);

  return <CountNum value={number} setValue={setNumber} unit="명" min={4} isSmall={true} />;
}

export default GatherWritingConditionCnt;
