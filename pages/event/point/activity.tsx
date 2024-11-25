import { useState } from "react";

import AlertNotCompletedModal from "../../../components/AlertNotCompletedModal";
import Header from "../../../components/layouts/Header";

export default function Activity() {
  const [isModal, setIsModal] = useState(false);
  return (
    <>
      <Header title="동아리 활동" />

      {/* {POINT_GET_ACTIBITY_LIST.map((item, idx) => (
          <ButtonCard key={idx} props={{ ...item, func: () => setIsModal(true) }} />
        ))} */}

      {isModal && <AlertNotCompletedModal setIsModal={setIsModal} />}
    </>
  );
}
