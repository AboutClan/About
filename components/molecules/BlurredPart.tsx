import styled from "styled-components";

interface IBlurredPart {
  children: React.ReactNode;
  isBlur?: boolean;
  text?: string;
  isCenter?: boolean;
  size?: "md" | "lg";
}

function BlurredPart({
  children,
  isBlur,
  text = "게스트는 확인할 수 없는 내용입니다!",
  isCenter = true,
  size = "md",
}: IBlurredPart) {
  return (
    <Container isBlur={isBlur} size={size}>
      <Layout isBlur={isBlur}>{children}</Layout>
      {isBlur && (isCenter ? <Message>{text}</Message> : <Text></Text>)}
    </Container>
  );
}

const Container = styled.div<{ isBlur?: boolean; size: "md" | "lg" }>`
  position: ${(props) => props.isBlur && "relative"};
  font-size: ${(props) => (props.size === "md" ? "inherit" : "20px")};
`;

const Layout = styled.div<{ isBlur?: boolean }>`
  filter: ${(props) => props.isBlur && "blur(4px)"};
  pointer-events: ${(props) => (props.isBlur ? "none" : "auto")}; /* 드래그 방지 */
  user-select: ${(props) => (props.isBlur ? "none" : "auto")}; /* 복사 방지 */
`;

const Text = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
  font-weight: 600;
`;

const Message = styled.div`
  width: max-content;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  font-weight: 600;
`;

export default BlurredPart;
