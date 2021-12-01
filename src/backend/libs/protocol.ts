import { app } from "electron";
import path from 'path'

// 移除伪协议注册
app.removeAsDefaultProtocolClient('easy-movie')

if (app.isPackaged) {
    app.setAsDefaultProtocolClient('easy-movie')
} else {
    // 开发环境伪协议注册
    app.setAsDefaultProtocolClient('easy-movie', process.execPath, [
        path.resolve(process.argv[1])
    ])
}