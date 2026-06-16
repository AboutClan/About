import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";

export default function CafeMapLoginCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/cafe-map");
      return;
    }

    const role = session.user?.role;

    if (role === "newUser") {
      router.replace("/cafe-map/register/name");
    } else if (!role || role === "guest") {
      router.replace("/cafe-map");
    } else {
      router.replace("/cafe-map?tab=profile");
    }
  }, [session, status, router]);

  return <MainLoading />;
}
