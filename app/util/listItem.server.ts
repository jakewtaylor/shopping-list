import { authApi } from "./api.server";
import { requireAuthToken } from "./auth2.server";

export const createListItem = async (
  request: Request,
  listId: string,
  name: string
) => {
  const token = await requireAuthToken(request);

  try {
    const res = await authApi(token).post(
      `/shopping-lists/${listId}/list-items`,
      {
        name,
      }
    );

    return res.data;
  } catch (err) {
    console.log(err);

    throw err;
  }
};

export const toggleListItem = async (request: Request, itemId: string) => {
  const token = await requireAuthToken(request);

  try {
    const res = await authApi(token).post(`/list-items/${itemId}/toggle`);

    return res.data;
  } catch (err) {
    console.log(err);

    throw err;
  }
};

export const renameListItem = async (
  request: Request,
  itemId: string,
  name: string
) => {
  const token = await requireAuthToken(request);

  try {
    const res = await authApi(token).patch(`/list-items/${itemId}`, {
      name,
    });

    return res.data;
  } catch (err) {
    console.log(err);

    throw err;
  }
};

export const deleteListItem = async (request: Request, itemId: string) => {
  const token = await requireAuthToken(request);

  try {
    const res = await authApi(token).delete(`/list-items/${itemId}`);

    return res.data;
  } catch (err) {
    console.log(err);

    throw err;
  }
};
