import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";

import { prevPageUrlState } from "../../recoils/navigationRecoils";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions } from "../Modals";
import PageGuideModal from "../PageGuideModal";

function FAQPopUp({ setIsModal }: IModal) {
  const router = useRouter();
  const setPrevPageUrl = useSetRecoilState(prevPageUrlState);

  const onSubmit = () => {
    setPrevPageUrl("/home");
    router.push(`/faq`);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "보러가기",
      func: onSubmit,
    },
    sub: { text: "닫기" },
    isFull: true,
  };

  return (
    <PageGuideModal title="뉴비 가이드" footerOptions={footerOptions} setIsModal={setIsModal}>
      아직도 이걸 몰라?! 당신은 뉴비군요?!
      <br />
      궁금한 거 있으면 보고 가 ~!
    </PageGuideModal>
  );
}

export default FAQPopUp;
