import type { Item } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
// import { requireUserId } from "~/util/auth.server";
import { methodNotAllowed, notFound } from "~/util/http.server";
import { toggleListItem } from "~/util/listItem.server";
// import { sendReloadMessage } from "~/util/pusher.server";

export type ToggleSuccess = { item: Item };
export type ToggleError = { error: string };
export type ToggleResponse = ToggleSuccess | ToggleError;

export const isErrorResponse = (res?: ToggleResponse): res is ToggleError => {
  return !!res && res.hasOwnProperty("error");
};

export const action: ActionFunction = async ({ params, request }) => {
  // const userId = await requireUserId(request);
  if (request.method !== "POST") throw methodNotAllowed();

  const { listItemId } = params;

  if (!listItemId) throw notFound();

  try {
    const item = await toggleListItem(request, listItemId);

    // await sendReloadMessage(item.shoppingListId, userId);

    return json<ToggleSuccess>({ item });
  } catch (err) {
    if (err instanceof Response) throw err;

    console.error(err);

    return json<ToggleError>(
      { error: "Sorry, something went wrong. Try again." },
      { status: 500 }
    );
  }
};
