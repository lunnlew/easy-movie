"use strict";

import { app, Menu, Tray, MenuItem, protocol, BrowserWindow } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import windowControl from './backend/libs/window'
import UpdateControl from './backend/libs/update'
import path from 'path'

type globalWin = BrowserWindow | null
declare const __static: string

const isDevelopment = process.env.NODE_ENV !== "production";
let isQuit = false
let _globalWin: globalWin



// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  let win: globalWin = windowControl.createBrowserWindow(null, {
    options: {
      width: 1120,
      height: 760,
      frame: false,
      show: false,
      isMain: true,
      enableDevTools: process.env.WEBPACK_DEV_SERVER_URL && !process.env.IS_TEST,
      // route: 'setting.html',
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION == 'true',
        contextIsolation: false,
      },
    }
  })

  win.on('close', (e: { preventDefault: () => void; }) => {
    if (isQuit) {
      win = null
    } else {
      e.preventDefault()
      win?.hide()
    }
  })

  win.on('closed', () => {
    win = null
    tray = null
  })

  _globalWin = win
}

let tray = null
function createTray() {
  tray = new Tray(path.resolve(__static, 'icon.png')) // 设置托盘图标  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Toggle DevTools',
      click: function () {
        _globalWin?.show();
        _globalWin?.webContents.toggleDevTools();
      }
    },
    new MenuItem({
      label: '退出程序',
      click: () => {
        isQuit = true
        app.exit()
      }
    })
  ])
  tray.setToolTip('影视管理');
  tray.setContextMenu(contextMenu) // 设置右键菜单
  tray.on('click', () => { // 托盘点击事件    
    if (_globalWin?.isVisible()) {
      _globalWin?.focus()
    } else {
      _globalWin?.show()
    }
  })
}

// 设置菜单栏
function createMenu() {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === 'darwin') {
    const template = [{
      label: '影视管理',
      submenu: [{
        role: 'about'
      },
      {
        role: 'quit'
      }
      ]
    }] as any
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    // windows及linux系统
    Menu.setApplicationMenu(null)
  }
}

function createBackendService() {
  // 创建一个服务
  require('./backend')
}
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
  _globalWin = null
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e: any) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
  createMenu();
  createTray();
  createBackendService();
  new UpdateControl(_globalWin);
});


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
