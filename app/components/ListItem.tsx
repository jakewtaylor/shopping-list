import type { Item } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import React from "react";
import { ReadonlyCheckbox } from "./ReadonlyCheckbox";

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
        <ReadonlyCheckbox checked={optimisticRemoved} />
        <p
          className={`text-2xl ml-3 leading-none mb-px ${
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
    <li className="p-4 flex items-center opacity-50">
      <ReadonlyCheckbox checked={false} />
      <p className="text-2xl ml-3 leading-none">{item.name}</p>
    </li>
  );
};
