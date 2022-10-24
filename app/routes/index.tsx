import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireAuthToken } from "~/util/auth2.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthToken(request);

  return redirect("/lists");
};
