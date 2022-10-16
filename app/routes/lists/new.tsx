import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Card } from "~/components/Card";
import { requireUserId } from "~/util/auth.server";
import { createShoppingList } from "~/util/shoppingList.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const form = await request.formData();

  const listName = form.get("name");

  if (typeof listName !== "string") {
    throw new Error("invalid");
  }

  const list = await createShoppingList(userId, listName);

  return redirect(`/lists/${list.id}`);
};

export default function NewList() {
  return (
    <div className="h-full bg-stone-300 p-4">
      <h1 className="text-4xl font-bold text-stone-900 mb-4">New List</h1>
      <Card>
        <form
          action="/lists/new"
          method="POST"
          className="flex flex-col space-y-4"
        >
          <input
            type="text"
            name="name"
            className="bg-stone-100 rounded-sm border-2 border-stone-300 p-2"
            placeholder="List name"
          />

          <input
            type="submit"
            value="Create"
            className="bg-stone-300 rounded-sm border-2 border-stone-300 p-2 cursor-pointer"
          />
        </form>
      </Card>
    </div>
  );
}
