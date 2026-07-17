import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import { GATHER_CONTENT, GROUP_STUDY, STUDY_VOTE } from "../../constants/keys/queryKeys";
import { transferGatherDataState } from "../../recoils/transferRecoils";

export const useToken = () => {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | undefined>();
  // 세션의 uid가 바뀌면(예: 게스트 → 카카오 실계정 전환) 캐시된 토큰을 반드시 재발급받아야 함
  // 그렇지 않으면 axios 기본 헤더에 과거 게스트 토큰이 그대로 남아 백엔드가 계정을 오인함
  const uidRef = useRef<string | undefined>(undefined);

  const fetchToken = async () => {
    try {
      const response = await axios.get("/api/token");
      setToken(response.data);
    } catch (error) {
      console.error("Failed to fetch token:", error);
      setToken(undefined);
    }
  };

  useEffect(() => {
    if (status !== "authenticated") return;

    const currentUid = (session?.user as { uid?: string } | undefined)?.uid;
    if (currentUid === uidRef.current && token) return;

    uidRef.current = currentUid;
    fetchToken();
  }, [status, session, token]);

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
