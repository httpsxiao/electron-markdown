module.exports = {
  pluginOptions: {
    electronBuilder: {
      appId: 'com.github.httpsxiao.electron-markdown',
      productName: 'electron markdown',
      win: {
        icon: 'public/favicon.ico',
        target: 'nsis',
        arch: [
          'ia32'
        ]
      },
      mac: {
        icon: 'public/icon.icns'
      },
      linux: {
        icon: 'public/favicon.ico'
      },
      dmg: {
        contents: [
          {
            x: 300,
            y: 200,
            type: 'link',
            path: '/Applications'
          },
          {
            x: 130,
            y: 200,
            type: 'file'
          }
        ]
      },
      nsis: {
        oneClick: false,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
        installerHeaderIcon: 'public/favicon.ico',
        createDesktopShortcut: true,
        shortcutName: 'electron markdown'
      }
    }
  }
}
