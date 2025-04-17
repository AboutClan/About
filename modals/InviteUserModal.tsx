import { Box } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../components/atoms/Input";
import { MainLoadingAbsolute } from "../components/atoms/loaders/MainLoading";
import ButtonGroups from "../components/molecules/groups/ButtonGroups";
import InviteUserGroups from "../components/molecules/groups/InviteUserGroups";
import { useAllUserDataQuery } from "../hooks/admin/quries";
import { useTypeToast } from "../hooks/custom/CustomToast";
import { useGatherInviteMutation } from "../hooks/gather/mutations";
import { IModal } from "../types/components/modalTypes";
import { IUserSummary } from "../types/models/userTypes/userInfoTypes";
import { Location } from "../types/services/locationTypes";
import { IFooterOptions, ModalLayout } from "./Modals";

interface IInviteUserModal extends IModal {
  prevUsers: IUserSummary[];
  filterUsers?: string[];
}

export default function InviteUserModal({ setIsModal, prevUsers, filterUsers }: IInviteUserModal) {
  const typeToast = useTypeToast();
  const { id } = useParams<{ id: string }>() || {};
  console.log(filterUsers);
  const [location, setLocation] = useState<Location | "전체">("전체");
  const [inviteUser, setInviteUser] = useState<IUserSummary>(null);
  const [users, setUsers] = useState<IUserSummary[]>(null);
  const [existUsers, setExistUsers] = useState<IUserSummary[]>(prevUsers);
  const [nameValue, setNameValue] = useState("");

  const { data: usersAll, isLoading } = useAllUserDataQuery(null);

  const { mutate } = useGatherInviteMutation(+id, {
    onSuccess() {
      typeToast("invite");
    },
  });

  useEffect(() => {
    // const filtered = filterUsers?.length
    //   ? usersAll?.filter((user) => filterUsers.includes(user._id))
    //   : usersAll;
    // if (nameValue) setUsers(searchName(filtered, nameValue));
    // else setUsers(filtered);
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

  const buttonOptionsArr = [
    {
      text: "전체",
      func: () => setLocation("전체"),
    },
    {
      text: "수원",
      func: () => setLocation("수원"),
    },
    {
      text: "양천",
      func: () => setLocation("양천"),
    },
    {
      text: "강남",
      func: () => setLocation("강남"),
    },
    {
      text: "안양",
      func: () => setLocation("안양"),
    },
    {
      text: "동대문",
      func: () => setLocation("동대문"),
    },
    {
      text: "인천",
      func: () => setLocation("인천"),
    },
  ];

  return (
    <ModalLayout setIsModal={setIsModal} title="인원 초대" footerOptions={footerOptions}>
      <ButtonGroups buttonOptionsArr={buttonOptionsArr} currentValue={location} />
      <Box mt="16px">
        <Input
          placeholder="이름 검색"
          size="xs"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
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
