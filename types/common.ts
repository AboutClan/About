export interface TimeRangeProps {
  start: string;
  end: string;
}

export interface LocationProps {
  latitude: number;
  longitude: number;
  address: string;
  name?: string;
  _id?: string;
}

export interface CoordinatesProps {
  lat: number;
  lon: number;
}

export interface VotePlacesProps {
  main: string;
  sub: string[];
}

export interface PointValueProps {
  value: number;
}
