import { useState } from "react";

import AlertNotCompletedModal from "../../../components/AlertNotCompletedModal";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ButtonCard from "../../../components/molecules/cards/ButtonCard";
import { POINT_GET_ACTIBITY_LIST } from "../../../constants/serviceConstants/pointSystemConstants";

export default function Activity() {
  const [isModal, setIsModal] = useState(false);
  return (
    <>
      <Header title="동아리 활동" />
      <Slide>
        {POINT_GET_ACTIBITY_LIST.map((item, idx) => (
          <ButtonCard key={idx} props={{ ...item, func: () => setIsModal(true) }} />
        ))}
      </Slide>
      {isModal && <AlertNotCompletedModal setIsModal={setIsModal} />}
    </>
  );
}
