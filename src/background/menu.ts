import { BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import { createWindow } from '../background'

export default function initMenu() {
  const currentWindow = BrowserWindow.getFocusedWindow()

  if (!currentWindow) return

  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: '文件',
      submenu: [{
        label: '新建文件',
        accelerator: 'CommandOrControl+N',
        click() {
          currentWindow.webContents.send('menu-create-file')
        }
      }, {
        label: '打开文件',
        accelerator: 'CommandOrControl+O',
        click() {
          currentWindow.webContents.send('menu-open-file')
        }
      }, {
        label: '保存文件',
        accelerator: 'CommandOrControl+S',
        click() {
          currentWindow.webContents.send('menu-save-file')
        }
      }, {
        label: '移除文件',
        accelerator: 'CommandOrControl+D',
        click() {
          currentWindow.webContents.send('menu-remove-file')
        }
      }]
    },
    {
      label: '窗口',
      submenu: [{
        label: '新建窗口',
        accelerator: 'CommandOrControl+W',
        click() {
          createWindow(true)
        }
      }, {
        label: '关闭当前窗口',
        accelerator: 'CommandOrControl+E',
        click() {
          currentWindow.webContents.send('close')
        }
      }]
    },
    {
      label: '导出',
      submenu: [{
        label: '导出HTML',
        accelerator: 'CommandOrControl+H',
        click() {
          currentWindow.webContents.send('menu-save-html')
        }
      }]
    },
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}
