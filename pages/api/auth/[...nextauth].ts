/* eslint-disable */

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";

import dbConnect from "../../../libs/backend/dbConnect";
import clientPromise from "../../../libs/backend/mongodb";
import { refreshAccessToken } from "../../../libs/backend/oauthUtils";
import { Account } from "../../../models/account";
import { User } from "../../../models/user";

const secret = process.env.NEXTAUTH_SECRET;

// if (!secret) {
//   throw new Error("NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.");
// }

export const authOptions: NextAuthOptions = {
  secret,
  debug: true,
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
          profileImage: "",
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
        if (account.provider === "guest") return true;
        if (account.provider === "credentials") return true;
        if (!account.access_token) return false;

        if (user) {
          account.role = user.role;
          account.location = user.location;
        }

        const profileImage = profile.properties.thumbnail_image || profile.properties.profile_image;

        if (user.role === "waiting") {
          return "/login?status=waiting";
        }

        await dbConnect();
        const findUser = await User.findOneAndUpdate(
          { uid: user.uid },
          {
            $set: {
              profileImage,
            },
          },
          { new: false }, // 기존 데이터를 반환합니다.
        );

        if (findUser) {
          user.role = findUser.role;
          user.location = findUser.location;
          account.role = findUser.role;
          account.location = findUser.location;
        }

        return true;
      } catch (error) {
        console.error("signIn 콜백 에러:", error);
        return false;
      }
    },

    async session({ session, token, user, trigger }) {
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
      console.log(2, token, account, user);
      try {
        if (trigger === "update" && token?.role) {
          token.role = "waiting";
          return token;
        }

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

        if (account && account.provider === "kakao") {
          await Account.updateOne(
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

        if (token.accessTokenExpires) {
          if (Date.now() < token.accessTokenExpires) {
            return token;
          }
          return refreshAccessToken(token);
        } else {
          return token;
        }
      } catch (error) {
        console.error("jwt 콜백 에러:", error);
        return token;
      }
    },
  },
};

export default NextAuth(authOptions);
