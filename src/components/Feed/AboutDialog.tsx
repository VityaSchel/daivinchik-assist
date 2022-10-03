import { ScrollView } from 'react-native'
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { resetNavigationWithHistory } from '../../../utils'

export default function AboutDialog(props: { visible: boolean, onHide: () => any }) {
  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={props.onHide}>
        <Dialog.Title>Как это работает?</Dialog.Title>
        <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
          <ScrollView contentContainerStyle={{ paddingVertical: 18 }}>
            <Dialog.Content>
              <Paragraph>
                Для того, чтобы не искать каждый раз историю анкеты через встроенный в 
                API Telegram метод messages.search (и сэкономить трафик, лимиты и время работы),
                наше умное приложение сохранит всю историю общения с ботом Дайвинчик в локальную
                базу данных. Если у тебя меньше 20 000 сообщений, то беспокоиться не о чем. В
                противном случае, бот сохранит только 4 мб данных с учетом сжатия.
              </Paragraph>
              <Paragraph>
                После скачивания истории общения с ботом, приложение проанализирует данные и создаст
                базу данных, чтобы в будущем мы могли мгновенно искать по ней анкеты по ключевым словам.
              </Paragraph>
              <Paragraph>
                Как и со всеми остальными собираемыми данными, все процессы работают внутри твоего 
                устройства, а данные никуда не отправляются и хранятся только в локальном хранилище.
              </Paragraph>
            </Dialog.Content>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button 
            onPress={props.onHide}
          >ОК</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}