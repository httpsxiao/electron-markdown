'use strict'

import fs from 'fs'
import { app, protocol, BrowserWindow, ipcMain, dialog, BrowserView } from 'electron'
import Toast from './background/toast'
import initMenu from './background/menu'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

const toast = new Toast({
  width: 150
})

const windows = new Set<BrowserWindow>()
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow (createByMenu = false) {
  // Create the browser window.
  let win: BrowserWindow | null = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    if (createByMenu) {
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '?menu=1' as string)
    } else {
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    }
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    if (createByMenu) {
      win.loadURL('app://./index.html?menu=1')
    } else {
      win.loadURL('app://./index.html')
    }
  }

  win.once('ready-to-show', () => {
    win && win.show()
  })

  win.on('focus', () => initMenu())

  win.on('close', event => {
    event.preventDefault()
    win && win.webContents.send('close')
  })

  win.on('closed', () => {
    windows.delete(win!)
    win = null
  })

  windows.add(win)

  return win
}

ipcMain.on('show-toast', (event, content: string) => {
  const eventWindow = BrowserWindow.fromWebContents(event.sender)
  toast.show(eventWindow, content)
})

// 打开文件
// ipcMain.on('open-file', async event => {
//   const eventWindow = BrowserWindow.fromWebContents(event.sender)
//   const result = await dialog.showOpenDialog(eventWindow, {
//     properties: ['openFile'],
//     filters: [{ name: 'markdown', extensions: ['md', 'markdown'] }]
//   })

//   if (!result.canceled && result.filePaths && result.filePaths[0]) {
//     const content = fs.readFileSync(result.filePaths[0], 'utf-8')
//     event.reply('opened-file', result.filePaths[0], content)
//   }
// })

// 保存文件
ipcMain.on('save-file', async (event, content, filePath) => {
  if (filePath) {
    fs.writeFileSync(filePath, content)
    event.reply('saved-file')
    return
  }
  const eventWindow = BrowserWindow.fromWebContents(event.sender)
  const result = await dialog.showSaveDialog(eventWindow, {
    title: '保存文件',
    filters: [{ name: '文件', extensions: ['md', 'markdown'] }]
  })
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, content)
    event.reply('saved-file', result.filePath)
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', (event, hasVisibleWindows) => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (!hasVisibleWindows) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
  initMenu()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

export {
  createWindow
}
