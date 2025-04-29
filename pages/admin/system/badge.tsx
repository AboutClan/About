import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { Input } from "../../../components/atoms/Input";
import Header from "../../../components/layouts/Header";

function Badge() {
  const [uid, setUid] = useState("");
  const [value, setValue] = useState("");

  // const { mutate } = useUserInfoFieldMutation("badgeList");

  //   const onSubmit = () => {

  // }

  return (
    <>
      <Header title="배지 부여" />
      <Flex flexDir="column" gap={2} mt={10} mx={5}>
        <Input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="uid" />
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="badge" />
        <Button>부여</Button>
      </Flex>
    </>
  );
}

export default Badge;
