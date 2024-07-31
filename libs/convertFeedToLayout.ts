import dayjs from "dayjs";

import { FeedLayoutProps } from "../components/organisms/FeedLayout";
import { FeedProps } from "../types/models/feed";
import { dayjsToFormat } from "../utils/dateTimeUtils";

export const convertFeedToLayout = (feed: FeedProps): FeedLayoutProps => {
  return {
    user: feed.writer,
    date: dayjsToFormat(dayjs(feed.createdAt), "YYYY년 M월 D일"),
    images: feed.images,
    content: feed.text,
    likeUsers: feed.like,
    likeCnt: feed?.likeCnt,
    id: feed._id,
    comments: feed.comments,
    summary: {
      title: feed.title,
      url: feed.type === "gather" ? `/gather/${feed.typeId}` : `/group/${feed.typeId}`,
      text: convertSummaryText(feed.type, feed.subCategory),
    },
  };
};

export const convertSummaryText = (type: "gather" | "group", subCategory: string): string => {
  return `${type === "gather" ? "번개 리뷰" : "소모임 리뷰"} · ${subCategory}`;
};
