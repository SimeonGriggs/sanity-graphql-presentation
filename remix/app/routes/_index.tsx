// ./app/routes/_index.tsx

import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ContentSourceMap } from "@sanity/client/stega";
import { stegaEncodeSourceMap } from "@sanity/client/stega";
import { rawRequest } from "graphql-request";
import type { PreferencesCookie } from "~/cookies";
import { preferences } from "~/cookies";
import { graphqlUrl } from "~/sanity/projectDetails";
import type { AllPost } from "~/sanity/queries";
import { GET_POSTS } from "~/sanity/queries";

export async function loader(loaderFunctionArgs: LoaderFunctionArgs) {
  const cookieHeader = loaderFunctionArgs.request.headers.get("Cookie");
  const cookie: PreferencesCookie =
    (await preferences.parse(cookieHeader)) || {};

  const queryUrl = new URL(graphqlUrl);
  let headers = new Headers();

  if (cookie.overlays === "on") {
    queryUrl.searchParams.set("resultSourceMap", "true");
  }

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

  const { data, extensions } = await rawRequest<AllPost>(
    queryUrl.toString(),
    GET_POSTS,
    undefined,
    headers
  );

  if (
    typeof extensions === "object" &&
    extensions !== null &&
    "sanitySourceMap" in extensions
  ) {
    const transcoded = stegaEncodeSourceMap<AllPost>(
      data,
      extensions.sanitySourceMap as ContentSourceMap,
      {
        enabled: true,
        studioUrl: "http://localhost:3333",
        filter: (props) => props.filterDefault(props)
      }
    );

    return { allPost: transcoded.allPost };
  }

  return { allPost: data.allPost };
}

export default function Index() {
  const { allPost } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto prose prose-lg p-12">
      <h1>All Posts</h1>
      {allPost.length > 0 ? (
        <ul>
          {allPost.map((post) => (
            <li key={post._id}>
              <a href={`/post/${post.slug.current}`}>{post.title}</a>
              <br />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : null}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
}
