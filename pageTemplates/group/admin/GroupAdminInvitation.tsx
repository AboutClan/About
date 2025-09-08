import { Box, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import { Input } from "../../../components/atoms/Input";
import { MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import InviteUserGroups from "../../../components/molecules/groups/InviteUserGroups";
import { useAllUserDataQuery } from "../../../hooks/admin/quries";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useGroupInviteMutation } from "../../../hooks/groupStudy/mutations";
import {
  IUser,
  IUserSummary,
  UserSimpleInfoProps,
} from "../../../types/models/userTypes/userInfoTypes";
import { searchName } from "../../../utils/stringUtils";

export default function GroupAdminInvitation() {
  const toast = useToast();
  const { id } = useParams<{ id: string }>() || {};
  const [filterUsers, setFilterUsers] = useState<
    IUserSummary[] | IUser[] | UserSimpleInfoProps[]
  >();
  const [inviteUser, setInviteUser] = useState<IUserSummary>(null);
  const [nameValue, setNameValue] = useState("");

  const { data: usersAll, refetch, isLoading } = useAllUserDataQuery(null);

  const resetGroup = useResetGroupQuery();

  const { mutate: mutate2 } = useGroupInviteMutation(id, {
    onSuccess() {
      toast("success", "가입되었습니다.");
      resetGroup();
      refetch();
    },
  });

  useEffect(() => {
    setFilterUsers(null);

    if (isLoading || !usersAll) return;
    if (nameValue) {
      setFilterUsers(searchName(usersAll, nameValue));
    } else setFilterUsers(usersAll as IUser[]);
  }, [usersAll, nameValue]);

  const alertOptions: IAlertModalOptions = {
    title: "유저 초대",
    subTitle: `${inviteUser?.name}님을 초대합니다. 즉시 가입이 되기 때문에 해당 멤버와 사전 이야기가 된 경우에 이용해주세요!`,
    func: () => {
      mutate2({ status: "agree", userId: inviteUser._id });
      setInviteUser(null);
      resetGroup();
    },
    text: "초대",
  };

  return (
    <>
      <Box mt="16px">
        <Flex justify="space-between" align="flex-end">
          <Box>
            <Input
              placeholder="이름 검색"
              isLine
              size="sm"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
          </Box>
          {/* <Selector options={["전체", ...LOCATION_ALL]} defaultValue={value} setValue={setValue} /> */}
        </Flex>
        <Box position="relative">
          {isLoading ? (
            <Box h="200px">
              <MainLoadingAbsolute />
            </Box>
          ) : (
            <InviteUserGroups users={filterUsers} inviteUser={setInviteUser} />
          )}
        </Box>
      </Box>
      {inviteUser && <AlertModal options={alertOptions} setIsModal={() => setInviteUser(null)} />}
    </>
  );
}
