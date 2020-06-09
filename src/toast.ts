import { screen, BrowserWindow } from 'electron'

interface initType {
  width?: number
  height?: number
  wait?: number
}
interface showType {
  content: string
  width?: number
  height?: number
  wait?: number
}

export default class Toast {
  width: number
  height: number
  wait: number

  constructor (option: initType = {}) {
    this.width = option.width || 100
    this.height = option.height || 30
    this.wait = option.wait || 2000
  }

  show (currentWindow: Electron.BrowserWindow, content: string, wait?: number): void
  show (currentWindow: Electron.BrowserWindow, option: showType): void
  show (currentWindow: Electron.BrowserWindow, arg1: string | showType, arg2?: number) {
    const content = typeof arg1 === 'string' ? arg1 : arg1.content
    let { width, height, wait } = this

    if (typeof arg1 === 'object') {
      if (arg1.width) width = arg1.width
      if (arg1.height) height = arg1.height
      if (arg1.wait) wait = arg1.wait
    } else {
      if (arg2) wait = arg2
    }

    const [curX, curY] = currentWindow.getPosition()
    const [curWidth, curHeight] = currentWindow.getSize()
    const x = curX + curWidth / 2 - width / 2
    const y = curY + curHeight / 2 - height / 2
    const browserWindow = new BrowserWindow({
      height,
      width,
      x,
      y,
      modal: true,
      frame: false,
      alwaysOnTop: true,
      opacity: 0.9,
      center: false,
      backgroundColor: '#ccc',
      hasShadow: false,
      show: false
    })

    browserWindow.loadURL(`
      data:text/html;charset=UTF-8,
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              position; relative;
              font-family: monospace, sans-serif;
              font-weight: bold;
              font-size: 14px;
              width: 100%;
              height: 100%;
              padding: 0;
              margin: 0;
            }
            .content {
              position: absolute;
              top: 50%;
              left: 0;
              right: 0;
              text-align: center;
              transform: translateY(-50%);
            }
          </style>
        </head>
        <body>
          <div class="content">
            <span>${content}</span>
          </div>
        </body>
      </html>
    `)
    browserWindow.webContents.closeDevTools()
    browserWindow.on('ready-to-show', () => {
      browserWindow.show()
    })
    setTimeout(() => browserWindow.close(), wait)
  }
}
