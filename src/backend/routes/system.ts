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
    svc.on('install', function () {
        console.log('Service install');
        svc.start();
    });
    svc.on('start', function () {
        console.log('Service started');
    });
    svc.on('error', function () {
        console.log('Service error');
    });

    svc.install();
    res.end("windows service is installing")
}


const ServiceUninstall = async (req, res, next) => {
    // Listen for the "uninstall" event
    svc.on('stop', function () {
        console.log('Service stopped');
        svc.uninstall()
    });
    svc.on('uninstall', function () {
        console.log('Service uninstall');
    })
    svc.on('error', function () {
        console.log('Service error');
    });

    svc.stop();
    res.end("windows service is uninstalling")
}

router.get("/installAsService", ServiceInstall)
router.get("/uninstallService", ServiceUninstall)

export default router