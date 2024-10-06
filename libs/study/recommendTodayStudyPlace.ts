import { IParticipation } from "../../types/models/studyTypes/studyDetails";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";

export const recommendTodayStudyPlace = (
  studyVoteData: IParticipation[],
  myLocationDetail?: { lat: number; lon: number }, // Optional parameter
) => {
  if (!studyVoteData) return null;
  const sortedArr = [...studyVoteData].sort((a, b) => {
    const statusOrder = { open: 1, free: 2, dismissed: 3 };

    // Compare based on status first
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) {
      return statusDiff; // If the status is different, prioritize by status
    }

    // If location detail is available, sort by distance
    if (myLocationDetail) {
      const distance1 = getDistanceFromLatLonInKm(
        myLocationDetail.lat,
        myLocationDetail.lon,
        a.place.latitude,
        a.place.longitude,
      );
      const distance2 = getDistanceFromLatLonInKm(
        myLocationDetail.lat,
        myLocationDetail.lon,
        b.place.latitude,
        b.place.longitude,
      );
      return distance1 - distance2; // Sort by distance if status is the same
    }

    // If no location details, return 0 to keep the current order for same-status places
    return 0;
  });

  return sortedArr[0];
};
