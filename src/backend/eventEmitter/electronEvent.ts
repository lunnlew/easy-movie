
import { ipcMain, dialog, app } from "electron";
import { createContextMenu, createSearchAreaMenu } from "../libs/contextMenu"
import { loadConfig } from "../libs/config"
import { setFilterData } from "../libs/filter";
import { InvokeNativeActionParams } from "../types";
import windowControl from "../libs/window";

/**
 * 主线程与渲染进程通信模块
 */

ipcMain.on("invokeNativeAction", (event, params: InvokeNativeActionParams) => {
    var replyMessage = function (uuid: any, result: any) {
        event.sender.send("setActionResult", {
            uuid: uuid,
            result
        })
    }
    switch (params.action) {
        case "loadConfig": {
            loadConfig(event, params, (data: any) => {
                replyMessage(params.uuid, data)
            })
            break
        }
        case "showOpenDialog": {
            dialog.showOpenDialog(params.options).then(result => replyMessage(params.uuid, result))
            break;
        }
        case "showContextMenu": {
            createContextMenu(event, params)
            replyMessage(params.uuid, 'success')
            break
        }
        case "setFilterData": {
            setFilterData(event, params)
            replyMessage(params.uuid, 'success')
            break
        }
        case "showSearchAreaMenu": {
            createSearchAreaMenu(event, params, (data: any) => {
                replyMessage(params.uuid, data)
            })
            break
        }
        case "windowControl": {
            windowControl.dispatch(event, params, (data: any) => {
                replyMessage(params.uuid, data)
            })
            break
        }
        case "closeApp": {
            app.quit();
            replyMessage(params.uuid, 'success')
            break;
        }
        default:
            console.log('不支持的消息', params)
    }
})