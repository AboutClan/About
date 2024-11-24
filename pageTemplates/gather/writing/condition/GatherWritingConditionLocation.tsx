import styled from "styled-components";

import { DispatchType } from "../../../../types/hooks/reactTypes";
import { Location } from "../../../../types/services/locationTypes";

interface IGatherWritingConditionLocation {
  setLocation: DispatchType<Location>;
}

function GatherWritingConditionLocation({ setLocation }: IGatherWritingConditionLocation) {
  console.log(setLocation);
  // const [buttonType, setButtonType] = useState<Location>("전체");

  // useEffect(() => {
  //   if (buttonType) setLocation(buttonType);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [buttonType]);

  return (
    <Layout>
      {/* {arr.map((item) => (
        <Button
          size="sm"
          key={item}
          colorScheme={buttonType === item ? "mint" : "gray"}
          mr="var(--gap-2)"
          onClick={() => setButtonType(item)}
        >
          {item}
        </Button>
      ))} */}
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-3);
  margin-bottom: 4px;
  display: flex;
`;

export default GatherWritingConditionLocation;
