import { signIn } from "next-auth/react";
import { useEffect, useRef } from "react";

function Confirm() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    signIn("kakao", {
      callbackUrl: `/register/auth`,
    });
  }, []);
  return null;
}

export default Confirm;
