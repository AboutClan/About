import { DefaultSession } from "next-auth";

import { Location } from "./services/locationTypes";
declare module "next-auth/jwt" {
  // JWT 토큰의 타입을 확장합니다.
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    id?: string;
    uid?: string;
    name?: string;
    profileImage?: string;
    role?: UserRole;
    isActive?: boolean;
    location?: Location;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface Profile {
    properties: {
      nickname: string;
      thumbnail_image: string;
      profile_image: string;
    };
  }

  interface User {
    role: Role;
    isActive: boolean;
    uid: string;
    profileImage: string;
    location?: Location;
  }
  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
  interface Account {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    location: Location;
  }
  /** The OAuth profile returned from your provider */
  interface Profile {
    sub: string; // Apple User ID
    email: string; // Apple User Email
  }

  interface Session {
    token: JWT;
    user: {
      id: string;
      uid: string;
      name: string;
      role: UserRole;
      isActive: boolean;
      profileImage: string;
      location: Location;

      /** The user's postal address. */
    } & DefaultSession["user"];
  }
}
