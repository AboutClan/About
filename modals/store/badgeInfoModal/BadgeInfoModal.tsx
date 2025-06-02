import { useState } from "react";

import { IModal } from "../../../types/components/modalTypes";
import { IFooterOptions, IHeaderOptions, ModalLayout } from "../../Modals";
import BadgeInfoModalFirstInfo from "./BadgeInfoModalFirstInfo";
import BadgeInfoModalSecondInfo from "./BadgeInfoModalSecondInfo";

function BadgeInfoModal2({ setIsModal }: IModal) {
  const [page, setPage] = useState(0);

  const onClick = () => {
    if (page === 0) setPage(1);
    else setIsModal(false);
  };

  const headerOptions: IHeaderOptions = {
    subTitle:
      page === 0
        ? "활동을 통해 다양한 배지를 획득해 보세요!"
        : "특정 기간 또는 이벤트를 통해 획득 수 있습니다!",
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: page === 0 ? "다음 페이지" : "확인했어요!",
      func: onClick,
    },
  };

  return (
    <ModalLayout
      headerOptions={headerOptions}
      title={page === 0 ? "멤버 배지" : "유니크 배지"}
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      {page === 0 ? <BadgeInfoModalFirstInfo /> : <BadgeInfoModalSecondInfo />}
    </ModalLayout>
  );
}

export default BadgeInfoModal2;
