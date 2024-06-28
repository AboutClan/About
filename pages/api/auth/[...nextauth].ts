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
  providers: [
    CredentialsProvider({
      id: "guest",
      name: "guest",
      credentials: {},
      async authorize(credentials, req) {
        
        const profile = {
          id: "0",
          uid: "0",
          name: "guest",
          role: "guest",
          profileImage: "",
          isActive: true,
        };
        if (profile) return profile;
        return null;
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
    newUser: "/register/location",
  },

  callbacks: {
    async signIn({ account, user, profile, credentials }) {
      try {
        console.log("signIn 호출됨", { account, user, profile, credentials });
        if (account.provider === "guest") return true;

        if (!account.access_token) return false;

        if (user) {
          account.role = user.role;
          account.location = user.location;
        }

        const profileImage = profile.properties.thumbnail_image || profile.properties.profile_image;

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
      } catch (error) {
        console.error("signIn 콜백 에러:", error);
        return false;
      }
    },

    async session({ session, token, user, trigger }) {
      if (trigger === "update") {
        return session;
      }

      if (session.user.name === "guest") {
        session.user = {
          id: "0",
          uid: "0",
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
          location: token.location,
          profileImage: token.profileImage,
        };
      }
      return session;
    },

    async jwt({ token, account, user, trigger }) {
    
      try {
        console.log("jwt 호출됨", { token, account, user, trigger });
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
                location: account.location || user.location,
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
            location: account.location || user.location,
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
