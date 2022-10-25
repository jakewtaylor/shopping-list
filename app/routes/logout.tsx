import type { LoaderFunction } from "@remix-run/node";
import { logout } from "~/util/auth2.server";

export const loader: LoaderFunction = async ({ request }) => {
  return await logout(request);
};
