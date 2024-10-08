export type Message = {
  sender: "user" | "ai";
  content: string;
  action?: string;
};

export type Chat = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  description: string;
};

export type CreateChat = {
  id: string;
  name: string;
  username: string;
  avatar: string;
};

export interface Draft {
  id: string;
  title: string;
  avatar: string;
  description: string;
  nftName: string;
  nftSymbol: string;
}
