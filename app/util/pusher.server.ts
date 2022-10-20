import { pusher } from "./pusherClient.server";

export type ReloadMessageData = {
  userId: string | undefined;
};

export const sendReloadMessage = async (listId: string, userId?: string) => {
  console.log("sending reload");
  return await pusher.trigger(`list-${listId}`, "reload", { userId });
};
