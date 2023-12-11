// ./app/components/VisualEditing.tsx

import {useLocation, useNavigate} from '@remix-run/react'
import type {HistoryUpdate} from '@sanity/overlays'
import {enableOverlays} from '@sanity/overlays'
import {useEffect, useRef} from 'react'

type VisualEditingProps = {
  studioUrl: string
}

// Default export required for React Lazy loading
// eslint-disable-next-line import/no-default-export
export default function VisualEditing({studioUrl}: VisualEditingProps) {
  const navigateRemix = useNavigate()
  const navigateComposerRef = useRef<null | ((update: HistoryUpdate) => void)>(
    null,
  )

  useEffect(() => {
    // When displayed inside an iframe
    if (window.parent !== window.self) {
      const disable = enableOverlays({
        allowStudioOrigin: studioUrl,
        zIndex: 999999,
        history: {
          subscribe: (navigate) => {
            navigateComposerRef.current = navigate
            return () => {
              navigateComposerRef.current = null
            }
          },
          update: (update) => {
            if (update.type === 'push' || update.type === 'replace') {
              navigateRemix(update.url, {replace: update.type === 'replace'})
            } else if (update.type === 'pop') {
              navigateRemix(-1)
            }
          },
        },
      })
      return () => disable()
    }
  }, [navigateRemix, studioUrl])

  const location = useLocation()
  useEffect(() => {
    if (navigateComposerRef.current) {
      navigateComposerRef.current({
        type: 'push',
        url: `${location.pathname}${location.search}${location.hash}`,
      })
    }
  }, [location.hash, location.pathname, location.search])

  return null
}
