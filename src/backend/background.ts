import path from "path";
import fs from "fs";
import { app, BrowserWindow, Menu, protocol, session } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import windowControl from "./libs/window";
import proxyControl from "./libs/proxy";
import TrayControl from "./libs/tray";
const isDevelopment = process.env.NODE_ENV == "development";
/**
 * 支持的用户配置
 */
type UserProfile = {
  proxy: string;
};
/**
 * 主进程入口
 */
class EasyMovieApp {
  userProfile: UserProfile;
  mainWin;
  tray: TrayControl;
  constructor() {
    this.registerProtocol();
    this.loadUserProfile();
    this.createApp();
  }
  /**
   * 注册协议
   */
  registerProtocol() {
    // Scheme must be registered before the app is ready
    protocol.registerSchemesAsPrivileged([
      { scheme: "app", privileges: { secure: true, standard: true } },
    ]);
    // 移除伪协议注册
    app.removeAsDefaultProtocolClient("easy-movie");
    if (app.isPackaged) {
      app.setAsDefaultProtocolClient("easy-movie");
    } else {
      // 开发环境伪协议注册
      app.setAsDefaultProtocolClient("easy-movie", process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  }
  /**
   * 加载用户配置
   */
  loadUserProfile() {
    let userProfilePath = path.join(
      app.getPath("userData"),
      "user-profile.json"
    );
    console.log("load profile", userProfilePath);
    if (fs.existsSync(userProfilePath)) {
      this.userProfile = JSON.parse(fs.readFileSync(userProfilePath, "utf-8"));
    } else {
      this.userProfile = {} as any;
      fs.writeFileSync(userProfilePath, JSON.stringify(this.userProfile));
    }
  }
  /**
   * 创建菜单
   */
  createMenu() {
    // darwin表示macOS，针对macOS的设置
    if (process.platform === "darwin") {
      const template = [
        {
          label: "影视管理",
          submenu: [
            {
              role: "about",
            },
            {
              role: "quit",
            },
          ],
        },
      ] as any;
      let menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    } else {
      // windows及linux系统
      Menu.setApplicationMenu(null);
    }
  }
  /**
   * 加载后台主程序
   */
  loadBackendApp() {
    require("./index");
    const { default: update } = require("./libs/update")
    update.init()
    const { default: invokeAction } = require("./eventEmitter/invokeAction")
    invokeAction.init();
  }
  /**
   * 准备应用
   */
  createApp() {
    console.log("create app");
    proxyControl.setAppProxy(this.userProfile.proxy);
    this.initDevelopment();
    app.on("ready", async () => {
      console.log("app ready");
      this.createWindow().then(() => {
        this.createMenu();
        this.tray = new TrayControl();
        this.loadBackendApp();
      });
    });
    app.on('session-created', session => {
      proxyControl.setSessionProxy(session, this.userProfile.proxy);
    })

    // Quit when all windows are closed.
    app.on("window-all-closed", () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== "darwin") {
        app.quit();
      }
      this.mainWin = null;
    });

    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) this.createWindow();
    });
  }
  /**
   * 创建主窗口
   * @returns 
   */
  async createWindow() {
    this.mainWin = windowControl.createBrowserWindow(null, {
      options: {
        width: 1120,
        height: 760,
        frame: false,
        show: false,
        isMain: true,
        skipTaskbar: false,
        enableDevTools: isDevelopment,
        // route: 'setting.html'
      },
    });

    this.mainWin.on("close", (e: { preventDefault: () => void }) => {
      if (this.tray?.isQuit) {
        this.mainWin = null;
      } else {
        e.preventDefault();
        this.mainWin?.hide();
      }
    });

    this.mainWin.on("closed", () => {
      this.mainWin = null;
      this.tray?.destroy();
    });
    return this.mainWin;
  }
  /**
   * 设置开发环境
   */
  initDevelopment() {
    app.on("ready", async () => {
      console.log("init development");
      if (isDevelopment) {
        // Install Vue Devtools
        try {
          await installExtension(VUEJS3_DEVTOOLS);
        } catch (e: any) {
          console.error("Vue Devtools failed to install:", e.toString());
        }
      }
    });
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
  }
}
new EasyMovieApp();
