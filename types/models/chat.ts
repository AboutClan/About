import { UserSimpleInfoProps } from "./userTypes/userInfoTypes";

export interface SendChatProps {
  toUid: string;
  message: string;
}

export interface ChatProps {
  content: string;
  createdAt: string;
  userId: string;
}

export interface MyChatsProps {
  content: ChatProps;
  user: UserSimpleInfoProps;
}
