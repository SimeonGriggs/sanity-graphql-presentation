// ./app/routes/resources/preferences.tsx

import type { ActionFunctionArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { preferences } from "~/cookies";

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await preferences.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  if (bodyParams.get("perspective")) {
    cookie.perspective = bodyParams.get("perspective");
  } else if (bodyParams.get("overlays")) {
    cookie.overlays = bodyParams.get("overlays");
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await preferences.serialize(cookie),
    },
  });
}
