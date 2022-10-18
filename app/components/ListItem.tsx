import type { Item } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useLongPress } from "use-long-press";
import React, { useEffect, useState } from "react";
import { ReadonlyCheckbox } from "./ReadonlyCheckbox";

type ListItemProps = {
  item: Item;
};

export const ListItem = ({ item }: ListItemProps) => {
  const toggleFetcher = useFetcher();
  const renameFetcher = useFetcher();

  const [editing, setEditing] = useState(false);

  let time: number | null = null;
  const bind = useLongPress(
    () => {
      setEditing(true);
    },
    {
      onStart: () => {
        time = Date.now();
      },
      onCancel: () => {
        if (time && Date.now() - time <= 400) {
          handleToggle();
        }
      },
    }
  );

  const optimisticRemoved = item.removed
    ? !toggleFetcher.submission
    : !!toggleFetcher.submission;

  const handleToggle = () => {
    toggleFetcher.submit(
      {},
      {
        method: "post",
        action: `/list-items/${item.id}/toggle`,
      }
    );
  };

  useEffect(() => {
    if (renameFetcher.state === "idle") {
      setEditing(false);
    }
  }, [renameFetcher.state]);

  return (
    <li>
      {editing ? (
        <div className="flex items-center w-full p-4">
          <div className="opacity-50">
            <ReadonlyCheckbox checked={optimisticRemoved} />
          </div>
          <renameFetcher.Form
            method="post"
            action={`/list-items/${item.id}/update`}
            className="h-6 mb-px"
          >
            <input
              type="text"
              name="name"
              defaultValue={item.name}
              className="ml-3 bg-none text-2xl h-6 leading-none inline-block box-content border-none bg-transparent focus:outline-none"
              autoFocus
              required
            />
          </renameFetcher.Form>
        </div>
      ) : (
        <button
          className="p-4 flex items-center w-full"
          // onClick={handleToggle}
          {...bind()}
        >
          <ReadonlyCheckbox checked={optimisticRemoved} />
          <p
            className={`text-2xl ml-3 leading-none mb-px ${
              optimisticRemoved ? "line-through" : ""
            }`}
          >
            {item.name}
          </p>
        </button>
      )}
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
