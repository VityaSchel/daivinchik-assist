import electron from 'electron'
export { electron }

export const usingElectron = electron !== null

export function subscribeEffect(channelName: string, callback: () => any) {
  return () => {
    if(electron) {
      electron.ipcRenderer.on(channelName, callback)

      return () => {
        electron.ipcRenderer.removeListener(channelName, callback)
      }
    }
  }
}