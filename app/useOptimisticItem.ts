import type { Item } from "@prisma/client";
import type { Fetcher } from "@remix-run/react";
import { useMemo } from "react";

export const useOptimisticItem = (fetcher: Fetcher, listId: string) => {
  return useMemo<Item | null>(() => {
    if (!fetcher.submission) return null;

    const name = fetcher.submission.formData.get("name")?.toString() ?? null;

    if (!name) return null;

    return {
      id: "optimistic-item",
      name,
      removed: null,
      shoppingListId: listId,
    };
  }, [fetcher.submission, listId]);
};
