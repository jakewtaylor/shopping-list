import type { Item } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import React from "react";

type ListItemProps = {
  item: Item;
};

export const ListItem = ({ item }: ListItemProps) => {
  const fetcher = useFetcher();

  const optimisticRemoved = item.removed
    ? !fetcher.submission
    : !!fetcher.submission;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    fetcher.submit(
      {},
      {
        method: "post",
        action: `/list-items/${item.id}/toggle`,
      }
    );
  };

  return (
    <li className="">
      <button className="p-4 flex items-center w-full" onClick={handleToggle}>
        <input
          type="checkbox"
          readOnly
          checked={optimisticRemoved}
          aria-hidden
          className="pointer-events-none"
        />
        <p
          className={`text-2xl font-serif ml-3 ${
            optimisticRemoved ? "line-through" : ""
          }`}
        >
          {item.name}
        </p>
      </button>
    </li>
  );
};

export const OptimisticListItem = ({ item }: ListItemProps) => {
  return (
    <li className="p-4 flex items-center">
      <input
        type="checkbox"
        readOnly
        aria-hidden
        className="pointer-events-none"
      />
      <p className="text-2xl font-serif ml-3">{item.name}</p>
    </li>
  );
};
