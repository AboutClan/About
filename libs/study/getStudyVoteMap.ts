export const getVoteLocationCenterDot = () => ({
  수원: new naver.maps.LatLng(37.278992, 127.025727),
  안양: new naver.maps.LatLng(37.388896, 126.950088),
  양천: new naver.maps.LatLng(37.527588, 126.896441),
  강남: new naver.maps.LatLng(37.503744, 127.048898),
  동대문: new naver.maps.LatLng(37.58452, 127.041047),
  인천: new naver.maps.LatLng(37.428334, 126.680935),
});

export const getVoteLocationMaxBound = () => ({
  수원: new naver.maps.LatLngBounds(
    new naver.maps.LatLng(37.22711, 126.955637),
    new naver.maps.LatLng(37.357058, 127.142965),
  ),
  안양: new naver.maps.LatLngBounds(
    new naver.maps.LatLng(37.451075, 126.888074),
    new naver.maps.LatLng(37.357058, 127.142965),
  ),
  양천: new naver.maps.LatLngBounds(
    new naver.maps.LatLng(37.553289, 126.819398),
    new naver.maps.LatLng(37.482753, 126.941598),
  ),
  강남: new naver.maps.LatLngBounds(
    new naver.maps.LatLng(37.532565, 126.991213),
    new naver.maps.LatLng(37.468873, 127.107285),
  ),
  동대문: new naver.maps.LatLngBounds(
    new naver.maps.LatLng(37.557579, 126.989614),
    new naver.maps.LatLng(37.648954, 127.106856),
  ),
  인천: new naver.maps.LatLngBounds(
    new naver.maps.LatLng(37.584965, 126.580845),
    new naver.maps.LatLng(37.341746, 126.803871),
  ),
});
