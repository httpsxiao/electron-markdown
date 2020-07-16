import { BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';

export default function initMenu() {
  const currentWindow = BrowserWindow.getFocusedWindow()

  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: '文件',
      submenu: [{
        label: '新建文件',
        accelerator: 'CommandOrControl+N',
        click() {
          currentWindow!.webContents.send('create-file')
        }
      }]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}
