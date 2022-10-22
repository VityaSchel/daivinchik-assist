import { Realm } from '@realm/react'

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
}

export class Message extends Realm.Object {
  _id!: Realm.BSON.ObjectId
  type!: BotMessageType
  text!: string

  static generate(message: object): MessageFields {
    return {
      _id: new Realm.BSON.ObjectId(),
      type: message['out'] ? 'unknown' : detectMessageType(message),
      text: message['message']
    }
  }

  static schema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      type: 'string',
      text: 'string'
    },
  }
}

function detectMessageType(message: object): BotMessageType {
  if(new RegExp(incomingLikeMessageRegex).test(message['message'])) {
    return 'incoming_like'
  } else if(new RegExp(userProfileRegex).test(message['message'])) {
    return 'candidate_profile'
  } else if(new RegExp(likeResponseRegex).test(message['message'])) {
    return 'like_response'
  } else {
    return 'unknown'
  }
}