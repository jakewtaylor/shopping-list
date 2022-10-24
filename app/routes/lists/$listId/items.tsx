import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
// import { requireUserId } from "~/util/auth.server";
import { notFound } from "~/util/http.server";
import { createListItem } from "~/util/listItem.server";
// import { sendReloadMessage } from "~/util/pusher.server";

export const action: ActionFunction = async ({ params, request }) => {
  const { listId } = params;

  if (!listId) throw notFound();

  // const userId = await requireUserId(request);

  const form = await request.formData();

  const name = form.get("name");

  if (typeof name !== "string" || !name) {
    throw new Error("Invalid");
  }

  const item = await createListItem(request, listId, name);

  // await sendReloadMessage(item.shoppingListId, userId);

  return json({ item });
};

export const loader: LoaderFunction = () => {
  throw notFound();
};
