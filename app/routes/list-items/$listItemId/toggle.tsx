import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { methodNotAllowed, notFound } from "~/util/http.server";
import { toggleListItem } from "~/util/listItem.server";

export const action: ActionFunction = async ({ params, request }) => {
  if (request.method !== "POST") throw methodNotAllowed();

  const { listItemId } = params;

  if (!listItemId) throw notFound();

  const item = await toggleListItem(listItemId);

  return json({ item });
};
