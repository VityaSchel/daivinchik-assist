import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper'

export default function AboutDialog(props: { visible: boolean, onHide: () => any }) {
  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={props.onHide}>
        <Dialog.Title>Зачем нужна эта информация?</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Для сохранения конфиденциальности это приложение работает 
            полностью на вашем устройстве, напрямую связываясь с API
            Telegram. Для этого ему необходимы два специальных параметра:
            api_id и api_hash, которые позволят установить связь с MTProto.
          </Paragraph>
          <Paragraph>
            Вводя первый код, вы разрешаете приложению автоматически собрать
            api_id и api_hash из настроек вашего аккаунта для соединения с API Telegram. 
            Они сохраняются только на вашем устройстве и никуда не отправляются.
          </Paragraph>
          <Paragraph>
            Вводя второй код, вы производите вход в аккаунт Telegram с помощью
            API, соединение с которым установили ранее. Второй код позволит
            приложению управлять вашим аккаунтом (читать сообщения), что необходимо
            для работы. Приложение никогда не будет выполнять действий от вашего имени
            без вашего ведома.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.onHide}>Ввести токены вручную</Button>
          <Button onPress={props.onHide}>ОК</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}