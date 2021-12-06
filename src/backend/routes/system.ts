'use strict'
import Router from 'express'
import path from 'path'
import WinswWrapper, { WinswWrapperOptions } from 'winsw-wrapper'
import { __fix_dirname, home_dir } from '../preference';
import { app } from "electron";
import application from '../libs/application';
const router = Router()

const svc = new WinswWrapper({
    id: 'my-service',
    name: 'my-service',
    description: 'My Service',
    executable: process.execPath,
} as WinswWrapperOptions)
svc.arguments(app.getAppPath())
svc.arguments('--AsService')
svc.env('SQLITE_PATH', path.join(home_dir, 'data.db'))
svc.env('PROFILE_PATH', path.join(
    app.getPath("userData"),
    "user-profile.json"
))
// 注意: 服务模式下好像不能使用默认的系统代理，只能使用自定义的代理
svc.env('PROXY', application.getProxy())


const ServiceInstall = async (req, res, next) => {

    // Listen for the "install" event, which indicates the
    // process is available as a service.
    svc.once('install', function (data) {
        if (data.state == 'success') {
            console.log('Service installed');
            svc.start();
        } else {
            console.log('Service install error');
            res.end('Service install error')
        }
    });
    svc.once('start', function (data) {
        if (data.state == 'success') {
            console.log('Service started');
            res.end('Service started')
        } else {
            console.log('Service start error');
            res.end('Service start error')
        }
    });
    svc.once('error', function () {
        console.log('Service error');
        res.end('Service error')
    });

    svc.install();
}


const ServiceUninstall = async (req, res, next) => {
    // Listen for the "uninstall" event
    svc.once('stop', function (data) {
        if (data.state == 'success') {
            console.log('Service stopped');
            svc.uninstall();
        } else {
            console.log('Service stop error')
            res.end('Service stop error')
        }
    });
    svc.once('uninstall', function (data) {
        if (data.state == 'success') {
            console.log('Service uninstalled');
            res.end('Service uninstalled')
        } else {
            console.log('Service uninstall error');
            res.end('Service uninstall error')
        }
    })
    svc.once('error', function () {
        console.log('Service error');
        res.end('Service error')
    });

    svc.stop();
}

const ServiceStatus = async (req, res, next) => {
    svc.once('status', function (data) {
        if (data.state == 'success') {
            console.log('Service status: ' + data.data);
            res.end(data.data)
        } else {
            console.log('Service status error');
            res.end('Service status error')
        }
    })
    svc.once('error', function (data) {
        console.log('Service error', data);
        res.end('Service error')
    });
    svc.status()
}

router.get("/installAsService", ServiceInstall)
router.get("/serviceStatus", ServiceStatus)
router.get("/uninstallService", ServiceUninstall)

export default router