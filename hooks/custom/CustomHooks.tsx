import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import { GATHER_CONTENT, GROUP_STUDY, STUDY_VOTE, USER_INFO } from "../../constants/keys/queryKeys";
import { transferGatherDataState, transferGroupDataState } from "../../recoils/transferRecoils";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
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

  const refetchWithDelay = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => {
      queryClient.invalidateQueries({ queryKey: [STUDY_VOTE], exact: false });
    },
    [queryClient],
  );

  return refetchWithDelay;
};
export const useResetGroupQuery = () => {
  const queryClient = useQueryClient();

  const setTransferGroupData = useSetRecoilState(transferGroupDataState);

  const refetchWithDelay = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => {
      queryClient.invalidateQueries({ queryKey: [GROUP_STUDY], exact: false });
      setTransferGroupData(null);
    },
    [queryClient],
  );

  return refetchWithDelay;
};
export const useResetGatherQuery = () => {
  const queryClient = useQueryClient();
  const setTransferGatherData = useSetRecoilState(transferGatherDataState);

  const refetchWithDelay = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => {
      queryClient.invalidateQueries({ queryKey: [GATHER_CONTENT], exact: false });
      setTransferGatherData(null);
    },
    [queryClient],
  );

  return refetchWithDelay;
};
export const useTogglePlaceHeart = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // const { mutate: patchStudyPreference, isLoading } = useStudyPreferenceMutation("patch", {
  //   onSuccess() {
  //     toast("success", "변경되었습니다.");
  //     queryClient.refetchQueries([USER_INFO]);
  //   },
  // });

  const togglePlaceHeart = useCallback(
    (e, preference: IStudyVotePlaces, id: string, userLoading) => {
      // if (isLoading || userLoading) return;
      e.preventDefault();
      const preferMain = preference?.place;
      const preferenceType =
        preference?.place === id
          ? "main"
          : preference?.subPlace?.includes(id)
          ? "sub"
          : preferMain
          ? "sub"
          : "main";
      // patchStudyPreference({ id, type: preferenceType });
      queryClient.invalidateQueries([USER_INFO]);
    },
    [queryClient],
  );

  return togglePlaceHeart;
};

export const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize); // resize 이벤트 추가
    return () => window.removeEventListener("resize", handleResize); // 이벤트 정리
  }, []);

  return width < 428 ? width : 428;
};
