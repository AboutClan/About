/* eslint-disable */

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";

import jwt from "jsonwebtoken";
import dbConnect from "../../../libs/backend/dbConnect";
import clientPromise from "../../../libs/backend/mongodb";
import { refreshAccessToken } from "../../../libs/backend/oauthUtils";
import { Account } from "../../../models/account";
import { User } from "../../../models/user";

const secret = process.env.NEXTAUTH_SECRET;

// if (!secret) {
//   throw new Error("NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.");
// }

const generateClientSecret = (): string => {
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
      async authorize(credentials, req) {
        const profile = {
          id: "66f29811e0f0564ae35c52a4",
          uid: "1234567890",
          name: "guest",
          role: "guest",
          profileImage:
            "http://img1.kakaocdn.net/thumb/R110x110.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg",
          isActive: true,
        };

        if (profile) return profile;
        return null;
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const profile = {
          id: "66f29811e0f0564ae35c52a4",
          uid: "1234567890",
          name: "게스트",
          role: "member",
          profileImage:
            "http://img1.kakaocdn.net/thumb/R110x110.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg",
          isActive: true,
          email: credentials.username, // 예시로 email 추가
        };

        return profile;
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      profile: (profile) => {
        return {
          id: profile.id.toString(),
          uid: profile.id.toString(),
          name: profile.properties.nickname,
          role: "newUser",
          profileImage: profile.properties.thumbnail_image || profile.properties.profile_image,
          isActive: false,
          email: profile.id.toString(),
        };
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID as string, // Service ID
      // clientSecret: generateClientSecret(), // JWT 생성 함수
      clientSecret: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      profile: (profile) => ({
        id: profile.sub, // Apple User ID
        uid: profile.sub, // 동일 ID로 저장
        name: profile.email, // 이메일 주소
        email: profile.email, // 이메일 주소
        role: "newUser",
        isActive: false,
        profileImage:
          "http://img1.kakaocdn.net/thumb/R110x110.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg", // 기본 이미지 (필요시 수정 가능)
      }),
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 3 * 24 * 60 * 60, // 3 days
  },
  pages: {
    signIn: "/home",
    error: "/login",
    newUser: "/register/name",
  },

  callbacks: {
    async signIn({ account, user, profile }) {
      try {
        console.log("SignIn Debug:", { provider: account?.provider, user, account });
        if (account.provider === "guest") return true;
        if (account.provider === "credentials") return true;
        if (account.provider === "kakao" && !account.access_token) {
          return false;
        }
        if (account.provider === "kakao" || account.provider === "apple") {
          await dbConnect();

          const findUser = await User.findOneAndUpdate(
            { uid: user.uid },
            {
              $set: {
                profileImage:
                  user.profileImage ||
                  "http://img1.kakaocdn.net/thumb/R110x110.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg",
              },
            },
          );

          if (findUser) {
            user.role = findUser.role;
            user.location = findUser.location;
            account.role = findUser.role;
            account.location = findUser.location;

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
                    // ...
                  },
                },
                { upsert: true, new: true },
              );
            }
          }
          return true;
        }

        if (user) {
          account.role = user.role;
          account.location = user.location;
        }

        if (user.role === "waiting") {
          return "/login?status=waiting";
        }

        return true;
      } catch (error) {
        console.error("signIn 콜백 에러:", error);
        return false;
      }
    },

    async session({ session, token, user, trigger }) {
      console.log("SESS", session, token, user);
      if (trigger === "update") {
        return session;
      }

      if (session.user.name === "게스트") {
        session.user = {
          id: "66f29811e0f0564ae35c52a4",
          uid: "1234567890",
          name: "게스트",
          role: "member",
          profileImage:
            "http://img1.kakaocdn.net/thumb/R110x110.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg",
          isActive: true,
          location: "수원",
        };
      } else if (session.user.name === "guest") {
        session.user = {
          id: "66f29811e0f0564ae35c52a4",
          uid: "1234567890",
          name: "guest",
          role: "guest",
          location: "수원",
          isActive: false,
          profileImage: "",
        };
      } else {
        session.user = {
          id: token.id.toString(),
          uid: token.uid.toString(),
          name: token.name,
          role: token.role,
          isActive: token.isActive,
          location: token.location || "수원",
          profileImage: token.profileImage,
        };
      }
      return session;
    },

    async jwt({ token, account, user, trigger }) {
      console.log("JWT Debug:", { token, account, user });

      try {
        // 특정 트리거로 토큰 업데이트
        if (trigger === "update" && token?.role) {
          token.role = "waiting";
          return token;
        }

        // Guest 로그인 처리
        if (account && account.provider === "guest") {
          token = {
            id: "66f29811e0f0564ae35c52a4",
            uid: "1234567890",
            name: "guest",
            role: "guest",
            location: "수원",
            isActive: false,
            profileImage: "",
            ...token,
          };
          return token;
        }

        // Credentials 로그인 처리
        if (account && account.provider === "credentials") {
          token = {
            id: "66f29811e0f0564ae35c52a4",
            uid: "1234567890",
            name: "게스트",
            role: "guest",
            location: "수원",
            isActive: false,
            profileImage: "",
            ...token,
          };
          return token;
        }

        // Kakao 로그인 처리
        if (account && account.provider === "kakao") {
          await Account.findOneAndUpdate(
            { providerAccountId: account.providerAccountId },
            {
              $set: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                refresh_token_expires_in: account.refresh_token_expires_in,
                location: account.location || user.location || "수원",
              },
            },
            { upsert: true }, // 계정이 없으면 생성, 있으면 업데이트
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
            location: account.location || user.location || "수원",
          };

          return newToken;
        }

        // Apple 로그인 처리
        if (account && account.provider === "apple") {
          const newToken: JWT = {
            accessToken: account.access_token || "", // Apple은 기본적으로 제공하지 않으므로 빈 문자열
            refreshToken: account.refresh_token || "", // Apple의 refresh_token도 필요시 빈 값
            accessTokenExpires: Date.now() + 1000 * 60 * 60, // 1시간 후 만료 (기본값 예시)
            id: user.id,
            uid: user.uid,
            name: user.name,
            profileImage: user.profileImage || "",
            role: user.role || "newUser",
            isActive: user.isActive || false,
            location: user.location || null, // Location은 nullable로 설정
          };

          return newToken;
        }

        // Token 갱신 처리
        if (token.accessTokenExpires) {
          if (Date.now() < token.accessTokenExpires) {
            return token;
          }
          return refreshAccessToken(token);
        } else {
          return token;
        }
      } catch (error) {
        console.error("JWT 콜백 에러:", error);
        return token;
      }
    },
  },
};

export default NextAuth(authOptions);
