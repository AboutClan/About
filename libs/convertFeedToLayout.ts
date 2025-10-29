import dayjs from "dayjs";

import { FeedLayoutProps } from "../components/organisms/FeedLayout";
import { ABOUT_USER_SUMMARY } from "../constants/serviceConstants/userConstants";
import { FeedProps } from "../types/models/feed";
import { dayjsToFormat } from "../utils/dateTimeUtils";

export const convertFeedToLayout = (feed: FeedProps): FeedLayoutProps => {
  console.log(feed);
  return {
    type: feed.type,
    user: feed?.writer || ABOUT_USER_SUMMARY,
    date: dayjsToFormat(dayjs(feed.createdAt), "YYYY년 M월 D일"),
    images: feed.images,
    content: feed.text,
    likeUsers: feed.like,
    likeCnt: feed?.likeCnt,
    id: feed.typeId,
    comments: feed.comments,
    isAnonymous: feed.isAnonymous,
    summary: feed.type
      ? {
          url: `/gather/${feed.typeId}`,
          title: feed.title,
          text: `${feed.subCategory || "모임 후기"} · ${dayjsToFormat(
            dayjs(feed.date || feed.createdAt),
            "M월 D일(ddd)",
          )}`,
        }
      : null,
  };
};
