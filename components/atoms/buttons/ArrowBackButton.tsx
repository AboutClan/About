import { useRouter } from "next/navigation";
import styled from "styled-components";

interface IArrowBackButton {
  url?: string;
}
export default function ArrowBackButton({ url }: IArrowBackButton) {
  const router = useRouter();

  const handleGoBack = () => {
    if (url) router.push(url);
    else router.back();
  };

  return <ArrowBackButtonUI onClick={handleGoBack} />;
}

export function ArrowBackButtonUI({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <i className="fa-solid fa-chevron-left" />
    </Button>
  );
}

const Button = styled.button`
  padding: 16px;
`;
