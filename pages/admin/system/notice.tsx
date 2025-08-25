import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { Input } from "../../../components/atoms/Input";
import Header from "../../../components/layouts/Header";
import { useSendNotificationAllMutation } from "../../../hooks/FcmManger/mutations";

function Notice() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const { mutate } = useSendNotificationAllMutation();

  const onSubmit = () => {
    mutate({ title, description: text });
  };

  return (
    <>
      <Header title="공지 작성" />
      <Flex flexDir="column" gap={2} mt={10} mx={5}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="본문" />
        <Button onClick={onSubmit}>부여</Button>
      </Flex>
    </>
  );
}

export default Notice;
