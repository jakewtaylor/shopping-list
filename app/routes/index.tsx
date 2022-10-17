import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/util/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);

  return redirect("/lists");
};
