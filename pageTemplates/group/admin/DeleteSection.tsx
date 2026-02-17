import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import { useGroupExileUserMutation } from "../../../hooks/groupStudy/mutations";
import { IFooterOptions, ModalLayout } from "../../../modals/Modals";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { GroupParicipantProps, IGroup } from "../../../types/models/groupTypes/group";

interface SelectMemberProps {
  type: "exile" | "deposit" | null;
  userId: string;
}

interface DeleteSectionProps {
  users: GroupParicipantProps[];
  group: IGroup;
}

function DeleteSection({ users, group }: DeleteSectionProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const userInfo = useUserInfo();

  const { mutate, isLoading: isLoading } = useGroupExileUserMutation(+group.id, {
    onSuccess() {
      queryClient.invalidateQueries([GROUP_STUDY]);
      toast("success", "추방되었습니다.");
      setSelectMember(null);
    },
    onError(err) {
      console.error(err);
    },
  });

  const [selectMember, setSelectMember] = useState<SelectMemberProps>();

  const findSelectMember = users?.find((user) => user?.user._id === selectMember?.userId);

  const footerOptions: IFooterOptions = {
    main: {
      text: selectMember?.type === "exile" ? "추 방" : "반 환",
      func: async () => {
        if (selectMember?.type === "exile") {
          mutate({
            userId: selectMember.userId,
          });
        } else {
          queryClient.invalidateQueries([GROUP_STUDY]);
          setSelectMember(null);
          toast("success", "전송 완료");
        }
      },
      isLoading: isLoading,
    },
    sub: {
      text: "취 소",
    },
    colorType: "red",
  };
  return (
    <>
      {users
        ?.filter((user) => user?.user?._id !== userInfo?._id)
        .map((who, idx) => (
          <Box key={idx}>
            <DeleteUserBlock setSelectMember={setSelectMember} who={who} isLoading={isLoading} />
          </Box>
        ))}
      {selectMember && (
        <ModalLayout
          title="멤버 추방"
          setIsModal={() => setSelectMember(null)}
          footerOptions={footerOptions}
        >
          <Box as="p">
            {selectMember.type === "exile" ? (
              <>{findSelectMember?.user.name}님을 소모임에서 추방합니다.</>
            ) : (
              <></>
            )}
          </Box>
        </ModalLayout>
      )}
    </>
  );
}

interface DeleteUserBlockProps {
  who: GroupParicipantProps;
  isLoading: boolean;
  setSelectMember: DispatchType<SelectMemberProps>;
}

function DeleteUserBlock({ who, setSelectMember, isLoading }: DeleteUserBlockProps) {
  const toast = useToast();
  return (
    <ProfileCommentCard
      user={who.user}
      comment={{
        comment: `보유 보증금: ${who?.deposit || 0} Point`,
      }}
      rightComponent={
        <Flex align="center">
          <Button
            onClick={() => {
              toast("warning", "반환 가능한 보증금이 없습니다.");
            }}
            colorScheme="mint"
            size="sm"
            ml={3}
            variant="subtle"
            isLoading={isLoading}
          >
            보증금 반환
          </Button>
          <Button
            onClick={() => setSelectMember({ userId: who.user._id, type: "exile" })}
            colorScheme="red"
            variant="subtle"
            size="sm"
            ml={3}
            isLoading={isLoading}
          >
            추방
          </Button>
        </Flex>
      }
      isNoBorder
    />
  );
}

export default DeleteSection;
