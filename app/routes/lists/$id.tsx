import type { ShoppingList } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { notFound } from "~/util/http.server";
import { getShoppingList } from "~/util/shoppingList.server";

type LoaderData = {
  list: ShoppingList;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const listId = params.id;

  if (!listId) throw notFound();

  const list = await getShoppingList(listId);

  if (!list) throw notFound();

  return { list };
};

export default function List() {
  const { list } = useLoaderData<LoaderData>();

  return (
    <div className="h-full bg-stone-300">
      <p>List</p>

      <p>{list.id}</p>
    </div>
  );
}
