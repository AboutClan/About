import { useState } from "react";

import UserNavigationBlock from "@/pageTemplates/user/userNavigation/UserNavigationBlock";
import UserNavigationModals from "@/pageTemplates/user/userNavigation/UserNavigationModals";

export type UserOverviewModal =
  | "suggest"
  | "declaration"
  | "rest"
  | "spaceSetting"
  | "birthday"
  | "deposit"
  | "secede"
  | "logout"
  | "levelUp"
  | "studyPlace"
  | "profile"
  | "mainPlace"
  | "isLocationSharingDenided"
  | "coupon"
  | "friend"
  | "id";

function UserNavigation() {
  const [modalOpen, setModalOpen] = useState<UserOverviewModal>();

  return (
    <>
      <UserNavigationBlock setModalOpen={setModalOpen} />
      <UserNavigationModals modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
}

export default UserNavigation;
