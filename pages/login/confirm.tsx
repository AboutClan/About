import { signIn, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

import { setAuthIntent } from "../../utils/authIntentUtils";

function Confirm() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const process = async () => {
      setAuthIntent();

      await signOut({ redirect: false });

      await signIn("kakao", {
        callbackUrl: `/register/auth`,
      });
    };

    process();
  }, []);
  return null;
}

export default Confirm;
