
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
  <i className="fa-solid fa-user-astronaut" key="1" style={{color:`${TABLE_COLORS[0]}`}} />,
  <i className="fa-solid fa-coffee" key="2" style={{color:`${TABLE_COLORS[1]}`}} />,
  <i className="fa-solid fa-champagne-glasses" key="drink" style={{color:`${TABLE_COLORS[2]}`}} />,
  <i className="fa-solid fa-person-running" key="3" style={{color:`${TABLE_COLORS[3]}`}} />,
  <i className="fa-solid fa-gamepad" key="7" style={{color:`${TABLE_COLORS[8]}`}} />,
  <i className="fa-solid fa-shuttle-space" key="4" style={{color:`${TABLE_COLORS[4]}`}} />,
  <i className="fa-solid fa-building-columns" key="6" style={{color:`${TABLE_COLORS[9]}`}} />,
  <i className="fa-solid fa-paper-plane" key="5" style={{color:`${TABLE_COLORS[5]}`}} />,
  <i className="fa-solid fa-explosion" key="7" style={{color:`${TABLE_COLORS[6]}`}} />,
  <i className="fa-solid fa-atom" key="8" style={{color:`${TABLE_COLORS[7]}`}} />,
];
