import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Textarea from "../../../../components/atoms/Textarea";
import WritingHeader from "../../../../components/molecules/headers/WritingHeader";
import ImageUploadInput from "../../../../components/molecules/ImageUploadInput";

function GroupWritingFeed() {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState();

  return (
    <>
      <WritingHeader />
      <Box m="16px">
        <Textarea
          placeholder="피드를 남겨보세요"
          minHeight={200}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
      <Box m="16px">
        <ImageUploadInput setImageUrl={setImageUrl} />
      </Box>
    </>
  );
}

export default GroupWritingFeed;
