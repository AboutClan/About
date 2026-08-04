import { useRouter } from "next/router";

import { ModalLayout } from "../../modals/Modals";
import { IModal } from "../../types/components/modalTypes";

function CafeMapGuestModal({ setIsModal }: IModal) {
  const router = useRouter();

  return (
    <ModalLayout
      title="게스트 안내"
      setIsModal={setIsModal}
      footerOptions={{
        main: {
          text: "가입 신청",
          func: () => {
            router.push("/cafe-map/login");
          },
        },
        sub: {
          text: "다음에",
          func: () => setIsModal(false),
        },
      }}
    >
      <p>
        게스트 로그인은 <b>지도 탐색</b>만 가능해요😢 <br />
        <b>30초</b>면 가입하고 모든 기능을 이용할 수 있어요!
      </p>
    </ModalLayout>
  );
}

export default CafeMapGuestModal;
