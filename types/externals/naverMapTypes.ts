/* eslint-disable */

import { IPlace } from "../models/studyTypes/studyDetails";

export interface IMapOptions {
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
  id?: IPlace;
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
}
