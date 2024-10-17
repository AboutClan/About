import { useState } from "react";

import UserNavigationBlock from "./UserNavigationBlock";
import UserNavigationModals from "./UserNavigationModals";

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
  | "mainPlace";

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
