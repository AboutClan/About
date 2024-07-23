import { Button } from "@chakra-ui/react";
import { useState } from "react";
import Textarea from "../../components/atoms/Textarea";

import WritingNavigation from "../../components/atoms/WritingNavigation";

function Test() {
  const [value, setValue] = useState("");
  return (
    <>
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} />
      <Button>제출</Button>
      <WritingNavigation />
    </>
  );
}

export default Test;
