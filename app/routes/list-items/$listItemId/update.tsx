import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/util/auth.server";
import { methodNotAllowed, notFound } from "~/util/http.server";
import { renameListItem } from "~/util/listItem.server";
import { sendReloadMessage } from "~/util/pusher.server";

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== "POST") throw methodNotAllowed();

  const userId = await requireUserId(request);

  const { listItemId } = params;

  if (!listItemId) throw notFound();

  const form = await request.formData();
  const newName = form.get("name");

  if (typeof newName !== "string") throw new Error("Invalid");

  const item = await renameListItem(listItemId, newName);

  await sendReloadMessage(item.shoppingListId, userId);

  return json({ item });
};
