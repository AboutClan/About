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
          <AdminSection
            groupId={id}
            users={[...users].sort((a, b) => a.user.name.localeCompare(b.user.name))}
            randomTicket={group?.randomTicket}
          />
        ) : tab === "신청 인원 확인" ? (
          <InviteSection group={group} />
        ) : (
          <DeleteSection
            group={group}
            users={[...users].sort((a, b) => a.user.name.localeCompare(b.user.name))}
          />
        )}
      </Slide>
    </>
  );
}

export default Admin;

import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../pages/api/auth/[...nextauth]";

const GROUP_SUPER_ADMIN_UIDS = ["2259633694"];
const GROUP_ADMIN_ROLES = ["admin", "manager"];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const id = context.params?.id;
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

  try {
    const res = await fetch(`${SERVER_URI}/groupStudy?groupStudyId=${id}`);
    if (res.ok) {
      const group = await res.json();
      const myParticipant = group?.participants?.find(
        (p: { user: { _id: string }; role: string }) =>
          p.user?._id === session.user.id,
      );
      const isGroupAdmin =
        myParticipant && GROUP_ADMIN_ROLES.includes(myParticipant.role);
      const isSuperAdmin = GROUP_SUPER_ADMIN_UIDS.includes(session.user.uid);

      if (!isGroupAdmin && !isSuperAdmin) {
        return { redirect: { destination: "/home", permanent: false } };
      }
    }
  } catch {}

  return { props: {} };
};
