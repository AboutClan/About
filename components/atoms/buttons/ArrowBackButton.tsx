import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";

import { backUrlState } from "../../../recoils/navigationRecoils";
import { ShortArrowIcon } from "../../Icons/ArrowIcons";
import ButtonWrapper from "../ButtonWrapper";

interface IArrowBackButton {
  url?: string;
  func?: () => void;
  color?: "mint" | "white";
}
export default function ArrowBackButton({ url, func, color = "mint" }: IArrowBackButton) {
  const router = useRouter();
  const [backUrl, setBackUrl] = useRecoilState(backUrlState);

  const handleGoBack = () => {
    if (func) {
      func();
      return;
    }
    if (url) {
      if (backUrl) {
        router.push(backUrl);
        setBackUrl(null);
      } else {
        router.push(url);
      }
    } else if (window.history.length > 1) router.back();
  };

  return <ArrowBackButtonUI onClick={handleGoBack} color={color} />;
}

export function ArrowBackButtonUI({
  onClick,
  color,
}: {
  onClick: () => void;
  color: "mint" | "white";
}) {
  return (
    <ButtonWrapper onClick={onClick}>
      <ShortArrowIcon size="lg" dir="left" color={color} />
    </ButtonWrapper>
  );
}
