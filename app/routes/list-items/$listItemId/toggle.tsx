import type { Item } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { methodNotAllowed, notFound } from "~/util/http.server";
import { toggleListItem } from "~/util/listItem.server";

export type ToggleSuccess = { item: Item };
export type ToggleError = { error: string };
export type ToggleResponse = ToggleSuccess | ToggleError;

export const isErrorResponse = (res?: ToggleResponse): res is ToggleError => {
  return !!res && res.hasOwnProperty("error");
};

export const action: ActionFunction = async ({ params, request }) => {
  if (request.method !== "POST") throw methodNotAllowed();

  const { listItemId } = params;

  if (!listItemId) throw notFound();

  try {
    const item = await toggleListItem(listItemId);

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
