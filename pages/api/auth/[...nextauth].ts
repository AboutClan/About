/* eslint-disable */

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import { encode, JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";

import dbConnect from "../../../libs/backend/dbConnect";
import clientPromise from "../../../libs/backend/mongodb";
import { refreshAccessToken } from "../../../libs/backend/oauthUtils";
import { Account } from "../../../models/account";
import { User } from "../../../models/user";
import { ActiveLocation } from "../../../types/services/locationTypes";

const secret = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  secret,
  providers: [
    //직접적으로 사용자 정보를 인증하는 경우
    CredentialsProvider({
      id: "guest",
      name: "guest",
      //추가적인 입력 필드
      credentials: {},

      async authorize(credentials, req) {
        //자격 증명 로직 추가 가능
        const profile = {
          id: "0",
          uid: "0",
          name: "guest",
          role: "guest",
          profileImage: "",
          isActive: true,
        };
        //반환되는 값은 jwt의 user에 저장된다
        if (profile) return profile;
        //오류를 사용자에게 보여주고 싶으면 추가로 작성
        return null;
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      profile: (profile) => ({
        id: profile.id.toString(),
        uid: profile.id.toString(),
        name: profile.properties.nickname,
        role: "newUser",
        profileImage: profile.properties.thumbnail_image || profile.properties.profile_image,
        isActive: false,
        email: profile.id.toString(),
      }),
    }),
  ],
  //DB랑 연결하고 유저 정보를 조회한다. 기본적으로 accounts와 users에서.
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    //자동 로그아웃
    maxAge: 30 * 24 * 60 * 60, // 30 days
    //세션 정보 업데이트
    updateAge: 3 * 24 * 60 * 60, // 3 days
  },
  pages: {
    signIn: "/home",
    // signOut: "/login",
    error: "/login",
    // verifyRequest: "/2",
    newUser: "/register/location",
  },

  callbacks: {
    async signIn({ account, user, profile, credentials }) {
      if (account.provider === "guest") return true;

      if (!account.access_token) return false;

      // if (user.role === "newUser") return false;

      if (user) {
        account.role = user.role;
      }

      const profileImage = profile.properties.thumbnail_image || profile.properties.profile_image;
      const endcodedToken = await encode({ token: account, secret });
      await dbConnect();
      await User.updateOne(
        { uid: user.uid },
        {
          $set: {
            profileImage,
          },
        },
      );

      return true;
    },
    //session과 token모두 초기값인데, 이전 과정에서 겹치는 부분들은 업데이트가 되어있음
    async session({ session, token, user, trigger }) {
      if (trigger === "update") {
        return session;
      }

      if (session.user.name === "guest") {
        session.user.id = "0";
        session.user.uid = "0";
        session.user.name = "guest";
        session.user.role = "guest";
        session.user.location = "수원";
        session.user.isActive = false;
      } else {
        session.user.id = token.id.toString();
        session.user.uid = token.uid.toString();
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
        session.user.location = token.location;
        session.user.profileImage = token.profileImage;
      }
      return session;
    },

    async jwt({ token, account, user, trigger, session }) {
      if (trigger === "update" && token?.role) {
        token.role = "waiting";
        return token;
      }

      if (account && account.provider === "guest") {
        return token;
      }

      if (account && user) {
        await Account.updateOne(
          { providerAccountId: account.providerAccountId },
          {
            $set: {
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              refresh_token_expires_in: account.refresh_token_expires_in,
            },
          },
        );
        const newToken: JWT = {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: Date.now() + (account?.expires_at || 0) * 1000,
          id: user.id.toString(),
          uid: user.uid,
          name: user.name,
          profileImage: user.profileImage,
          role: user.role,
          isActive: user.isActive,
          location: user.location as unknown as ActiveLocation,
        };
        return newToken;
      }

      if (token.accessTokenExpires) {
        if (Date.now() < (token.accessTokenExpires as number) * 1000) {
          return token;
        }
        return refreshAccessToken(token);
      } else {
        return token;
      }
    },
  },
};
export default NextAuth(authOptions);
