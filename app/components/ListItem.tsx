import type { Item } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { ReadonlyCheckbox } from "./ReadonlyCheckbox";
import type { ToggleResponse } from "~/routes/list-items/$listItemId/toggle";
import { isErrorResponse } from "~/routes/list-items/$listItemId/toggle";
import { Menu } from "@headlessui/react";

type ListItemProps = {
  item: Item;
};

export const ListItem = ({ item }: ListItemProps) => {
  const toggleFetcher = useFetcher<ToggleResponse>();
  const deleteFetcher = useFetcher();
  const renameFetcher = useFetcher();

  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const optimisticRemoved = item.removed
    ? !toggleFetcher.submission
    : !!toggleFetcher.submission;

  const deleting = deleteFetcher.state === "submitting";

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    toggleFetcher.submit(
      {},
      {
        method: "post",
        action: `/list-items/${item.id}/toggle`,
      }
    );
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    deleteFetcher.submit(
      {},
      {
        method: "post",
        action: `/list-items/${item.id}/delete`,
      }
    );
  };

  useEffect(() => {
    if (renameFetcher.state === "idle") {
      setEditing(false);
    }
  }, [renameFetcher.state]);

  useEffect(() => {
    if (toggleFetcher.state === "submitting") {
      setError(null);
    }
  }, [toggleFetcher.state]);

  useEffect(() => {
    if (isErrorResponse(toggleFetcher.data)) {
      const { error } = toggleFetcher.data;

      setError(error);
    }
  }, [toggleFetcher.data]);

  return (
    <li>
      {editing ? (
        <div className="flex items-center w-full bg-stone-100 pl-4">
          <div className="opacity-50">
            <ReadonlyCheckbox checked={optimisticRemoved} />
          </div>
          <renameFetcher.Form
            method="post"
            action={`/list-items/${item.id}/update`}
            className="flex-grow flex"
          >
            <input
              type="text"
              name="name"
              defaultValue={item.name}
              className="py-4 ml-3 bg-none text-2xl leading-none inline-block box-content border-none bg-transparent focus:outline-none flex-grow"
              autoFocus
              required
            />

            <button type="submit" className="p-4">
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
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>
          </renameFetcher.Form>
        </div>
      ) : (
        <div className={`flex ${deleting ? "opacity-50" : ""}`}>
          <button
            className="flex items-center w-full pl-4"
            onClick={handleToggle}
            disabled={deleting}
          >
            <ReadonlyCheckbox checked={optimisticRemoved} />
            <p className={`text-2xl ml-3 leading-none text-left flex-grow`}>
              <input
                type="text"
                name="name"
                defaultValue={item.name}
                className={`py-4 w-full pointer-events-none bg-none text-2xl text-stone-800 leading-none inline-block box-content border-none bg-transparent focus:outline-none ${
                  optimisticRemoved ? "line-through" : ""
                }`}
                readOnly
              />

              {error ? (
                <>
                  <span className="block text-red-600 text-sm">{error}</span>
                </>
              ) : null}
            </p>
          </button>
          <Menu as="div" className="relative font-sans">
            <Menu.Button
              className={({ open }) =>
                `p-4 h-full ${open ? "bg-stone-200" : ""}`
              }
            >
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
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </Menu.Button>

            <Menu.Items className="absolute z-20 right-0 bg-stone-100 w-screen max-w-[12rem] rounded rounded-tr-none overflow-hidden">
              <Menu.Item>
                <button
                  className="w-full py-2 px-4 hover:bg-stone-200 text-sm font-medium text-stone-800"
                  onClick={() => setEditing(true)}
                >
                  Rename
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  className="w-full py-2 px-4 hover:bg-stone-200 text-sm font-medium text-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
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
