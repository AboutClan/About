import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useInteractionMutation } from "../../../hooks/user/sub/interaction/mutations";
import AlertModal, { IAlertModalOptions } from "../../AlertModal";
import { CheckCircleIcon } from "../../Icons/CircleIcons";
import { UserPlusIcon } from "../../Icons/UserIcons";
interface UserPlusButtonProps {
  toUid: string;
  isMyFriend;
}

function UserPlusButton({ toUid, isMyFriend }: UserPlusButtonProps) {
  const { data: session } = useSession();

  const toast = useToast();

  const [friendButtonType, setFriendButtonType] = useState<"friend" | "pending" | null>(
    isMyFriend ? "friend" : null,
  );
  const [isModal, setIsModal] = useState(false);

  const { mutate: requestFriend } = useInteractionMutation("friend", "post", {
    onSuccess() {
      toast("success", "친구 요청이 전송되었습니다.");
      setFriendButtonType("pending");
      setIsModal(false);
    },
  });

  const alertModalOptions: IAlertModalOptions = {
    title: "친구 요청",
    subTitle: "친구 요청을 보내시겠습니까?",
    func: () =>
      requestFriend({
        toUid: toUid,
        message: `${session?.user?.name}님의 친구추가 요청`,
      }),
    text: "전송",
  };

  return (
    <>
      <Button
        borderRadius="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        w={5}
        h={5}
        variant="unstyled"
        bg={friendButtonType === "pending" ? "mint" : null}
      >
        {friendButtonType === "friend" ? null : friendButtonType === "pending" ? (
          <CheckCircleIcon size="sm" isFill />
        ) : (
          <UserPlusIcon />
        )}
      </Button>
      {isModal && <AlertModal options={alertModalOptions} setIsModal={setIsModal} />}
    </>
  );
}

export default UserPlusButton;
