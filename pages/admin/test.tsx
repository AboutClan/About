import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

function Test() {
  const [value, setValue] = useState("");
  return (
    <>
      <Image
        src="https://studyabout.s3.ap-northeast-2.amazonaws.com/studyAttend/KakaoTalk_20240725_172337382.jpg"
        alt="test1"
        width={100}
        height={100}
      />
      <Box h="20px"></Box>
      <Image
        src="https://studyabout.s3.ap-northeast-2.amazonaws.com/studyAttend/1721895800.jpg"
        alt="test2"
        width={100}
        height={100}
      />
    </>
  );
}

export default Test;
