const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (action, options) => {
        ipcRenderer.send(action, options)
    },
    on: (action, callback) => {
        ipcRenderer.on(action, callback)
    }
})