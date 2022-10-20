import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
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

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();

    navigator.clipboard
      .writeText(joinUrl)
      .then((res) => {
        console.log("copied");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <MenuBar />

      <div className="h-full p-4">
        <h1 className="font-bold text-3xl block mb-3">Share your list</h1>

        <p className="mb-2">
          Share this link with your friend, and they'll get access to your list.
        </p>

        <div className="bg-white border border-stone-400 rounded flex p-1">
          <input
            type="text"
            readOnly
            value={joinUrl}
            className="flex-grow bg-transparent leading-none focus:outline-none pr-3"
          />

          <div className="border-l border-stone-300 pl-1">
            <button
              className="rounded hover:bg-stone-200 p-2"
              onClick={handleCopy}
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
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
