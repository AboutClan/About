import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { Input } from "../../../components/atoms/Input";
import Header from "../../../components/layouts/Header";
import { USER_BADGE_ARR } from "../../../constants/serviceConstants/badgeConstants";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useAddBadgeListMutation } from "../../../hooks/user/mutations";

function Badge() {
  const toast = useToast();
  const [userId, setUserId] = useState("");
  const [value, setValue] = useState("");

  const { mutate } = useAddBadgeListMutation();

  const onSubmit = () => {
    if (!USER_BADGE_ARR.includes(value as unknown as (typeof USER_BADGE_ARR)[number])) {
      toast("info", "배지를 확인해 주세요");
      return;
    }
    mutate({ userId, badgeName: value });
  };

  return (
    <>
      <Header title="배지 부여" />
      <Flex flexDir="column" gap={2} mt={10} mx={5}>
        <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="userId" />
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="badge" />
        <Button onClick={onSubmit}>부여</Button>
      </Flex>
    </>
  );
}

export default Badge;
