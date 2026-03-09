import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { Input } from "../../../components/atoms/Input";
import Header from "../../../components/layouts/Header";
import { useUserRandomTicketMutation } from "../../../hooks/user/mutations";

function Badge() {
  const [userId, setUserId] = useState("");

  const { mutate } = useUserRandomTicketMutation();

  const onSubmit = () => {
    mutate({ userId, number: 1 });
  };

  return (
    <>
      <Header title="배지 부여" />
      <Flex flexDir="column" gap={2} mt={10} mx={5}>
        <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="userId" />
        <Button onClick={onSubmit}>부여</Button>
      </Flex>
    </>
  );
}

export default Badge;
