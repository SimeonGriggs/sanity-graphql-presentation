// ./app/root.tsx

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Preferences } from "~/components/Preferences";
import type { PreferencesCookie } from "./cookies";
import { preferences } from "./cookies";
import { Suspense, lazy } from "react";

const VisualEditing = lazy(() => import("~/components/VisualEditing"));

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie: PreferencesCookie =
    (await preferences.parse(cookieHeader)) || {};
  return json({ preferences: cookie });
}

export default function App() {
  const { preferences } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
      </head>
      <body className="bg-white">
        <Preferences preferences={preferences} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {preferences.overlays === "on" ? (
          <Suspense>
            <VisualEditing studioUrl="http://localhost:3333" />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}
