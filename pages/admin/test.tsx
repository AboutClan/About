import { Button } from "@chakra-ui/react";
import { useState } from "react";

import ImageUploadInput from "../../components/molecules/ImageUploadInput";
import { useFeedMutation } from "../../hooks/feed/mutations";
import { appendFormData } from "../../utils/formDataUtils";
function Test() {
  const [imageUrl, setImageUrl] = useState();
  const { mutate } = useFeedMutation({
    onSuccess() {
      console.log("SUC");
    },
  });
  console.log(2, imageUrl);

  const formData = new FormData();

  const onClick = () => {
    appendFormData(formData, "type", "test");
    appendFormData(formData, "image", "imageUrl");
    appendFormData(formData, "title", "studyAttend");
    appendFormData(formData, "text", "studyAttend");
    appendFormData(formData, "writer", "studyAttend");
    mutate(formData);
  };

  return (
    <>
      <ImageUploadInput setImageUrl={setImageUrl} />
      <Button onClick={onClick}>제출</Button>
    </>
  );
}

export default Test;
