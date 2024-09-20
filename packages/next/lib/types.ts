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
};
