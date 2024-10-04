import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import { STUDY_VOTE, USER_INFO } from "../../constants/keys/queryKeys";
import { myStudyInfoState, studyPairArrState } from "../../recoils/studyRecoils";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { useStudyPreferenceMutation } from "../study/mutations";
import { useToast } from "./CustomToast";

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
  const setMyStudy = useSetRecoilState(myStudyInfoState);

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
export const useTogglePlaceHeart = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutate: patchStudyPreference, isLoading } = useStudyPreferenceMutation("patch", {
    onSuccess() {
      toast("success", "변경되었습니다.");
      queryClient.refetchQueries([USER_INFO]);
    },
  });

  const togglePlaceHeart = useCallback(
    (preference: IStudyVotePlaces, id: string, userLoading) => {
      if (isLoading || userLoading) return;
      console.log(23, id);
      return;
      const preferMain = preference?.place;
      const preferenceType =
        preference?.place === id
          ? "main"
          : preference?.subPlace?.includes(id)
            ? "sub"
            : preferMain
              ? "sub"
              : "main";
      patchStudyPreference({ id, type: preferenceType });
      queryClient.invalidateQueries([USER_INFO]);
    },
    [queryClient],
  );

  return togglePlaceHeart;
};
