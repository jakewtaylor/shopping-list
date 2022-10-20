import type { Item } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { ListItem, OptimisticListItem } from "~/components/ListItem";
import { MenuBar } from "~/components/MenuBar";
import { useOptimisticItem } from "~/useOptimisticItem";
import { canAccessList } from "~/util/auth.server";
import { notFound } from "~/util/http.server";
import { pusher } from "~/util/pusher.client";
import type { ReloadMessageData } from "~/util/pusher.server";
import type { ShoppingListWithItems } from "~/util/shoppingList.server";
import { getShoppingList } from "~/util/shoppingList.server";

type LoaderData = {
  listId: string;
  list: ShoppingListWithItems;
  userId: string;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const { listId } = params;

  if (!listId) throw notFound();

  const list = await getShoppingList(listId);

  if (!list) throw notFound();

  const { userId } = await canAccessList(request, list);

  return { listId, list, userId };
};

export default function List() {
  const { listId, list, userId } = useLoaderData<LoaderData>();

  const navigate = useNavigate();
  const createItemFetcher = useFetcher();
  const optimisticItem = useOptimisticItem(createItemFetcher, listId);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    if (createItemFetcher.state === "submitting") {
      inputRef.current.value = "";
    }
  }, [createItemFetcher.state]);

  useEffect(() => {
    const channel = pusher.subscribe(`list-${listId}`);

    channel.bind("reload", (message?: ReloadMessageData) => {
      if (message && message.userId !== userId) {
        navigate(".", { replace: true });
      }
    });

    return () => {
      pusher.unsubscribe(`list-${listId}`);
    };
  }, [listId, navigate, userId]);

  return (
    <>
      <MenuBar>
        <Link to="share" className="p-4 hover:bg-zinc-700 text-yellow-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        </Link>
      </MenuBar>

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
                className="w-full text-2xl bg-transparent rounded-lg focus:outline-none p-4"
              />
            </createItemFetcher.Form>
          </li>
        </ul>
      </div>
    </>
  );
}
