import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ShareParticipationsGroup() {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) return;
    const openUrl = `https://about20s.club/_open?dl=group/${id}`;
    window.location.replace(openUrl);
  }, [id]);

  return <></>;
}
