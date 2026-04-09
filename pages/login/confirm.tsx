import { signIn, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

function Confirm() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const process = async () => {
      // 기존 세션 제거 (guest 포함)
      await signOut({ redirect: false });

      // 카카오 로그인 시작
      await signIn("kakao", {
        callbackUrl: `/register/auth`,
      });
    };

    process();
  }, []);
  return null;
}

export default Confirm;
