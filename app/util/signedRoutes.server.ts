import { sha256 } from "js-sha256";
import { notFound } from "./http.server";

const buildMessage = (route: string) => {
  const key = process.env.SIGNING_KEY;
  return `${route}-${key}`;
};

export const signedRoute = (route: string) => {
  const signature = sha256(buildMessage(route));

  return route + (route.includes("?") ? "&" : "?") + `signature=${signature}`;
};

export const validateSignature = async (request: Request) => {
  const { pathname, searchParams } = new URL(request.url);
  const signature = searchParams.get("signature");

  if (!signature) throw notFound();

  const expectedSignature = sha256(buildMessage(pathname));

  if (expectedSignature !== signature) throw notFound();
};
