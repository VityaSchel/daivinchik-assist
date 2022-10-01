import electron from 'electron'
export { electron }

export const usingElectron = electron.app !== undefined

export function subscribeEffect(channelName: string, callback: (...args: any) => any) {
  return () => {
    if(usingElectron) {
      electron.ipcRenderer.on(channelName, callback)

      return () => {
        electron.ipcRenderer.removeListener(channelName, callback)
      }
    }
  }
}