import { Box, Button, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import { GROUP_STUDY_ALL } from "../../../constants/keys/queryKeys";
import { GROUP_STUDY_ROLE } from "../../../constants/settingValue/groupStudy";
import { useCompleteToast } from "../../../hooks/custom/CustomToast";
import { useGroupExileUserMutation } from "../../../hooks/groupStudy/mutations";
import { useGroupQuery } from "../../../hooks/groupStudy/queries";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { checkGroupGathering } from "../../../libs/group/checkGroupGathering";
import { IGroup } from "../../../types/models/groupTypes/group";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

export default function Member() {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();
  const { id } = useParams<{ id: string }>() || {};

  const [deleteUser, setDeleteUser] = useState<IUserSummary>(null);
  const [group, setGroup] = useState<IGroup>();

  const { data: groups } = useGroupQuery();

  const queryClient = useQueryClient();
  const { mutate } = useGroupExileUserMutation(+id, {
    onSuccess() {
      queryClient.invalidateQueries([GROUP_STUDY_ALL]);
      completeToast("free", "추방되었습니다.");
    },
    onError(err) {
      console.error(err);
    },
  });

  const { mutate: handleBelong } = useUserInfoFieldMutation("belong", {
    onSuccess() {},
  });
  const belong = group && checkGroupGathering(group.hashTag);

  useEffect(() => {
    if (groups) setGroup(groups.find((item) => item.id + "" === id));
  }, [groups]);

  const alertOptions: IAlertModalOptions = {
    title: "유저 추방",
    subTitle: `${deleteUser?.name}님을 해당 모임에서 추방합니다.`,
    func: async () => {
      await mutate(deleteUser._id);
      if (belong) {
        await handleBelong({ uid: deleteUser.uid, belong: null });
      }
    },
    text: "추방",
  };
  console.log(deleteUser);
  return (
    <>
      <Header title="멤버 관리" />
      <Slide>
        <Box>
          <Box p="12px 16px" fontSize="16px" fontWeight={800}>
            참여중인 멤버
          </Box>
          <Flex direction="column">
            {group?.participants.map((who, idx) => (
              <Box key={idx}>
                <ProfileCommentCard
                  user={who.user}
                  comment={`구성:${GROUP_STUDY_ROLE[who.role]} / 출석 횟수:${who.attendCnt}회`}
                  rightComponent={
                    who.user?.uid !== session?.user.uid ? (
                      <Button
                        onClick={() => setDeleteUser(who.user)}
                        colorScheme="redTheme"
                        size="sm"
                      >
                        추방
                      </Button>
                    ) : null
                  }
                />
              </Box>
            ))}
          </Flex>
        </Box>
      </Slide>
      {deleteUser && <AlertModal options={alertOptions} setIsModal={() => setDeleteUser(null)} />}
    </>
  );
}
