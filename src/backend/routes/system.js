'use strict'

const router = require("express").Router();
// const Service = require('node-windows').Service;
// const path = require('path')
// const { __fix_dirname } = require('../config')

// // Create a new service object
// var svc = new Service({
//     name: 'Hello World',
//     description: 'The nodejs.org example web server.',
//     script: path.join(__fix_dirname, 'installAsService.bat'),
//     nodeOptions: [
//         '--harmony',
//         '--max_old_space_size=4096'
//     ],
//     workingDirectory: __fix_dirname
//     //, allowServiceLogon: true
// });

// const ServiceInstall = async (req, res, next) => {

//     // Listen for the "install" event, which indicates the
//     // process is available as a service.
//     svc.on('install', function () {
//         console.log('Service install');
//         svc.start();
//     });
//     svc.on('start', function () {
//         console.log('Service started');
//     });
//     svc.on('error', function () {
//         console.log('Service error');
//     });

//     svc.install();
//     res.end("windows service is installing")
// }


// const ServiceUninstall = async (req, res, next) => {
//     // Listen for the "uninstall" event
//     svc.on('uninstall', function () {
//         console.log('Service uninstall');
//     });
//     svc.on('error', function () {
//         console.log('Service error');
//     });

//     svc.uninstall();
//     res.end("windows service is uninstalling")
// }

// router.get("/installAsService", ServiceInstall)
// router.get("/uninstallService", ServiceUninstall)

module.exports = router