import axios, { AxiosError } from "axios";
import { JWT } from "next-auth/jwt";

import { Account } from "../../models/account";
import { User } from "../../models/user";
import { generateClientSecret } from "../../pages/api/auth/[...nextauth]";

export const refreshAccessToken = async (token: JWT, provider: string) => {
  try {
    if (provider === "kakao") {
      const url =
        "https://kauth.kakao.com/oauth/token?" +
        new URLSearchParams({
          client_id: process.env.KAKAO_CLIENT_ID as string,
          client_secret: process.env.KAKAO_CLIENT_SECRET as string,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken as string,
        });

      const response = await axios.post(url, null, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      const refreshedTokens = response.data;

      if (response.status !== 200) throw refreshedTokens;

      const updateFields = Object.assign(
        {},
        refreshedTokens.access_token && { access_token: refreshedTokens.access_token },
        refreshedTokens.refresh_token && { refresh_token: refreshedTokens.refresh_token },
        refreshedTokens.expires_in && {
          expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
        },
        refreshedTokens.refresh_token_expires_in && {
          refresh_token_expires_in: refreshedTokens.refresh_token_expires_in,
        },
      );

      await Account.updateOne({ providerAccountId: token.uid.toString() }, { $set: updateFields });

      return {
        ...token,
        accessToken: refreshedTokens.access_token,
        accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      };
    } else if (provider === "apple") {
      const clientSecret = generateClientSecret();
      const params = new URLSearchParams({
        client_id: process.env.APPLE_ID as string,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      });

      const response = await axios.post("https://appleid.apple.com/auth/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const refreshedTokens = response.data;

      if (response.status !== 200) throw refreshedTokens;

      await Account.updateMany(
        { providerAccountId: token.uid.toString() },
        {
          $set: {
            access_token: refreshedTokens.access_token,
            refresh_token: refreshedTokens.refresh_token || token.refreshToken,
          },
        },
      );

      return {
        ...token,

        accessToken: refreshedTokens.access_token,
        accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      };
    } else {
      // 기타 Provider 처리 필요 시 추가
      return { ...token, error: "UnsupportedProvider" };
    }
  } catch (error) {
    console.error(error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

export const withdrawal = async (accessToken: string) => {
  const url = "https://kapi.kakao.com/v1/user/unlink";

  let uid: string;
  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    uid = response.data.id.toString();
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(axiosError);
  }

  if (uid) {
    await Account.deleteMany({ providerAccountId: uid });
    await User.updateMany(
      { uid },
      {
        $set: {
          name: "(알수없음)",
          role: "stranger",
          status: "inactive",
          uid: "",
        },
      },
    );
  }
  return;
};
