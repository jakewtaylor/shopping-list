import type { Item } from "@prisma/client";
import { useFetcher } from "@remix-run/react";

type ListItemProps = {
  item: Item;
};

export const ListItem = ({ item }: ListItemProps) => {
  const fetcher = useFetcher();

  const optimisticRemoved = item.removed
    ? !fetcher.submission
    : fetcher.submission;

  return (
    <li className="text-2xl font-serif">
      <fetcher.Form method="post" action={`/list-items/${item.id}/toggle`}>
        <input
          type="submit"
          value={item.name}
          className={optimisticRemoved ? "line-through" : ""}
        />
      </fetcher.Form>
    </li>
  );
};
