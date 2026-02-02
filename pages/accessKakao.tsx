import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useToast } from "../hooks/custom/CustomToast";
import { navigateExternalLink } from "../utils/navigateUtils";

function AccessKakao() {
  const { data: session } = useSession();

  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    if (session === undefined) return;
    if (!session?.user.uid) {
      toast("error", "어바웃 멤버만 입장이 가능합니다. 확인을 위해 다시 로그인해주세요!");
      router.push("/login?status=kakao");
    } else {
      const url = "https://invite.kakao.com/tc/HOmUdQMjSs";
      navigateExternalLink(url);
      router.push("/home");
    }
  }, [session]);

  return <></>;
}

export default AccessKakao;
