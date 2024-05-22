import styled from "styled-components";

interface ISectionBar {
  title: string;
  rightComponent?: React.ReactNode;
  size?: "md" | "lg";
}
export default function SectionBar({ title, rightComponent, size = "lg" }: ISectionBar) {
  return (
    <SectionBarContainer size={size}>
      <TitleContainer size={size}>{title}</TitleContainer>
      {rightComponent}
    </SectionBarContainer>
  );
}

const SectionBarContainer = styled.div<{ size: "md" | "lg" }>`
  width: 100%;
  height: ${(props) => (props.size === "md" ? "51px " : "59px")};
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  background-color: white;
  border-top: var(--border);
  border-bottom: var(--border);
`;

const TitleContainer = styled.div<{ size: "md" | "lg" }>`
  font-size: ${(props) => (props.size === "lg" ? "18px" : "16px")};
  font-weight: ${(props) => (props.size === "lg" ? 700 : 600)};

  display: flex;
  align-items: center;
`;
