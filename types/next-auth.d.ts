import "next-auth";

import { DefaultSession } from "next-auth";
import { ActiveLocation } from "./serviceTypes/locationTypes";
import { Location } from "./system";
import { Role } from "./user/user";
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
    role?: Role;
    isActive?: boolean;
    location?: ActiveLocation;
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
  }
  /** The OAuth profile returned from your provider */
  interface Profile {}

  interface Session {
    user: {
      id: string;
      uid: string;
      name: string;
      role: string;
      isActive: boolean;
      profileImage: string;
      location: ActiveLocation;
      /** The user's postal address. */
    } & DefaultSession["user"];
  }
}
