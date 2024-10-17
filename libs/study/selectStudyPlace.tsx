export const selectStudyPlace = (
  selectId: string,
  mainPlace: string,
  subPlace: string[],
): { place: string; subPlace: string[] } => {

  if (!mainPlace) return { place: selectId, subPlace: [] };
  else {
    if (selectId === mainPlace) {
      return { place: null, subPlace };
    } else if (subPlace?.includes(selectId)) {
      return { place: mainPlace, subPlace: subPlace.filter((sub) => sub !== selectId) };
    } else {
      return { place: mainPlace, subPlace: [...subPlace, selectId] };
    }
  }
};
