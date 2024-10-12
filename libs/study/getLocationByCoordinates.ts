import { LOCATION_MAX_BOUNDARY } from "../../constants/serviceConstants/studyConstants/studyVoteMapConstants";

export function getLocationByCoordinates(lat: number, lon: number): string | null {
  for (const [location, boundary] of Object.entries(LOCATION_MAX_BOUNDARY)) {
    const { southwest, northeast } = boundary;

    const isWithinLatitude = lat <= southwest.latitude && lat >= northeast.latitude;
    const isWithinLongitude = lon >= southwest.longitude && lon <= northeast.longitude;

    if (isWithinLatitude && isWithinLongitude) {
      return location;
    }
  }
  return null;
}
