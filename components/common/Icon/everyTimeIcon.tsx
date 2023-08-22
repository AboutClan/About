import styled from "styled-components";

interface IEveryTimeIcon {
  isSmall: boolean;
}

function EveryTimeIcon({ isSmall }: IEveryTimeIcon) {
  const W = isSmall ? 40 : 54;
  return (
    <Layout
      isSmall={isSmall}
      xmlns="http://www.w3.org/2000/svg"
      version="1.0"
      width={W}
      height={W}
      viewBox="0 0 240.000000 240.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="rotate(20 120 120) translate(0.000000,240.000000) scale(0.100000,-0.100000)"
        fill="#C62917"
        stroke="none"
      >
        <path d="M648 2010 c-51 -15 -94 -49 -118 -92 -22 -37 -25 -55 -24 -128 1 -55 8 -106 21 -145 l19 -60 -27 -61 c-99 -220 -86 -459 39 -683 40 -73 144 -188 211 -234 l44 -30 -39 -12 c-93 -28 -138 -69 -132 -122 l3 -28 238 -3 237 -2 6 30 c6 30 7 30 75 30 66 0 68 -1 71 -27 l3 -28 243 -3 242 -2 0 30 c0 17 -4 40 -10 50 -13 24 -71 59 -122 75 l-41 12 44 30 c67 46 171 161 211 234 125 224 138 462 39 683 l-27 61 23 75 c47 160 18 281 -78 330 -82 43 -174 36 -297 -22 l-63 -29 -67 17 c-90 23 -254 23 -344 0 l-68 -18 -54 27 c-99 48 -193 65 -258 45z m685 -235 c185 -39 356 -205 413 -400 21 -71 23 -227 4 -295 -26 -98 -111 -232 -183 -290 -57 -46 -132 -89 -193 -112 -47 -17 -82 -21 -174 -22 -134 0 -201 20 -306 91 -80 55 -118 94 -170 174 -64 99 -87 174 -87 294 -1 113 16 185 66 280 42 78 155 191 235 233 110 59 258 76 395 47z" />
        <path d="M1066 1091 c-61 -65 -111 -122 -113 -127 -2 -5 8 -22 22 -39 l25 -30 89 92 89 93 76 -79 c42 -43 83 -86 90 -96 12 -17 15 -15 39 17 15 19 27 38 27 41 0 7 -219 241 -228 244 -4 1 -56 -51 -116 -116z" />
      </g>
    </Layout>
  );
}

const Layout = styled.svg<{ isSmall: boolean }>`
  position: absolute;
  top: ${(props) => (props.isSmall ? "-20px" : "-27px")};
  right: ${(props) => (props.isSmall ? "-20px" : "-27px")};
  z-index: -1;
`;

export default EveryTimeIcon;
