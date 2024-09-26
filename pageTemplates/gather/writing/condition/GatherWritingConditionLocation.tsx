import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { CombinedLocation } from "../../../../pages/gather/writing/condition";
import { DispatchType } from "../../../../types/hooks/reactTypes";
import { Location } from "../../../../types/services/locationTypes";

interface IGatherWritingConditionLocation {
  setLocation: DispatchType<Location | CombinedLocation>;
}

function GatherWritingConditionLocation({ setLocation }: IGatherWritingConditionLocation) {
  const [buttonType, setButtonType] = useState<CombinedLocation>("전체");

  const arr: CombinedLocation[] = ["전체", "수원/안양", "양천/강남"];

  useEffect(() => {
    if (buttonType) setLocation(buttonType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonType]);

  return (
    <Layout>
      {arr.map((item) => (
        <Button
          size="sm"
          key={item}
          colorScheme={buttonType === item ? "mintTheme" : "gray"}
          mr="var(--gap-2)"
          onClick={() => setButtonType(item)}
        >
          {item}
        </Button>
      ))}
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-3);
  margin-bottom: 4px;
  display: flex;
`;

export default GatherWritingConditionLocation;
