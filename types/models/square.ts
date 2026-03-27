import { CommunityCategory } from "../../pages/community";
import { UserCommentProps } from "../components/propTypes";
import { TimeStampProps } from "../utils/timeAndDate";
import { AvatarProps, IUserSummary } from "./userTypes/userInfoTypes";

interface BaseSecretSquareItem extends TimeStampProps {
  _id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  viewers: string[];
  like: string[];
  images: string[];
  author: string | IUserSummary;
  comments: UserCommentProps[];
  avatar: AvatarProps;
  poll?: {
    pollItems: PollItem[];
    canMultiple: boolean;
  };
}

interface GeneralSecretSquareItem extends BaseSecretSquareItem {
  type: "general" | "blindnes";
}

interface PollItem {
  _id: string;
  name: string;
  users: string[];
}

export type SecretSquareItem = GeneralSecretSquareItem;

export type SecretSquareFormData = {
  category: CommunityCategory;
  title: string;
  content: string;
  pollItems: { name: string }[];
  canMultiple: boolean;
};
