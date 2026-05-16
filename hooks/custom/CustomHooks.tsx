import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import { GATHER_CONTENT, GROUP_STUDY, STUDY_VOTE } from "../../constants/keys/queryKeys";
import { transferGatherDataState } from "../../recoils/transferRecoils";

export const useToken = () => {
  const { status } = useSession();
  const [token, setToken] = useState<string | undefined>();

  const fetchToken = async () => {
    try {
      const response = await axios.get("/api/token");
      setToken(response.data ?? undefined);
    } catch (error) {
      console.error("Failed to fetch token:", error);
      setToken(undefined);
    }
  };

  // status 변화마다 토큰 상태를 동기화.
  // signOut → "unauthenticated": 토큰 즉시 제거 (이전 유저 JWT가 axios 헤더에 잔존하는 것 방지).
  // signIn  → "authenticated" : 새 세션의 JWT를 재발급받아 axios 헤더에 반영.
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setToken(undefined);
      return;
    }
    fetchToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return token;
};
export const useResetQueryData = () => {
  const queryClient = useQueryClient();

  const refetchWithDelay = useCallback(
    (key: string[], func?: () => void) => {
      queryClient.refetchQueries({ queryKey: key, exact: false });
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

  const refetchWithDelay = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => {
      queryClient.invalidateQueries({ queryKey: [GROUP_STUDY], exact: false });
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
      queryClient.resetQueries({ queryKey: [GATHER_CONTENT], exact: false });
      setTransferGatherData(null);
    },
    [queryClient],
  );

  return refetchWithDelay;
};

export const useWindowWidth = () => {
  const [width, setWidth] = useState<number>(() => {
    // SSR 안전: 서버에서는 window 없음
    if (typeof window === "undefined") return 428; // 기본값(원하는 값으로 조정 가능)
    return window.innerWidth;
  });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // 마운트 시 1번 동기화(초기값이 428로 들어갔을 수도 있으니)
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width < 428 ? width : 428;
};
