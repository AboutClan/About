import { IUser } from "./userTypes/userInfoTypes";

export interface SendChatProps {
  toUid: string;
  message: string;
}

export interface ChatProps {
  content: string;
  createdAt: string;
  uid: string;
}

export interface MyChatsProps {
  contents: ChatProps[];
  user: IUser;
}
