import React from 'react'
import { View, Image } from 'react-native'
import { ProgressBar, Button, HelperText, Text } from 'react-native-paper'
import { exportHistory, findLeomatchPeer } from '../../../mtproto/importBotHistory'
import AboutDialog from './AboutDialog'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MessageRealmContext } from '../../models'

export default function LoadHistory(props: { onDone: () => any }) {
  const [howItWorksDialogVisible, setHowItWorksDialogVisibility] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<null | string>(null)
  const [progress, setProgress] = React.useState(0)
  const [continueFrom, setContinueFrom] = React.useState<null | { exported: number, max: number, offset: number | undefined }>(null)
  const [exporting, setExporting] = React.useState(false)
  const realm = MessageRealmContext.useRealm()

  const loadHistory = async () => {
    setLoading(true)
    setError(null)

    const result = await findLeomatchPeer()
    if(result.error) {
      setLoading(false)
      setError({
        'unable_to_resolve_peer': 'Не удалось получить peer бота Дайвинчик. Возможно, он был удален из Telegram или вы используете устаревшую версию приложения.'
      }[result.error] ?? result.error)
    } else {
      setExporting(true)
      await AsyncStorage.setItem('init_history_export_state', 'started')
      const callback = (exported: number, max: number, offset: number) => {
        setProgress(exported / max)
        AsyncStorage.setItem('init_history_exported_msgs_process', JSON.stringify({ exported, max, offset }))
      }
      const { abort, promise } = exportHistory(result.peer, callback, continueFrom?.offset)
      // Dirty trick that pollutes global space.
      // TODO: Replace and avoid
      global.__INIT_LOAD_HISTORY_ABORT = abort
      promise.then(finished)
    }
  }

  React.useEffect(() => { checkState() }, [])

  const checkState = async () => {
    setLoading(true)
    const state = await AsyncStorage.getItem('init_history_export_state')
    if(state === 'started') {
      const dataRaw = await AsyncStorage.getItem('init_history_exported_msgs_process')
      if(!dataRaw) {
        setContinueFrom(null)
      } else {
        try {
          const data = JSON.parse(dataRaw)
          if(Number(data.exported) >= Number(data.max)) {
            finished()
          } else {
            setContinueFrom({
              exported: Number(data.exported) || 0,
              max: Number(data.max) || 1,
              offset: Number(data.offset) || undefined
            })
          }
        } catch(e) {
          setContinueFrom(null)
        }
      }
    } else if (state === 'finished') {
      props.onDone()
    } else {
      setContinueFrom(null)
    }
    setLoading(false)
  }

  const stopLoading = () => {
    global['__INIT_LOAD_HISTORY_ABORT']?.()
    setExporting(false)
    checkState()
  }

  const finished = async () => {
    await AsyncStorage.setItem('init_history_export_state', 'finished')
    setExporting(false)
    setLoading(true)
    props.onDone()
  }

  const _dev_clearStorage = () => {
    AsyncStorage.removeItem('init_history_export_state')
    AsyncStorage.removeItem('init_history_exported_msgs_process')
    realm.write(() => {
      realm.delete(realm.objects('Message'))
    })
  }
  
  return (
    <View style={{ marginTop: 50 }}>
      {!exporting && (
        <>
          <Text variant='headlineMedium' style={{ fontWeight: 'bold' }}>Настройка приложения</Text>
          <Text style={{ marginVertical: 10 }}>
            Для того, чтобы приложение могло работать, ему необходимо скачать историю чата с ботом. 
            История никуда не отправляется и остается в пределах этого устройства. Подробнее читайте ниже.
          </Text>
        </>
      )}
      {!exporting && 
      (continueFrom === null 
        ? (
          <Button 
            mode='contained'
            onPress={loadHistory}
            disabled={loading}
          >
            Начать загрузку
          </Button>
        ) : (
          <Button 
            mode='contained'
            onPress={loadHistory}
            disabled={loading}
          >
            Продолжить загрузку ({Math.floor(continueFrom.exported/continueFrom.max*100)}%)
          </Button>
        )
      )
      }
      {Boolean(error) && <HelperText type='error' visible={Boolean(error)}>{error}</HelperText>}
      {exporting && (
        <>
          <Text variant='headlineLarge' style={{ fontWeight: 'bold' }}>Загрузка ({(progress * 100).toFixed(2)}%)</Text>
          <ProgressBar progress={progress} style={{ marginTop: 10, height: 10, marginBottom: 30 }} />
          <Button 
            mode='contained-tonal'
            onPress={stopLoading}
            style={{ marginBottom: 50 }}
          >
            Остановить
          </Button>
        </>
      )}
      <Button 
        mode='outlined'
        onPress={() => setHowItWorksDialogVisibility(true)}
        style={{ marginTop: 10 }}
      >Как это работает?</Button>
      <AboutDialog visible={howItWorksDialogVisible} onHide={() => setHowItWorksDialogVisibility(false)} />
      <Button 
        mode='outlined'
        onPress={() => _dev_clearStorage()}
        style={{ marginTop: 10 }}
      >[[ undo ]]</Button>
    </View>
  )
}