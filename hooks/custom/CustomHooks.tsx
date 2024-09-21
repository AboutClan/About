import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import { STUDY_VOTE } from "../../constants/keys/queryKeys";
import { myStudyState, studyPairArrState } from "../../recoils/studyRecoils";

export const useToken = () => {
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/token");
      setToken(response.data);
    };

    fetchData();
  }, []);

  return token;
};

export const useResetQueryData = () => {
  const queryClient = useQueryClient();

  const refetchWithDelay = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (key: any | any[], func?: () => void) => {
      queryClient.invalidateQueries(key);

      if (func) func();
    },
    [queryClient],
  );

  return refetchWithDelay;
};
export const useResetStudyQuery = () => {
  const queryClient = useQueryClient();
  const setStudyPairArr = useSetRecoilState(studyPairArrState);
  const setMyStudy = useSetRecoilState(myStudyState);

  const refetchWithDelay = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => {
      queryClient.invalidateQueries({ queryKey: [STUDY_VOTE], exact: false });
      setStudyPairArr(null);
      setMyStudy(null);
    },
    [queryClient],
  );

  return refetchWithDelay;
};
