export const getUserLocation = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    console.error("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    if (onError) onError(new Error("Geolocation not supported"));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("위치 정보:", position.coords);
      if (onSuccess) onSuccess(position);
    },
    (error) => {
      console.error("위치 가져오기 실패:", error);
      if (onError) onError(error);
    },
  );
};
