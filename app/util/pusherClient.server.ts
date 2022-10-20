import Pusher from "pusher";

let pusher: Pusher;

declare global {
  var __pusher: Pusher | undefined;
}

const config: Pusher.Options = {
  appId: "1494915",
  key: "82f04f06786cc3b4d7b9",
  secret: process.env.PUSHER_SECRET!,
  cluster: "eu",
  useTLS: true,
};

if (process.env.NODE_ENV === "production") {
  pusher = new Pusher(config);
} else {
  if (!global.__pusher) {
    global.__pusher = new Pusher(config);
  }

  pusher = global.__pusher;
}

export { pusher };
