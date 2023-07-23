import {
  faAtom,
  faChampagneGlasses,
  faCoffee,
  faExplosion,
  faPaperPlane,
  faPersonRunning,
  faShuttleSpace,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VOTE_TABLE_COLOR } from "../constants/system";

export const GATHER_CATEGORY = [
  { title: "취미", subtitle: "보드게임·방탈출·볼링" },
  { title: "맛집·카페", subtitle: "맛집투어·카페·디저트" },
  { title: "술 번개", subtitle: "only 저녁" },
  { title: "운동", subtitle: "러닝·산책·등산·클라이밍·헬스" },
  { title: "힐링", subtitle: "피크닉·캠핑·드라이브" },
  { title: "문화·예술", subtitle: "영화·전시·공연·연극·뮤지컬" },
  { title: "정기모임", subtitle: "정기모임" },
  { title: "기타", subtitle: "" },
];

export const GatherCategoryIcons = [
  <FontAwesomeIcon
    icon={faUserAstronaut}
    key="1"
    color={VOTE_TABLE_COLOR[0]}
  />,
  <FontAwesomeIcon icon={faCoffee} key="2" color={VOTE_TABLE_COLOR[1]} />,
  <FontAwesomeIcon
    icon={faChampagneGlasses}
    key="drink"
    color={VOTE_TABLE_COLOR[2]}
  />,
  <FontAwesomeIcon
    icon={faPersonRunning}
    key="3"
    color={VOTE_TABLE_COLOR[3]}
  />,
  <FontAwesomeIcon icon={faShuttleSpace} key="4" color={VOTE_TABLE_COLOR[4]} />,
  <FontAwesomeIcon icon={faPaperPlane} key="5" color={VOTE_TABLE_COLOR[5]} />,
  <FontAwesomeIcon icon={faExplosion} key="6" color={VOTE_TABLE_COLOR[6]} />,
  <FontAwesomeIcon icon={faAtom} key="7" color={VOTE_TABLE_COLOR[7]} />,
];
