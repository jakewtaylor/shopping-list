import { Link, useFetchers, useTransition } from "@remix-run/react";
import React from "react";
import { TransitionIndicator } from "./TransitionIndicator";

export const MenuBar = ({ children }: { children?: React.ReactNode }) => {
  const transition = useTransition();
  const allFetchers = useFetchers();

  const fetcherTransitioning = allFetchers.some(
    (fetcher) => fetcher.state !== "idle"
  );

  const submitting =
    transition.state === "submitting" ||
    transition.state === "loading" ||
    fetcherTransitioning;

  return (
    <>
      <TransitionIndicator isTransitioning={submitting} />

      <div
        className={`bg-zinc-800 flex justify-between h-14 ${
          submitting ? "h-14 md:h-16 md:pt-2" : "h-14"
        } fixed bottom-[env(safe-area-inset-bottom)] md:bottom-auto md:top-0 left-0 right-0`}
      >
        <Link
          to="/"
          aria-label="Home"
          className="p-4 hover:bg-zinc-700 text-yellow-400"
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
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </Link>

        {children}

        <Link
          to="/logout"
          aria-label="Log out"
          className="p-4 hover:bg-zinc-700 text-yellow-400"
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
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </Link>
      </div>
    </>
  );
};
