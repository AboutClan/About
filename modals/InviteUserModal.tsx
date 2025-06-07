import { Box } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../components/atoms/Input";
import { MainLoadingAbsolute } from "../components/atoms/loaders/MainLoading";
import InviteUserGroups from "../components/molecules/groups/InviteUserGroups";
import { useAllUserDataQuery } from "../hooks/admin/quries";
import { useResetGatherQuery } from "../hooks/custom/CustomHooks";
import { useTypeToast } from "../hooks/custom/CustomToast";
import { useGatherInviteMutation } from "../hooks/gather/mutations";
import { IModal } from "../types/components/modalTypes";
import { IUser, IUserSummary } from "../types/models/userTypes/userInfoTypes";
import { searchName } from "../utils/stringUtils";
import { IFooterOptions, ModalLayout } from "./Modals";

interface IInviteUserModal extends IModal {
  prevUsers: IUserSummary[];
  filterUsers?: string[];
}

export default function InviteUserModal({ setIsModal, prevUsers, filterUsers }: IInviteUserModal) {
  const typeToast = useTypeToast();
  const { id } = useParams<{ id: string }>() || {};
  const resetQuery = useResetGatherQuery();

  const [inviteUser, setInviteUser] = useState<IUserSummary>(null);
  const [users, setUsers] = useState<IUserSummary[]>(null);
  const [existUsers, setExistUsers] = useState<IUserSummary[]>(prevUsers);
  const [nameValue, setNameValue] = useState("");

  const { data: usersAll, isLoading } = useAllUserDataQuery(null);

  const { mutate } = useGatherInviteMutation(+id, {
    onSuccess() {
      resetQuery();
      typeToast("invite");
    },
  });

  useEffect(() => {
    const filtered = filterUsers?.length
      ? usersAll?.filter((user) => filterUsers.includes(user._id))
      : usersAll;
    if (nameValue) setUsers(searchName(filtered as IUser[], nameValue));
    else setUsers(filtered as IUser[]);
  }, [nameValue, usersAll]);

  useEffect(() => {
    if (!inviteUser) return;
    mutate({ phase: "first", userId: inviteUser._id });
    setUsers((old) => old.filter((who) => who.uid !== inviteUser.uid));
    setExistUsers((old) => [...old, inviteUser]);
    setInviteUser(null);
  }, [inviteUser]);

  const footerOptions: IFooterOptions = {
    main: {
      text: "닫기",
    },
  };

  return (
    <ModalLayout setIsModal={setIsModal} title="인원 초대" footerOptions={footerOptions}>
      <Box mt="16px">
        <Input
          placeholder="이름 검색"
          isLine
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          size="sm"
        />
      </Box>
      <Box
        h="300px"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {!isLoading ? (
          <InviteUserGroups
            users={users}
            inviteUser={(who) => setInviteUser(who)}
            existUsers={existUsers}
          />
        ) : (
          <MainLoadingAbsolute />
        )}
      </Box>
    </ModalLayout>
  );
}
