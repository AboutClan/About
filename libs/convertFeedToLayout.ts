import dayjs from "dayjs";

import { FeedLayoutProps } from "../components/organisms/FeedLayout";
import { FeedProps } from "../types/models/feed";
import { getDateDiff } from "../utils/dateTimeUtils";

export const convertFeedToLayout = (feed: FeedProps): FeedLayoutProps => {
  return {
    user: feed.writer,
    date: getDateDiff(dayjs(feed.createdAt)),
    images: feed.images,
    content: feed.text,
    likeUsers: feed.like,
    likeCnt: feed?.likeCnt,
    id: feed._id,
    comments: feed.comments,
  };
};
