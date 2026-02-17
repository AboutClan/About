import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import TabNav from "../../../components/molecules/navs/TabNav";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { AdminSection } from "../../../pageTemplates/group/admin/AdminSection";
import DeleteSection from "../../../pageTemplates/group/admin/DeleteSection";
import { InviteSection } from "../../../pageTemplates/group/admin/InviteSection";
import { GroupParicipantProps } from "../../../types/models/groupTypes/group";

const TAB_ARR = ["참여 인원 관리", "신청 인원 확인", "내보내기/보증금"] as const;

type Tab = (typeof TAB_ARR)[number];

function Admin() {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const { data: group } = useGroupIdQuery(id, { enabled: !!id });

  const [users, setUsers] = useState<GroupParicipantProps[]>([]);
  const [tab, setTab] = useState<Tab>("참여 인원 관리");

  useEffect(() => {
    if (group) {
      setUsers(group.participants);
    }
  }, [group]);

  return (
    <>
      <Header title="관리자 페이지" />
      <Slide>
        <TabNav
          tabOptionsArr={TAB_ARR.map((tab) => ({
            text: tab,
            func: () => setTab(tab),
          }))}
          selected={tab}
          isFullSize
          isBlack
        />
        {tab === "참여 인원 관리" ? (
          <AdminSection groupId={id} users={users} randomTicket={group?.randomTicket} />
        ) : tab === "신청 인원 확인" ? (
          <InviteSection group={group} />
        ) : (
          <DeleteSection group={group} users={users} />
        )}
      </Slide>
    </>
  );
}

export default Admin;
