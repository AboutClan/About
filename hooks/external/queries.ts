import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { KAKAO_SEARCH } from "../../constants/keys/queryKeys";
import { LocationProps } from "../../types/common";
import { QueryOptions } from "../../types/hooks/reactTypes";

const API_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";
const API_LOCATION_URL = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";
const API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

export interface NaverLocationProps extends LocationProps {
  title?: string;
  link?: string;
  category?: string;
  description?: string;
  telephone?: string;

  roadAddress?: string;
  mapx?: string;
  mapy?: string;
}

export interface NaverLocalResponse {
  items: NaverLocationProps[];
}

export const useNaverLocalQuery = (value: string, options?: QueryOptions<NaverLocationProps[]>) =>
  useQuery<NaverLocationProps[], AxiosError, NaverLocationProps[]>(
    ["NAVER_LOCAL", value],
    async () => {
      if (!value.trim()) return [];
      const res = await axios.get<NaverLocalResponse>("/api/naver-local", {
        params: { q: value },
      });
      return (
        res.data?.items.map((item) => ({ ...item, title: item.title.replace(/<[^>]+>/g, "") })) ??
        []
      );
    },
    options,
  );

export const NAVER_GEOCODE = "NAVER_GEOCODE";

// export const useNaverGeocodeQuery = (value: string, options?: QueryOptions<NaverGeocodeResult[]>) =>
//   useQuery<NaverGeocodeResult[], AxiosError>(
//     [NAVER_GEOCODE, value],
//     async () => {
//       if (!value) return [];

//       const res = await axios.get<NaverGeocodeResponse>(`/api/geocode`, {
//         params: { query: value },
//       });
//       return res.data || [];
//     },
//     {
//       enabled: !!value, // value가 있을 때만 실행
//       ...options,
//     },
//   );

export const useKakaoSearchQuery = (value: string, options?: QueryOptions<NaverLocationProps[]>) =>
  useQuery<NaverLocationProps[], AxiosError, NaverLocationProps[]>(
    [KAKAO_SEARCH, value],
    async () => {
      const res = await axios.get<{ documents: NaverLocationProps[] }>(`${API_URL}`, {
        headers: { Authorization: `KakaoAK ${API_KEY}` },
        params: { query: value },
      });
      return res.data?.documents;
    },
    options,
  );

export const useKakaoMultipleLocationQuery = (
  coords: { lat: number; lon: number; id: string }[],
  isFull: boolean,
  options?: QueryOptions<{ id: string; branch: string }[]>,
) =>
  useQuery<{ id: string; branch: string }[], AxiosError>(
    ["KAKAO_MULTI_SEARCH", coords, isFull],
    async () => {
      const results = await Promise.all(
        coords.map(async ({ lat, lon, id }) => {
          const res = await axios.get<{
            documents: {
              region_type: string;
              region_2depth_name: string;
              region_3depth_name: string;
            }[];
          }>(API_LOCATION_URL, {
            headers: { Authorization: `KakaoAK ${API_KEY}` },
            params: {
              x: lon,
              y: lat,
            },
          });

          const region = res.data.documents.find((doc) => doc.region_type === "B"); // 법정동 기준
          const addText = isFull ? " " + region?.region_3depth_name : "";

          return {
            id,
            branch: region?.region_2depth_name + addText || "알 수 없음",
          };
        }),
      );

      return results;
    },
    options,
  );
