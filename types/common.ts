export interface PointInfoProps {
  point: number;
  message: string;
}

export interface TimeRangeProps {
  start: string;
  end: string;
}

export interface LocationProps {
  name?: string;
  latitude: number;
  longitude: number;
  address: string;
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
