import { Realm } from '@realm/react'
import type { Message as MTProtoMessage } from '../ts/MessageSchema'

type BotMessageType = 
  /** Reserved for future use */
    'interface'
  /** "Кому-то понравилась твоя анкета(и еще 2)" */
  | 'incoming_like' 
  /** "Отлично! Надеюсь хорошо проведете время ;) Начинай общаться 👉" */
  | 'like_response'
  /** Reserved for future use */
  | 'ads'
  /** "Имя, 📍900м — Описание" */
  | 'candidate_profile'
  /** Reserved for future use */
  | 'self_profile'
  /** Reserved for future use */
  | 'self_profile_setup_age_question'
  /** Reserved for future use */
  | 'self_profile_setup_age_answer'
  /** Reserved for future use */
  | 'self_profile_setup_target_sex_question'
  /** Reserved for future use */
  | 'self_profile_setup_target_sex_answer'
  /** Reserved for future use */
  | 'self_profile_setup_city_question'
  /** Reserved for future use */
  | 'self_profile_setup_city_answer'
  /** Reserved for future use */
  | 'self_profile_setup_name_question'
  /** Reserved for future use */
  | 'self_profile_setup_name_answer'
  /** Any other type that could not be detected. Must be ignored */
  | 'unknown'

const userProfileRegex = '^(.+?), (\\d+), (.+?)( – ([\\s\\S]+?))?(\\n\\nСообщение для тебя💌: ([\\s\\S]+))?$'
const incomingLikeMessageRegex = '^Кому-то понравилась твоя анкета(:|\\(и еще \\d+\\))?\n\n' + userProfileRegex
const likeResponseRegex = '^Отлично! Надеюсь хорошо проведете время ;\\) Начинай общаться 👉 (.+)$'

interface MessageFields {
  _id: Realm.BSON.ObjectId
  type: BotMessageType
  text: string
  messageID: number
}

export class Message extends Realm.Object {
  _id!: Realm.BSON.ObjectId
  type!: BotMessageType
  text!: string
  messageID!: number

  static generate(message: MTProtoMessage): MessageFields {
    return {
      _id: new Realm.BSON.ObjectId(),
      type: message.out ? 'unknown' : detectMessageType(message),
      text: message.message,
      messageID: message.id
    }
  }

  static schema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      type: 'string',
      text: 'string',
      messageID: 'int'
    },
  }
}

function detectMessageType(message: MTProtoMessage): BotMessageType {
  if(new RegExp(incomingLikeMessageRegex).test(message['message'])) {
    return 'incoming_like'
  } else if(new RegExp(userProfileRegex).test(message['message'])) {
    // const previousMessage = getPreviousMessage(message)
    // console.log(message.id, message.message, previousMessage)
    // if(previousMessage && previousMessage.text === 'Так выглядит твоя анкета:') {
    //   return 'self_profile'
    // } else {
    //   return 'candidate_profile'
    // }
    // TODO: write post-processing logic to separate 'candidate_profile' and 'self_profile'
    return 'candidate_profile'
  } else if(new RegExp(likeResponseRegex).test(message['message'])) {
    return 'like_response'
  } else {
    return 'unknown'
  }
}

function getPreviousMessage(currentMessage: MTProtoMessage): MessageFields | undefined {
  const realm: Realm = global.realm
  const previousMessage = realm.objects('Message')
    .filtered(`messageID < ${currentMessage.id}`)
    .sorted([['messageID', true]])
    .slice(0, 1)[0] as unknown as MessageFields | undefined

  return previousMessage
}