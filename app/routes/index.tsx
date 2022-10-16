import type { ShoppingList } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
  const { userId, shoppingLists } = useLoaderData<LoaderData>();

  return (
    <>
      <p>{userId}</p>
      <ul>
        {shoppingLists.map((shoppingList) => (
          <li key={shoppingList.id}>{shoppingList.name}</li>
        ))}
      </ul>
    </>
  );
}
