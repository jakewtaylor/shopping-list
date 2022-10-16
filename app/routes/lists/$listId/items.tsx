import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { notFound } from "~/util/http.server";
import { createListItem } from "~/util/listItem.server";

export const action: ActionFunction = async ({ params, request }) => {
  const { listId } = params;

  if (!listId) throw notFound();

  const form = await request.formData();

  const name = form.get("name");

  if (typeof name !== "string") {
    throw new Error("Invalid");
  }

  const item = await createListItem(listId, name);

  return json({ item });
};

export const loader: LoaderFunction = () => {
  throw notFound();
};
