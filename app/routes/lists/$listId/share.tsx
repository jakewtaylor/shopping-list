import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MenuBar } from "~/components/MenuBar";
import { notFound } from "~/util/http.server";
import { signedRoute } from "~/util/signedRoutes.server";

type LoaderData = {
  joinUrl: string;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const { listId } = params;

  if (!listId) throw notFound();

  const { host, protocol } = new URL(request.url);

  return {
    joinUrl: protocol + "//" + host + signedRoute(`/lists/${listId}/join`),
  };
};

export default function Share() {
  const { joinUrl } = useLoaderData<LoaderData>();

  return (
    <>
      <MenuBar />

      <div className="h-full p-4">
        <h1 className="font-bold text-3xl block mb-3">Share your list</h1>

        <p className="mb-2">
          Share this link with your friend, and they'll get access to your list.
        </p>

        <input
          type="text"
          readOnly
          value={joinUrl}
          className="w-full rounded bg-white border border-stone-400 leading-none p-2 focus:outline-none"
        />
      </div>
    </>
  );
}
