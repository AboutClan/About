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
  height: ${(props) => (props.size === "md" ? "51px " : "64px")};

  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px; /* text-lg */
  font-weight: 600; /* font-semibold */
`;

const TitleContainer = styled.div<{ size: "md" | "lg" }>`
  font-size: ${(props) => (props.size === "lg" ? "20px" : "16px")}; /* text-lg */
  font-weight: 600;
  display: flex;
  align-items: center;
`;
