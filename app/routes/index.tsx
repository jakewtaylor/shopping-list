import type { ShoppingList } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/util/auth.server";
import { getShoppingListsByUserId } from "~/util/shoppingList.server";

type LoaderData = {
  userId: string;
  shoppingLists: ShoppingList[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const userId = await requireUserId(request);

  const shoppingLists = await getShoppingListsByUserId(userId);

  return { userId, shoppingLists };
};

export default function Index() {
  const { shoppingLists } = useLoaderData<LoaderData>();

  return (
    <div className="h-full bg-stone-300 p-4">
      <h1 className="font-bold">Your lists</h1>
      <ul className="list-disc pl-4">
        {shoppingLists.map((shoppingList) => (
          <li key={shoppingList.id}>
            <Link to={`/lists/${shoppingList.id}`} className="text-blue-600">
              {shoppingList.name}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/lists/new" className="text-blue-600">
            Create new list
          </Link>
        </li>
      </ul>
    </div>
  );
}
