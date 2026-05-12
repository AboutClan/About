import { useState } from "react";

import MenuDrawer from "../../components/organisms/RightMenuDrawer";
import RequestStudyModal from "../../modals/userRequest/RequestStudyModal";

interface StudyMapMenuDrawerProps {
  onClose: () => void;
  addCafe: () => void;
}

function StudyMapMenuDrawer({ onClose, addCafe }: StudyMapMenuDrawerProps) {
  const [modal, setModal] = useState<"suggest" | "error">();
  return (
    <>
      <MenuDrawer
        title="메뉴"
        onClose={() => {
          onClose();
        }}
        items={[
          {
            label: "장소 추가 요청",
            onClick: () => {
              addCafe();
            },
          },
          {
            label: "정보 수정 요청",
            onClick: () => {
              setModal("suggest");
            },
          },
          {
            label: "오류 제보",
            onClick: () => {
              setModal("error");
            },
          },

          //   {
          //     label: "문의하기",
          //     onClick: () => toast("info", "준비중"),
          //   },
        ]}
      />{" "}
      {(modal === "suggest" || modal === "error") && (
        <RequestStudyModal
          title={modal === "suggest" ? "정보 수정 요청" : "오류 제보"}
          setIsModal={() => setModal(null)}
        />
      )}
    </>
  );
}

export default StudyMapMenuDrawer;
