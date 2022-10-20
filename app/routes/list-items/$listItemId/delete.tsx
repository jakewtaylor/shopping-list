import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { methodNotAllowed, notFound } from "~/util/http.server";
import { deleteListItem } from "~/util/listItem.server";

export type DeleteSuccess = { success: true };
export type DeleteError = { error: string };
export type DeleteResponse = DeleteSuccess | DeleteError;

export const isErrorResponse = (res?: DeleteResponse): res is DeleteError => {
  return !!res && res.hasOwnProperty("error");
};

export const action: ActionFunction = async ({ params, request }) => {
  if (request.method !== "POST") throw methodNotAllowed();

  const { listItemId } = params;

  if (!listItemId) throw notFound();

  try {
    await deleteListItem(listItemId);

    return json<DeleteSuccess>({ success: true });
  } catch (err) {
    if (err instanceof Response) throw err;

    console.error(err);

    return json<DeleteError>(
      { error: "Sorry, something went wrong. Try again." },
      { status: 500 }
    );
  }
};
