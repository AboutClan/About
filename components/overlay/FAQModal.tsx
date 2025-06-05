import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";

import { IFooterOptions } from "../../modals/Modals";
import PageGuideModal from "../../modals/PageGuideModal";
import { prevPageUrlState } from "../../recoils/navigationRecoils";
import { CloseProps } from "../../types/components/modalTypes";

function FAQModal({ onClose }: CloseProps) {
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
    <PageGuideModal title="자주 묻는 질문" footerOptions={footerOptions} setIsModal={onClose}>
      당신만 몰랐던 <b>About 자주 묻는 질문!</b>
      <br />
      About의 모든 궁금증 해결!
    </PageGuideModal>
  );
}

export default FAQModal;
