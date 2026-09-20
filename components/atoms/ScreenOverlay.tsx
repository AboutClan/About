import styled from "styled-components";

interface IScreenOverlay {
  onClick?: () => void;
  zIndex?: number;
  darken?: boolean;
  /** 단순 시각 피드백용 딤(로딩 등)에서 true. 아래 컨텐츠 조작을 막지 않는다.
   *  딤 클릭으로 닫는 오버레이는 기본값(false)을 그대로 쓴다. */
  isPassThrough?: boolean;
}

function ScreenOverlay({ onClick, zIndex, darken = false, isPassThrough = false }: IScreenOverlay) {
  return (
    <StyledOverlay
      darken={darken}
      onClick={onClick}
      zIndex={zIndex}
      isPassThrough={isPassThrough}
    />
  );
}

const StyledOverlay = styled.div<{ zIndex: number; darken: boolean; isPassThrough: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  z-index: ${(props) => props.zIndex || 100};
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.darken ? "rgba(0,0,0,0.7)" : "rgba(0, 0, 0, 0.5)")};
  ${(props) => props.isPassThrough && "pointer-events: none;"}
`;
export default ScreenOverlay;
