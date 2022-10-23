import { createRealmContext } from '@realm/react'
import { Message } from './Message'

export const MessageRealmContext = createRealmContext({
  schema: [Message],
  deleteRealmIfMigrationNeeded: true
})
