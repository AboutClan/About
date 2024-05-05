import {
  faAtom,
  faBuildingColumns,
  faChampagneGlasses,
  faCoffee,
  faExplosion,
  faGamepad,
  faPaperPlane,
  faPersonRunning,
  faShuttleSpace,
  faUserAstronaut,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TABLE_COLORS } from "../../constants/styles";

//모임 카테고리
export const GATHER_TYPES = [
  { title: "취미", subtitle: "보드게임·방탈출·볼링" },
  { title: "맛집·카페", subtitle: "맛집투어·카페·디저트" },
  { title: "술 번개", subtitle: "only 저녁" },
  { title: "운동", subtitle: "러닝·산책·등산·클라이밍·헬스" },
  { title: "게임", subtitle: "PC · 모바일 · 콘솔" },
  { title: "문화·예술", subtitle: "영화·전시·공연·연극·뮤지컬" },
  { title: "스터디", subtitle: "공간대여·스터디카페·커뮤니티룸" },
  { title: "힐링", subtitle: "피크닉·캠핑·드라이브" },
  { title: "정기모임", subtitle: "정기모임" },
  { title: "기타", subtitle: "" },
];

export const GatherCategoryIcons = [
  <FontAwesomeIcon icon={faUserAstronaut} key="1" color={TABLE_COLORS[0]} />,
  <FontAwesomeIcon icon={faCoffee} key="2" color={TABLE_COLORS[1]} />,
  <FontAwesomeIcon icon={faChampagneGlasses} key="drink" color={TABLE_COLORS[2]} />,
  <FontAwesomeIcon icon={faPersonRunning} key="3" color={TABLE_COLORS[3]} />,
  <FontAwesomeIcon icon={faGamepad} key="7" color={TABLE_COLORS[8]} />,
  <FontAwesomeIcon icon={faShuttleSpace} key="4" color={TABLE_COLORS[4]} />,
  <FontAwesomeIcon icon={faBuildingColumns} key="6" color={TABLE_COLORS[9]} />,
  <FontAwesomeIcon icon={faPaperPlane} key="5" color={TABLE_COLORS[5]} />,
  <FontAwesomeIcon icon={faExplosion} key="7" color={TABLE_COLORS[6]} />,
  <FontAwesomeIcon icon={faAtom} key="8" color={TABLE_COLORS[7]} />,
];
