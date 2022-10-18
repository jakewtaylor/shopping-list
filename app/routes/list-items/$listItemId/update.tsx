import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { methodNotAllowed, notFound } from "~/util/http.server";
import { renameListItem } from "~/util/listItem.server";

export const action: ActionFunction = async ({ request, params }) => {
  console.log("in action", request.method);
  if (request.method !== "POST") throw methodNotAllowed();

  const { listItemId } = params;

  if (!listItemId) throw notFound();

  const form = await request.formData();
  const newName = form.get("name");

  if (typeof newName !== "string") throw new Error("Invalid");

  const item = await renameListItem(listItemId, newName);

  return json({ item });
};
