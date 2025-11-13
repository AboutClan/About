import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { Input } from "../../../components/atoms/Input";
import Header from "../../../components/layouts/Header";
import ButtonGroups from "../../../components/molecules/groups/ButtonGroups";
import { useSendNotificationAllMutation } from "../../../hooks/FcmManger/mutations";

const STUDY_ALERT = [
  {
    title: "이번주 카공 같이 할 사람? ✨",
    description: "근처에 있는 멤버들이 스터디 기다리고 있어요! 지금 신청하고 같이 카공해요!",
  },
];

function Notice() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tab, setTab] = useState(null);

  const { mutate } = useSendNotificationAllMutation("study");
  console.log(3, STUDY_ALERT);
  const onSubmit = () => {
    mutate(STUDY_ALERT[0]);
  };

  return (
    <>
      <Header title="공지 작성" />
      <Box p={5}>
        <ButtonGroups
          buttonOptionsArr={[{ text: "스터디", func: () => setTab("스터디") }]}
          currentValue={tab}
        />
      </Box>
      <Flex flexDir="column" gap={2} mt={10} mx={5}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="본문" />
        <Button onClick={onSubmit}>부여</Button>
      </Flex>
    </>
  );
}

export default Notice;
