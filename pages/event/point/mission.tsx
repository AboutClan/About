import { useState } from "react";

import AlertNotCompletedModal from "../../../components/AlertNotCompletedModal";
import Header from "../../../components/layouts/Header";

export default function Mission() {
  const [isModal, setIsModal] = useState(false);
  return (
    <>
      <Header title="동아리 활동" />

      {isModal && <AlertNotCompletedModal setIsModal={setIsModal} />}
    </>
  );
}
