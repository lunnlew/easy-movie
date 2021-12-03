"use strict";

import { app, Menu, protocol, BrowserWindow } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import windowControl from './libs/window'
import TrayControl from './libs/tray'
import updateControl from './libs/update'
import invokeAction from "./eventEmitter/invokeAction";
import './libs/protocol'
import { __app_path, __fix_dirname } from "./config";

type globalWin = BrowserWindow | null

const isDevelopment = process.env.NODE_ENV == "development";
let tray: TrayControl | null = null
let _globalWin: globalWin | null = null

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
      skipTaskbar: false,
      enableDevTools: isDevelopment,
      // route: 'setting.html'
    }
  })

  win.on('close', (e: { preventDefault: () => void; }) => {
    if (tray?.isQuit) {
      win = null
    } else {
      e.preventDefault()
      win?.hide()
    }
  })

  win.on('closed', () => {
    win = null
    tray?.destroy()
  })

  _globalWin = win

  return win
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
  require('./index')
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
  createWindow().then(() => {
    tray = new TrayControl()
    invokeAction.init()
    createMenu()
    createBackendService()
    // if (!isDevelopment) {
    updateControl.init()
    // }
  });
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
