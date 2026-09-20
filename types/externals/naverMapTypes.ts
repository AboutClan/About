/* eslint-disable */

export interface IMapOptions {
  /** GL(벡터) 렌더링. customStyleId 를 쓰려면 반드시 true + 스크립트에 submodules=gl */
  gl?: boolean;
  /** 네이버 Style Editor 에서 발행한 커스텀 스타일 Metadata ID */
  customStyleId?: string;
  background?: string;
  baseTileOpacity?: number;
  bounds?: any;
  center?: any;
  zoom?: number;
  disableDoubleClickZoom?: boolean;
  disableDoubleTapZoom?: boolean;
  disableKineticPan?: boolean;
  disableTwoFingerTapZoom?: boolean;
  draggable?: boolean;
  keyboardShortcuts?: boolean;
  logoControl?: boolean;
  logoControlOptions?: any;
  mapDataControl?: boolean;
  mapDataControlOptions?: any;
  mapTypeControl?: boolean;
  mapTypeControlOptions?: any;
  mapTypeId?: "normal";

  mapTypes?: any;
  maxBounds?: any;
  maxZoom?: number;
  minZoom?: number;
  padding?: any;
  pinchZoom?: boolean;
  resizeOrigin?: any;
  scaleControl?: boolean;
  scaleControlOptions?: any;
  scrollWheel?: boolean;
  size?: any;
  overlayZoomEffect?: null | string;
  tileSpare?: number;
  tileTransition?: boolean;
  tileDuration?: number;
  zoomControl?: boolean;
  zoomControlOptions?: any;
  zoomOrigin?: any;
  blankTileImage?: null | string;
}

export interface IMarkerOptions {
  isPicked?: boolean;
  id?: string;
  ids?: string[];
  type?: "vote";
  animation?: any;
  map?: any;
  position: any;
  icon?: any;
  shape?: any;
  title?: string;
  cursor?: string;
  clickable?: boolean;
  draggable?: boolean;
  visible?: boolean;
  zIndex?: number;
  infoWindow?: any;
  polyline?: any;
  selectedIcon?: naver.maps.ImageIcon | naver.maps.HtmlIcon;
}
