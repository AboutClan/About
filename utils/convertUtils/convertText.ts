export const convertMeetingTypeToKr = (text: "offline" | "online" | "hybrid") => {
  if (text === "offline") return "오프라인";
  else if (text === "online") return "온라인";
  else return "온/오프라인";
};
