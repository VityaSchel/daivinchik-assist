import React from 'react'
import { ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'
import { MessageRealmContext } from '../../../models'
import type { MessageFields } from '../../../models/Message'
import type { ProfileType } from './index'
import { format } from 'date-fns'
import { default as dateFnsRu } from 'date-fns/locale/ru'
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default function InteractionsHistory(props: { data: ProfileType }) {
  const realm = MessageRealmContext.useRealm()
  const history = realm.objects('Message')
    .filtered('text = $0', props.data.fullText)
    .sorted([['messageID', true]]) as unknown as MessageFields[]

  return (
    <View style={styles.interactions}>
      <Text variant='titleMedium'>История взаимодействий:</Text>
      <ScrollView style={history.length ? styles.history : {}}>
        {history.length === 0
          ? <Text variant='bodyMedium'>Вы еще не встречали эту анкету</Text>
          : history.map(entry => (
            <View style={styles.historyEntry} key={entry._id.toHexString()}>
              <Text><Icon name='calendar-account'/> {format(entry.date * 1000, 'dd MMMM yyyy, HH:mm', { locale: dateFnsRu })}</Text>
              <Text>Вы {{'liked': '❤️ лайкнули', 'disliked': '👎 дизлайкнули'}[entry.info.response]??'💤 пропустили'} анкету</Text>
            </View>
          ))
        }
      </ScrollView>
    </View>
  )
}