/* eslint-disable */

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider, { KakaoProfile } from "next-auth/providers/kakao";

import jwt from "jsonwebtoken";
import dbConnect from "../../../libs/backend/dbConnect";
import clientPromise from "../../../libs/backend/mongodb";
import { refreshAccessToken } from "../../../libs/backend/oauthUtils";
import { Account } from "../../../models/account";
import { User } from "../../../models/user";
import { ActiveLocation } from "../../../types/services/locationTypes";

const secret = process.env.NEXTAUTH_SECRET;

const DEFAULT_PROFILE_IMAGE =
  "http://img1.kakaocdn.net/thumb/R110x110.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg";

const GUEST_USER = {
  id: "66f29811e0f0564ae35c52a4",
  uid: "1234567890",
  name: "guest",
  role: "guest",
  isActive: false,
  profileImage: "",
  location: "수원" as ActiveLocation,
};

const MEMBER_GUEST_USER = {
  ...GUEST_USER,
  name: "게스트",
  role: "member",
  isActive: true,
  profileImage: DEFAULT_PROFILE_IMAGE,
};

export const generateClientSecret = () => {
  const privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n"); // 환경변수에서 가져오기
  const payload = {
    iss: process.env.APPLE_TEAM_ID, // Apple Team ID
    iat: Math.floor(Date.now() / 1000), // 현재 시간
    exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 유효
    aud: "https://appleid.apple.com",
    sub: process.env.APPLE_ID, // Service ID
  };
  const header = {
    alg: "ES256",
    kid: process.env.APPLE_KEY_ID, // Key ID
  };

  return jwt.sign(payload, privateKey, { algorithm: "ES256", header });
};

export const authOptions: NextAuthOptions = {
  secret,
  debug: true,
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  providers: [
    CredentialsProvider({
      id: "guest",
      name: "guest",
      credentials: {},
      async authorize() {
        return GUEST_USER;
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return { ...MEMBER_GUEST_USER, email: credentials.username };
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      profile: (profile: KakaoProfile) => {
        const profileData = {
          ...profile,
          role: "newUser",
          profileImage: profile.properties.thumbnail_image || profile.properties.profile_image,
          uid: profile.id.toString(),
          id: profile.id.toString(),
          isActive: false,
        };
        console.log("p", profileData);
        return profileData;
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID as string, // Service ID
      clientSecret: generateClientSecret(), // JWT 생성 함수
      profile: (profile) => ({
        id: profile.sub, // Apple User ID
        uid: profile.sub, // 동일 ID로 저장
        name: profile.email, // 이메일 주소
        email: profile.email, // 이메일 주소
        role: "newUser",
        isActive: false,
        profileImage: DEFAULT_PROFILE_IMAGE,
      }),
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 720 * 60 * 60, // 720시간 = 30일
    updateAge: 72 * 60 * 60, // 72시간 = 3일
  },
  pages: {
    signIn: "/home",
    error: "/login",
    newUser: "/register/name",
  },

  callbacks: {
    async signIn({ account, user }) {
      try {
        console.log(55555, account, user);
        if (["guest", "credentials"].includes(account.provider)) {
          return true;
        }
        if (["kakao", "apple"].includes(account.provider)) {
          await dbConnect();
        }

        if (account.provider === "kakao" || account.provider === "apple") {
          const findUser = await User.findOneAndUpdate(
            { uid: user.uid },
            { $set: { profileImage: user.profileImage || DEFAULT_PROFILE_IMAGE } },
          );

          if (findUser) {
            user.role = findUser.role;
            account.role = findUser.role;

            const existingAccount = await Account.findOne({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            });

            if (!existingAccount) {
              await Account.findOneAndUpdate(
                {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
                {
                  $setOnInsert: {
                    userId: findUser._id, // 꼭 user._id를 연결해야 함
                    provider: account.provider, // 필수 필드
                    providerAccountId: account.providerAccountId,
                    type: "oauth", // 필수 필드
                  },
                  $set: {
                    access_token: account.access_token,
                    refresh_token: account.refresh_token,
                    expires_at: account.expires_at,
                  },
                },
                { upsert: true, new: true },
              );
            }
          }

          return user.role === "waiting" ? "/login?status=waiting" : true;
        }
        return true;
      } catch (error) {
        console.error("signIn 콜백 에러:", error);
        return false;
      }
    },

    async session({ session, token, user, trigger }) {
      console.log(session, token, user);
      if (trigger === "update") return session;
      if (session.user.name === "게스트") session.user = MEMBER_GUEST_USER;
      else if (session.user.name === "guest") session.user = GUEST_USER;
      else {
        session.user = {
          id: token.id,
          uid: token.uid,
          name: token.name,
          role: token.role,
          isActive: token.isActive,
          profileImage: token.profileImage,
          location: "수원",
        };
      }

      return session;
    },

    async jwt({ token, account, user, trigger }) {
      try {
        if (trigger === "update") {
          token.role = "waiting";
          return token;
        }

        switch (account?.provider) {
          case "guest":
            return { ...token, ...GUEST_USER };
          case "credentials":
            return { ...token, ...MEMBER_GUEST_USER };
          case "kakao":
          case "apple":
            {
              await Account.findOneAndUpdate(
                { providerAccountId: account.providerAccountId },
                {
                  $set: {
                    access_token: account.access_token,
                    refresh_token: account.refresh_token ?? token.refresh_token,
                    expires_at: account.expires_at,
                    refresh_token_expires_in: account.refresh_token_expires_in,
                  },
                },
                { upsert: true },
              );
            }
            return {
              accessToken: account.access_token || "",
              refreshToken: account.refresh_token || token.refresh_token || "",
              accessTokenExpires: (account.expires_at ?? Math.floor(Date.now() / 1000)) * 1000,
              id: user.id,
              uid: user.uid,
              name: user.name,
              profileImage: user.profileImage || "",
              role: user.role || "newUser",
              isActive: user.isActive || false,
            };
        }
        try {
          return token.accessTokenExpires && Date.now() < token.accessTokenExpires
            ? token
            : await refreshAccessToken(token, account?.provider);
        } catch (e) {
          return { ...token, error: "RefreshAccessTokenError" };
        }
      } catch (error) {
        console.error("JWT 콜백 에러:", error);
        return token;
      }
    },
  },
};

export default NextAuth(authOptions);
