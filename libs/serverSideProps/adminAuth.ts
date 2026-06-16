import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../../pages/api/auth/[...nextauth]";

const ADMIN_ROLES = ["previliged", "manager"];

export async function checkAdminAuth(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Record<string, never>>> {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !ADMIN_ROLES.includes(session.user.role)) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
