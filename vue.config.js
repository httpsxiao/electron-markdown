module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.github.httpsxiao.electron-markdown",
        productName: "ElectronMarkdown",
        win: {
          icon: "public/favicon.ico",
          target: [{
            target: "nsis",
            arch: ["ia32"]
          }]
        },
        mac: {
          target: "dmg",
          icon: "public/icon.icns"
        },
        linux: {
          icon: "public/favicon.ico"
        },
        dmg: {
          contents: [
            {
              x: 300,
              y: 200,
              type: "link",
              path: "/Applications",
            },
            {
              x: 130,
              y: 200,
              type: "file",
            }
          ]
        },
        asar: false,
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          installerHeaderIcon: "public/favicon.ico",
          createDesktopShortcut: true,
          shortcutName: "electron markdown"
        }
      }
    }
  }
}
