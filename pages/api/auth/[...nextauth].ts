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
  id: "69c4f9ce862f5d10130252ab",
  uid: "1234567890",
  name: "guest",
  role: "guest",
  isActive: false,
  profileImage: "",
  location: "수원" as ActiveLocation,
};
const TEST_USER = {
  id: "6938e715ec55cba47b90954d",
  uid: "1234567898",
  name: "테스트",
  role: "member",
  isActive: true,
  profileImage: DEFAULT_PROFILE_IMAGE,
  location: "수원" as ActiveLocation,
};

const MEMBER_GUEST_USER = {
  ...GUEST_USER,
  name: "게스트",
  role: "guest",
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
        sameSite: "lax",
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
        return { ...TEST_USER, email: credentials.username };
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile: (profile: KakaoProfile) => {
        const profileData = {
          ...profile,
          name:
            profile.kakao_account?.name || profile.properties?.nickname || profile.id.toString(),
          role: "newUser",
          profileImage:
            profile.properties?.thumbnail_image ||
            profile.properties?.profile_image ||
            DEFAULT_PROFILE_IMAGE,
          uid: profile.id.toString(),
          id: profile.id.toString(),
          isActive: false,
        };

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
    newUser: "/register/auth",
  },

  callbacks: {
    async signIn({ account, user, profile }) {
      const kakaoProfile = profile as KakaoProfile;

      try {
        if (["guest", "credentials"].includes(account.provider)) {
          return true;
        }
        if (["kakao", "apple"].includes(account.provider)) {
          await dbConnect();
        }

        const profileIdStr = kakaoProfile?.id != null ? String(kakaoProfile.id) : null;
        const userUid = (user as any)?.uid;

        if (userUid === "1234567890" || profileIdStr === "1234567890") {
          return false;
        }

        if (account.provider === "kakao" || account.provider === "apple") {
          const findUser = await User.findOneAndUpdate(
            { uid: profileIdStr || userUid },
            {
              $set: {
                profileImage:
                  kakaoProfile?.properties?.thumbnail_image ||
                  (user as any)?.profileImage ||
                  DEFAULT_PROFILE_IMAGE,
              },
            },
          );

          if (findUser) {
            (user as any).role = findUser.role;
            user.name = findUser.name ?? user.name;
            (user as any).uid = findUser.uid ?? userUid;
            user.id = findUser.id ?? user.id;

            const existingAccount = await Account.findOne({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            });

            if (existingAccount) {
              const GUEST_OID = "69c4f9ce862f5d10130252ab";
              if (String(existingAccount.userId) === GUEST_OID) {
                await Account.updateOne(
                  { _id: existingAccount._id },
                  { $set: { userId: findUser._id } },
                );
              }
            } else {
              await Account.findOneAndUpdate(
                {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
                {
                  $setOnInsert: {
                    userId: findUser._id,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    type: "oauth",
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

          return true;
        }

        return true;
      } catch (error) {
        console.error("signIn 콜백 에러:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("https://xn--ob0b42knwutje.com")) {
        return url;
      }

      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      return baseUrl;
    },
    async session({ session, token, user, trigger }) {
      if (trigger === "update") return session;
      // uid "1234567890"은 guest/credentials 전용 하드코딩 UID — 실제 OAuth 유저는 절대 이 값을 가지지 않음
      // name 기반 판별을 제거해 실제 유저 name이 "게스트"일 때 MEMBER_GUEST_USER로 오인하는 문제 방지
      if (token.uid === "1234567890") {
        session.user = token.isActive ? MEMBER_GUEST_USER : GUEST_USER;
      } else {
        session.user = {
          id: token.id,
          uid: token.uid,
          name: token.name ?? "",
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

        // TEMP DEBUG: kakao-debug → kakao로 오버라이드
        if (account?.provider === "kakao-debug") {
          (account as any).provider = "kakao";
          (account as any).access_token = (account as any).access_token || "";
          (account as any).refresh_token = (account as any).refresh_token || "";
          (account as any).expires_at = (account as any).expires_at || 0;
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
                {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
                {
                  // 신규 insert 시에만 userId 설정 — 기존 account의 userId를 덮어쓰지 않음
                  ...(user?.id ? { $setOnInsert: { userId: user.id } } : {}),
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
              id: user.id ?? token.id,
              uid: user.uid ?? token.uid,
              name: user.name ?? token.name ?? "",
              profileImage: user.profileImage ?? token.profileImage ?? "",
              role: user.role ?? token.role ?? "newUser",
              isActive: user.isActive ?? token.isActive ?? false,
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
