import styled from "styled-components";

interface IAboutIcon {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  size?: any;
}

export function AboutIcon({ size }: IAboutIcon) {
  return <Layout size={size}>A</Layout>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = styled.div<{ size: any }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 700;
  font-size: ${(props) => (props.size === "md" ? "24px" : "16px")};
  width: ${(props) => (props.size === "md" ? "42px" : "28px")};
  height: ${(props) => (props.size === "md" ? "42px" : "28px")};
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: linear-gradient(95deg, #1ad69c 3.1%, #05b0e0 96.31%);
`;

export function VoteIconA() {
  return (
    <button
      style={{
        width: "34px",
        height: "34px",
        padding: "4px",
        borderRadius: "50%",
        backgroundColor: "rgba(0, 194, 179, 0.1)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#00c2b3",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontWeight: "700",
        }}
      >
        A
      </div>
    </button>
  );
}

export function VoteIconDefault() {
  return (
    <button
      style={{
        width: "34px",
        height: "34px",
        padding: "4px",
        borderRadius: "50%",
        backgroundColor: "rgba(0, 194, 179, 0.1)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#00c2b3",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontWeight: "700",
          padding: "4px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: "white",
          }}
        ></div>
      </div>
    </button>
  );
}
