import { useRouter } from "next/navigation";

import { ShortArrowIcon } from "../../Icons/ArrowIcons";
import ButtonWrapper from "../ButtonWrapper";

interface IArrowBackButton {
  defaultUrl?: string;
  url?: string;
  func?: () => void;
  color?: "mint" | "white";
}
export default function ArrowBackButton({
  url,
  func,
  defaultUrl,
  color = "white",
}: IArrowBackButton) {
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
      <ShortArrowIcon dir="left" color={color} />
    </ButtonWrapper>
  );
}
