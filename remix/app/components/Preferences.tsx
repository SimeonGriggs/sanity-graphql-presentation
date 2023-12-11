// ./app/components/Preferences.tsx

import type { PreferencesCookie } from "~/cookies";

export function Preferences(props: { preferences: PreferencesCookie }) {
  return (
    <form
      method="POST"
      action="/resources/preferences"
      className="container mx-auto flex justify-center gap-2 p-12"
    >
      <button
        type="submit"
        name="perspective"
        value={
          props.preferences.perspective === "previewDrafts"
            ? "published"
            : "previewDrafts"
        }
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Preview Drafts:{` `}
        {props.preferences.perspective === "previewDrafts" ? `On` : `Off`}
      </button>
      <button
        type="submit"
        name="overlays"
        value={props.preferences.overlays === "on" ? "off" : "on"}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Visual Editing:{` `}
        {props.preferences.overlays === "on" ? `On` : `Off`}
      </button>
    </form>
  );
}
