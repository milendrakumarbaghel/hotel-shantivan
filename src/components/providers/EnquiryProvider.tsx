import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { buildGeneralEnquiryMessage, buildRoomEnquiryMessage } from '../../lib/messages'
import { openExternal, whatsappUrl } from '../../lib/contact'
import { EnquiryContext, useScrollApi } from './contexts'

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const { scrollToId } = useScrollApi()
  const [preferredRoom, setPreferredRoom] = useState('')

  const enquireRoom = useCallback(
    (label: string) => {
      setPreferredRoom(label)
      const url = whatsappUrl(buildRoomEnquiryMessage(label))
      if (url) openExternal(url)
      else scrollToId('contact')
    },
    [scrollToId],
  )

  const enquireGeneral = useCallback(() => {
    const url = whatsappUrl(buildGeneralEnquiryMessage())
    if (url) openExternal(url)
    else scrollToId('contact')
  }, [scrollToId])

  const value = useMemo(
    () => ({ preferredRoom, setPreferredRoom, enquireRoom, enquireGeneral }),
    [preferredRoom, enquireRoom, enquireGeneral],
  )
  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
}
