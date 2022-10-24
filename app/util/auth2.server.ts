import { redirect } from "@remix-run/node";
import type { AxiosResponse } from "axios";
import { api, isAxiosError } from "./api.server";
import { getUserSession, storage } from "./session.server";

type RegisterRequest = {
  username: string;
  password: string;
};

type LoginRequest = {
  username: string;
  password: string;
};

type UserResponse = {
  id: number;
  name: string;
  email: string;
};

type AuthResponse = {
  token: string;
};

export const register = async (
  request: Request,
  { username, password }: RegisterRequest
) => {
  let response: AxiosResponse<AuthResponse>;
  const session = await getUserSession(request);

  try {
    await api.post("/user", {
      username,
      password,
    });

    response = await api.post<AuthResponse>("/user/authenticate", {
      username,
      password,
      client: "remix",
    });
  } catch (err) {
    console.dir(err);
    return { errors: ["idk yet"] };
  }

  session.set("userToken", response.data.token);

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

export const login = async (
  request: Request,
  { username, password }: LoginRequest
) => {
  let response: AxiosResponse<AuthResponse>;

  const session = await getUserSession(request);

  try {
    response = await api.post<AuthResponse>("/user/authenticate", {
      username,
      password,
      client: "remix",
    });
  } catch (err) {
    if (!isAxiosError(err)) throw err;

    const errors = (err.response?.data as any).errors ?? {};

    console.log(err);
    console.log({ errors });

    return Object.values(errors).flat();
  }

  console.log(response);

  session.set("userToken", response.data.token);

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

export const requireAuthToken = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request);
  const token = session.get("userToken");

  console.log({ token });

  if (!token || typeof token !== "string") {
    throw unauthorizedRedirect(redirectTo);
  }

  return token;
};

export const requireUser = async (
  request: Request,
  redirectTo = new URL(request.url).pathname
) => {
  const token = await requireAuthToken(request, redirectTo);

  try {
    const user = await api.get<UserResponse>("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return user.data;
  } catch (err) {
    console.log(err);
    throw unauthorizedRedirect(redirectTo);
  }
};

export const requireGuest = async (request: Request) => {
  const session = await getUserSession(request);
  const token = session.get("userToken");

  if (!token) return;

  throw redirect("/");
};

const unauthorizedRedirect = (redirectTo: string) => {
  const searchParams = new URLSearchParams({ redirectTo });

  return redirect(`/login?${searchParams}`);
};
