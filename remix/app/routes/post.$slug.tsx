// ./app/routes/post.$slug.tsx

import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import request from "graphql-request";
import type { PreferencesCookie} from "~/cookies";
import { preferences } from "~/cookies";
import { graphqlUrl } from "~/sanity/projectDetails";
import type { AllPost } from "~/sanity/queries";
import { GET_POST } from "~/sanity/queries";

export async function loader(props: LoaderFunctionArgs) {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: PreferencesCookie =
    (await preferences.parse(cookieHeader)) || {};

  const queryUrl = new URL(graphqlUrl);
  let headers = new Headers();

  if (cookie.perspective === "previewDrafts") {
    queryUrl.searchParams.set("perspective", "previewDrafts");

    if (!process.env.SANITY_API_VIEWER_TOKEN) {
      throw new Error(
        "SANITY_API_VIEWER_TOKEN is required for previewing drafts"
      );
    }

    headers.set(
      "Authorization",
      `Bearer ${process.env.SANITY_API_VIEWER_TOKEN}`
    );
  }

  const { allPost } = await request<AllPost>(
    queryUrl.toString(),
    GET_POST,
    props.params,
    headers
  );

  if (!allPost.length) {
    throw new Response("Not found", { status: 404 });
  }

  return { post: allPost[0] };
}
export default function Index() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto prose prose-lg p-12">
      <h1>{post.title}</h1>
      <p>
        <Link to="/">&larr; Return home</Link>
      </p>
    </div>
  );
}
