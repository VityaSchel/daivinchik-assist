type Peer = object
type MessageFwdHeader = object
type MessageReplyHeader = object
type MessageMedia = object
type ReplyMarkup = object
type MessageEntity = object
type MessageReplies = object
type MessageReactions = object
type RestrictionReason = object

export type Message = {
  _: 'message',
  /** Is this an outgoing message */
  out: boolean
  /** Whether we were mentioned in this message */
  mentioned: boolean
  /** Whether there are unread media attachments in this message */
  media_unread: boolean
  /** Whether this is a silent message (no notification triggered) */
  silent: boolean
  /** Whether this is a channel post */
  post: boolean
  /** Whether this is a scheduled message */
  from_scheduled: boolean
  /** This is a legacy message: it has to be refetched with the new layer */
  legacy: boolean
  /** Whether the message should be shown as not modified to the user, even if an edit date is present */
  edit_hide: boolean
  /** Whether this message is pinned */
  pinned: boolean
  /** Whether this message is protected and thus cannot be forwarded */
  noforwards: boolean
  /** ID of the message */
  id: number
  /** ID of the sender of the message */
  from_id: Peer
  /** Peer ID, the chat where this message was sent */
  peer_id: Peer
  /** Info about forwarded messages */
  fwd_from: MessageFwdHeader
  /** ID of the inline bot that generated the message */
  via_bot_id: string
  /** Reply information */
  reply_to: MessageReplyHeader
  /** Date of the message */
  date: number
  /** The message */
  message: string
  /** Media attachment */
  media: MessageMedia
  /** Reply markup (bot/inline keyboards) */
  reply_markup: ReplyMarkup
  /** Message entities for styled text */
  entities: MessageEntity[]
  /** View count for channel posts */
  views: number
  /** Forward counter */
  forwards: number
  /** Info about post comments (for channels) or message replies (for groups) */
  replies: MessageReplies
  /** Last edit date of this message */
  edit_date: number
  /** Name of the author of this message for channel posts (with signatures enabled) */
  post_author: string
  /** Multiple media messages sent using messages.sendMultiMedia with the same grouped ID indicate an album or media group */
  grouped_id: string
  /** Reactions to this message */
  reactions: MessageReactions
  /** Contains the reason why access to this message must be restricted. */
  restriction_reason: RestrictionReason[]
  /** Time To Live of the message, once message.date+message.ttl_period === time(), the message will be deleted on the server, and must be deleted locally as well. */
  ttl_period: number
}