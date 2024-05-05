import { Button } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import { useCompleteToast, useErrorToast } from "../../../hooks/custom/CustomToast";
import { useGroupParticipationMutation } from "../../../hooks/groupStudy/mutations";
import { IGroup } from "../../../types/models/groupTypes/group";

interface IGroupBottomNav {
  data: IGroup;
}

type ButtonType = "cancel" | "participate" | "expire";

function GroupBottomNav({ data }: IGroupBottomNav) {
  const router = useRouter();
  const completeToast = useCompleteToast();

  const errorToast = useErrorToast();
  const { data: session } = useSession();

  const url = router.asPath;
  const myUid = session?.user.uid;

  const isPending = data.waiting.find((who) => who.user.uid === myUid);

  const GroupId = +router.query.id;

  const { mutate: cancel } = useGroupParticipationMutation("delete", GroupId, {
    onSuccess() {
      completeToast("free", "참여 신청이 취소되었습니다.", true);
      // resetQueryData([Group_CONTENT]);
    },
    onError: errorToast,
  });

  const onClick = (type: ButtonType) => {
    if (type === "cancel") cancel();
    if (type === "participate") router.push(`${url}/participate`);
  };

  const getButtonSettings = () => {
    if (isPending)
      return {
        text: "가입 대기중",
      };
    return {
      text: "가입 신청",
      handleFunction: () => onClick("participate"),
    };
  };

  const { text, handleFunction } = getButtonSettings();

  return (
    <>
      <Layout>
        <Button
          size="lg"
          w="100%"
          maxW="var(--view-max-width)"
          borderRadius="var(--rounded)"
          disabled={!handleFunction}
          colorScheme={handleFunction ? "mintTheme" : "redTheme"}
          onClick={handleFunction}
        >
          {text}
        </Button>
      </Layout>
    </>
  );
}

const Layout = styled.nav`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
  width: 100%;
  max-width: 390px;
  padding: var(--gap-4);
`;

export default GroupBottomNav;
