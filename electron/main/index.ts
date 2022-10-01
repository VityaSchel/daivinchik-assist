'use strict'

import './.env'
import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { sendLoginCode, enterLoginCode, enterTwoFACode } from './mtproto/index'
import fs from 'fs'
import log from 'electron-log'

log.info('Started Electron app')

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

function createMainWindow() {
  const browserWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true } })

  if (isDevelopment) {
    browserWindow.webContents.openDevTools()
  }

  if (isDevelopment) {
    browserWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    browserWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    )
  }

  browserWindow.on('closed', () => {
    mainWindow = null
  })

  browserWindow.webContents.on('devtools-opened', () => {
    browserWindow.focus()
    setImmediate(() => {
      browserWindow.focus()
    })
  })

  browserWindow.webContents.executeJavaScript(fs.readFileSync(__dirname + '/../classNamesInjector.js', 'utf-8'), false)

  ipcMain.on('login_phone', async (event, phoneNumber: string) => {
    try {
      const result = await sendLoginCode(phoneNumber)
      if(result.error) event.reply('login_phone_result', { error: result.error })
      else event.reply('login_phone_result', { phone_code_hash: result.phone_code_hash })
    } catch(e) {
      log.error('Error while sending code to phone', phoneNumber, JSON.stringify(e))
      event.reply('login_phone_result', { error: JSON.stringify(e) })
    }
  })
  // ipcMain.on('login_code', (_, loginCode: string) => enterLoginCode(loginCode))

  return browserWindow
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})
