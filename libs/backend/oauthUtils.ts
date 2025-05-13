import axios, { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { JWT } from "next-auth/jwt";

import { Account } from "../../models/account";
import { User } from "../../models/user";
import { generateClientSecret } from "../../pages/api/auth/[...nextauth]";

interface IKakaoProfileInfo {
  name: string;
  profileImage: string;
  thumbnailURL: string;
}

export const getRefreshedAccessToken = async (uid: string) => {
  const account = await Account.findOne({ providerAccountId: uid.toString() });

  const token: JWT = {
    uid,
    refreshToken: account.refresh_token,
    accessToken: account.access_token,
    accessTokenExpires: account.expires_at,
  };

  const refreshed = await refreshAccessToken(token);
  return refreshed["accessToken"] as string;
};

export const refreshAccessToken = async (token: JWT) => {
  try {
    if (token.provider === "kakao") {
      const url =
        "https://kauth.kakao.com/oauth/token?" +
        new URLSearchParams({
          client_id: process.env.KAKAO_CLIENT_ID as string,
          client_secret: process.env.KAKAO_CLIENT_SECRET as string,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken as string,
        });

      const response = await axios.post(url, {
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
        refreshedTokens.expires_in && { expires_at: refreshedTokens.expires_in },
        refreshedTokens.refresh_token_expires_in && {
          refresh_token_expires_in: refreshedTokens.refresh_token_expires_in,
        },
      );

      await Account.updateMany({ providerAccountId: token.uid.toString() }, { $set: updateFields });

      return {
        ...token,
        accessToken: refreshedTokens.access_token,
        accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      };
    } else if (token.provider === "apple") {
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

export const sendResultMessage = async (
  accessToken: string,
  refreshToken: string,
  uid: string,
  date: Dayjs,
  isOpen: boolean,
  time: string,
  place: string,
) => {
  const dateKr = date.format("MM/DD");
  const resultMessage = isOpen
    ? `내일(${dateKr}) 스터디는 ${time}에 ${place}에서 열립니다`
    : `내일(${dateKr}) 스터디가 열리지 못 했어요`;

  const url = "https://kapi.kakao.com/v2/api/talk/memo/default/send?";

  const message = JSON.stringify({
    object_type: "text",
    text: resultMessage,
    link: {
      web_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/result`,
      mobile_web_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/result`,
    },
    button_title: "결과 확인",
  });

  try {
    await axios.post(url, `template_object=${message}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    if ((axiosError.response.data as { msg: string; code: number }).code === -401) {
      const accessToken = await getRefreshedAccessToken(uid);

      try {
        await axios.post(url, `template_object=${message}`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error(error);
    }
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

const getKakaoProfile = async (accessToken: string) => {
  const defaultUrl =
    "https://user-images.githubusercontent.com/48513798/173180642-8fc5948e-a437-45f3-91d0-3f0098a38195.png";
  try {
    const res = await axios.get("https://kapi.kakao.com/v1/api/talk/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      name: res.data.nickName as string,
      profileImage: (res.data.profileImageURL as string) || defaultUrl,
      thumbnailURL: (res.data.thumbnailURL as string) || defaultUrl,
    } as IKakaoProfileInfo;
  } catch (err) {
    return null;
  }
};

export const getProfile = async (accessToken: string, uid: string) => {
  const kakaoProfile = await getKakaoProfile(accessToken);
  if (kakaoProfile) return kakaoProfile;

  //가져오기에 실패하면 uid를 갱신해서 다시 시도
  const refreshedAccessToken: string = await getRefreshedAccessToken(uid);
  return getKakaoProfile(refreshedAccessToken);
};
