import React from 'react'
import { View, Image, ToastAndroid } from 'react-native'
import { ProgressBar, Button, HelperText, Text } from 'react-native-paper'
import { exportHistory, postProcessMessages, findLeomatchPeer } from '../../../mtproto/importBotHistory'
import AboutDialog from './AboutDialog'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MessageRealmContext } from '../../models'

export default function LoadHistory(props: { onDone: () => any }) {
  const [howItWorksDialogVisible, setHowItWorksDialogVisibility] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<null | string>(null)
  const [progress, setProgress] = React.useState(0)
  const [continueFrom, setContinueFrom] = React.useState<null | { exported: number, max: number, offset: number | undefined }>(null)
  const [state, setState] = React.useState<null | 'downloading' | 'postprocessing'>(null)
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
      setState('downloading')
      await AsyncStorage.setItem('init_history_export_state', 'started')
      const callback = (exported: number, max: number, offset: number) => {
        setProgress(exported / max)
        AsyncStorage.setItem('init_history_exported_msgs_process', JSON.stringify({ exported, max, offset }))
      }
      const { abort } = exportHistory(result.peer, callback, continueFrom?.offset, finishedDownloading)
      
      // Dirty trick that pollutes global space.
      // TODO: Replace and avoid
      global.__INIT_LOAD_HISTORY_ABORT = abort
    }
  }

  React.useEffect(() => { checkState() }, [])

  const checkState = async () => {
    setLoading(true)
    const savedState = await AsyncStorage.getItem('init_history_export_state')
    switch(savedState) {
      case 'started':
        resumeDownloading()
        break
      
      case 'finished':
        props.onDone()
        break

      case 'postprocessing':
        finishedDownloading()
        break
      
      default:
        setContinueFrom(null)
        break 
    }
    setLoading(false)
  }

  const resumeDownloading = async () => {
    const dataRaw = await AsyncStorage.getItem('init_history_exported_msgs_process')
    if(!dataRaw) {
      setContinueFrom(null)
      return
    }

    try {
      const data = JSON.parse(dataRaw)
      if(Number(data.exported) >= Number(data.max)) {
        finishedDownloading()
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

  const stopLoading = () => {
    global['__INIT_LOAD_HISTORY_ABORT']?.()
    setState(null)
    checkState()
  }

  const finishedDownloading = async () => {
    await AsyncStorage.setItem('init_history_export_state', 'postprocessing')
    setState('postprocessing')
    setLoading(true)
    postProcessMessages(finishedPostProcessing, error => ToastAndroid.show(`Ошибка во время обработки: ${error}`, 1))
  }

  const finishedPostProcessing = async () => {
    await AsyncStorage.setItem('init_history_export_state', 'finished')
    console.log(realm.objects('Message'))
    setState(null)
    setLoading(true)
    props.onDone()
  }
  
  return (
    <View style={{ marginTop: 50 }}>
      {state === null && (
        <>
          <Text variant='headlineMedium' style={{ fontWeight: 'bold' }}>Настройка приложения</Text>
          <Text style={{ marginVertical: 10 }}>
            Для того, чтобы приложение могло работать, ему необходимо скачать историю чата с ботом. 
            История никуда не отправляется и остается в пределах этого устройства. Подробнее читайте ниже.
          </Text>
        </>
      )}
      {state === null && (
        continueFrom === null 
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
      )}
      {Boolean(error) && <HelperText type='error' visible={Boolean(error)}>{error}</HelperText>}
      {state === 'downloading' && (
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
      {state === 'postprocessing' && (
        <>
          <Text variant='headlineLarge' style={{ fontWeight: 'bold' }}>Обработка...</Text>
          <Text variant='labelMedium' style={{ marginVertical: 10 }}>Это не займет много времени</Text>
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
        onPress={() => finishedDownloading()}
        style={{ marginTop: 10 }}
      >[[ Finish downloading ]]</Button>
    </View>
  )
}