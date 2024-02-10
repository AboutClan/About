import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { CombinedLocation } from "../../../../pages/gather/writing/condition";
import { DispatchType } from "../../../../types/reactTypes";
import { Location } from "../../../../types/system";

interface IGatherWritingConditionLocation {
  setLocation: DispatchType<Location | CombinedLocation>;
}

function GatherWritingConditionLocation({
  setLocation,
}: IGatherWritingConditionLocation) {
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
          mr="var(--margin-md)"
          onClick={() => setButtonType(item)}
        >
          {item}
        </Button>
      ))}
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: var(--margin-sub);
  display: flex;
`;

export default GatherWritingConditionLocation;
