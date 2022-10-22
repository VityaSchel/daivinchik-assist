import { Realm } from '@realm/react'

export class Message extends Realm.Object {
  _id!: Realm.BSON.ObjectId
  text!: string

  static generate(message: object) {
    return {
      _id: new Realm.BSON.ObjectId(),
      text
    }
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      text: 'string'
    },
  }
}
