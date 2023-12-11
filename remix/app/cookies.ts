// ./app/cookies.ts

import { createCookie } from "@remix-run/node";

export const preferences = createCookie("preferences", {
  maxAge: 604_800,
});

export type PreferencesCookie = {
  perspective: "previewDrafts" | "published" | "raw";
  overlays: "on" | "off";
};
