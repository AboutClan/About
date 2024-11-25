import { Box, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import { Input } from "../../../components/atoms/Input";
import { MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import Selector from "../../../components/atoms/Selector";
import InviteUserGroups from "../../../components/molecules/groups/InviteUserGroups";
import { LOCATION_ALL } from "../../../constants/location";
import { useAdminUsersLocationControlQuery } from "../../../hooks/admin/quries";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useCompleteToast } from "../../../hooks/custom/CustomToast";
import { useGroupWaitingStatusMutation } from "../../../hooks/groupStudy/mutations";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { searchName } from "../../../utils/stringUtils";

type UserType = "신규 가입자" | "전체";

export default function GroupAdminInvitation() {
  const completeToast = useCompleteToast();
  const { data: session } = useSession();
  const location = session?.user.location;
  const { id } = useParams<{ id: string }>() || {};
  const [value, setValue] = useState(location);
  const [userFilterValue, setUserFilterValue] = useState<UserType>("신규 가입자");
  const [filterUsers, setFilterUsers] = useState<IUserSummary[]>();
  const [inviteUser, setInviteUser] = useState<IUserSummary>(null);
  const [nameValue, setNameValue] = useState("");

  useEffect(() => {
    setValue(location);
  }, []);

  const {
    data: usersAll,
    refetch,
    isLoading,
  } = useAdminUsersLocationControlQuery(value, null, false, { enabled: !!location });

  const resetGroup = useResetGroupQuery();

  const { mutate: mutate2 } = useGroupWaitingStatusMutation(+id, {
    onSuccess() {
      completeToast("free", "가입되었습니다.");
      resetGroup();
      refetch();
    },
  });

  useEffect(() => {
    setFilterUsers(null);
    if (isLoading || !usersAll) return;
    if (nameValue) {
      setFilterUsers(searchName(usersAll, nameValue));
    } else {
      setFilterUsers(
        usersAll.filter((user) =>
          user.isActive && userFilterValue === "전체" ? true : !user?.belong,
        ),
      );
    }
  }, [usersAll, nameValue]);

  const USER_TYPE_ARR: UserType[] = ["신규 가입자", "전체"];

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
          <Selector
            options={USER_TYPE_ARR}
            defaultValue={userFilterValue}
            setValue={setUserFilterValue}
          />
          <Box>
            <Input
              placeholder="이름 검색"
              size="xs"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
          </Box>
          <Selector options={LOCATION_ALL} defaultValue={value} setValue={setValue} />
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
