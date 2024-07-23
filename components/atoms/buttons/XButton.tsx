import { useRouter } from "next/navigation";
import styled from "styled-components";

interface XButtonProps {
  url?: string;
}
export default function XButton({ url }: XButtonProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (url) router.push(url);
    else router.back();
  };

  return <XButtonUI onClick={handleGoBack} />;
}

export function XButtonUI({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <i className="fa-solid fa-x fa-sm" />
    </Button>
  );
}

const Button = styled.button`
  padding: 16px;
`;
