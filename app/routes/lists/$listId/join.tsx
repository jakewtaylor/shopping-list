import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/util/auth.server";
import { notFound } from "~/util/http.server";
import { addUserToShoppingList } from "~/util/shoppingList.server";
import { validateSignature } from "~/util/signedRoutes.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  await validateSignature(request);
  const { listId } = params;

  if (!listId) throw notFound();

  const userId = await requireUserId(request);

  const list = await addUserToShoppingList(listId, userId);

  return redirect(`/lists/${list.id}`);
};
