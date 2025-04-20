import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { KAKAO_SEARCH } from "../../constants/keys/queryKeys";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { QueryOptions } from "../../types/hooks/reactTypes";

const API_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";
const API_LOCATION_URL = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";
const API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

export const useKakaoSearchQuery = (value: string, options?: QueryOptions<KakaoLocationProps[]>) =>
  useQuery<KakaoLocationProps[], AxiosError, KakaoLocationProps[]>(
    [KAKAO_SEARCH, value],
    async () => {
      const res = await axios.get<{ documents: KakaoLocationProps[] }>(`${API_URL}`, {
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
          console.log(25, res.data);
          const region = res.data.documents.find((doc) => doc.region_type === "B"); // 법정동 기준
          const addText = isFull ? " " + region?.region_3depth_name : "";
          console.log(5555, region?.region_2depth_name + addText);
          return {
            id,
            branch: region?.region_2depth_name + addText || "알 수 없음",
          };
        }),
      );
      console.log(12, results);
      return results;
    },
    options,
  );
