import styled from "styled-components";

export function XAlertIcon() {
  return (
    <XAlertIconLayout>
      <i className="fa-solid fa-xmark fa-3x" style={{ color: "white" }} />
    </XAlertIconLayout>
  );
}

const XAlertIconLayout = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: var(--color-mint);
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface INewAlertIcon {
  size?: "sm" | "lg";
}

export function NewAlertIcon({ size = "lg" }: INewAlertIcon) {
  return (
    <>
      <i className={`fa-${size} fa-lg fa-circle-n`} style={{ color: "var(--color-red)" }} />
    </>
  );
}
