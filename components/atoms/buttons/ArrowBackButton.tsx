import { useRouter } from "next/navigation";

import ButtonWrapper from "../ButtonWrapper";

interface IArrowBackButton {
  defaultUrl?: string;
  url?: string;
  func?: () => void;
}
export default function ArrowBackButton({ url, func, defaultUrl }: IArrowBackButton) {
  const router = useRouter();

  const handleGoBack = () => {
    if (func) {
      func();
      return;
    }
    if (url) router.push(url);
    else if (window.history.length > 1) router.back();
    else router.push(defaultUrl);
  };

  return <ArrowBackButtonUI onClick={handleGoBack} />;
}

export function ArrowBackButtonUI({ onClick }: { onClick: () => void }) {
  return (
    <ButtonWrapper onClick={onClick}>
      <i className="fa-solid fa-chevron-left fa-sm" />
    </ButtonWrapper>
  );
}
