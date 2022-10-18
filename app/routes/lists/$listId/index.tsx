import type { Item } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { FixedBottom } from "~/components/FixedBottom";
import { ListItem, OptimisticListItem } from "~/components/ListItem";
import { MenuBar } from "~/components/MenuBar";
import { useOptimisticItem } from "~/useOptimisticItem";
import { canAccessList } from "~/util/auth.server";
import { notFound } from "~/util/http.server";
import type { ShoppingListWithItems } from "~/util/shoppingList.server";
import { getShoppingList } from "~/util/shoppingList.server";

type LoaderData = {
  listId: string;
  list: ShoppingListWithItems;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const { listId } = params;

  if (!listId) throw notFound();

  const list = await getShoppingList(listId);

  if (!list) throw notFound();

  await canAccessList(request, list);

  return { listId, list };
};

export default function List() {
  const { listId, list } = useLoaderData<LoaderData>();

  const createItemFetcher = useFetcher();
  const optimisticItem = useOptimisticItem(createItemFetcher, listId);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    if (createItemFetcher.state === "submitting") {
      inputRef.current.value = "";
    }
  }, [createItemFetcher.state]);

  return (
    <div className="h-full bg-stone-300">
      {/* <ul className="divide-y divide-stone-900 border-y border-stone-900"> */}
      <ul className="">
        {list.items.map((item) => (
          <ListItem key={item.id} item={item as Item} />
        ))}

        {optimisticItem ? <OptimisticListItem item={optimisticItem} /> : null}

        <li className="">
          <createItemFetcher.Form action="./items" method="post">
            <input
              ref={inputRef}
              disabled={!!optimisticItem}
              type="text"
              name="name"
              placeholder="add to list"
              required
              autoComplete="off"
              autoFocus
              className="w-full text-2xl font-serif bg-transparent rounded-lg focus:outline-none p-4"
            />
          </createItemFetcher.Form>
        </li>
      </ul>

      <FixedBottom>
        <MenuBar />
      </FixedBottom>
    </div>
  );
}
