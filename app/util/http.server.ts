export const notFound = () => new Response("Not Found", { status: 404 });

export const methodNotAllowed = () =>
  new Response("Method Not Allowed", { status: 405 });
