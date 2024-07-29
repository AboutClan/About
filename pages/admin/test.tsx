import { Box } from "@chakra-ui/react";
import Image from "next/image";

function Test() {
  // const [imageUrl, setImageUrl] = useState();
  // const { mutate } = useFeedMutation({
  //   onSuccess() {
  //     console.log("SUC");
  //   },
  // });

  // const { data } = useFeedQuery("66a23c6c8fd6de2b942692ff");
  // // console.log(2, data);
  // const formData = new FormData();
  // console.log(4, imageUrl);
  // const onClick = () => {
  //   appendFormData(formData, "type", "test1");
  //   appendFormData(formData, "images", imageUrl);
  //   appendFormData(formData, "title", "studyAttend");
  //   appendFormData(formData, "text", "test2");
  //   appendFormData(formData, "writer", "test3");
  //   mutate(formData);
  // };

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
