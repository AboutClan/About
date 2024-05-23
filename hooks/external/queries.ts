import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { KAKAO_SEARCH } from "../../constants/keys/queryKeys";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { QueryOptions } from "../../types/hooks/reactTypes";

const API_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";
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
