import store from '../store'
/**
 * 与后端web服务的实时通信模块
 */
class WsMessage {
    socket: WebSocket;
    constructor() {
        this.socket = new WebSocket('ws://127.0.0.1:6877/ws/client');
        this.start()
    }
    start() {
        this.socket.addEventListener('open', function (event) {
            console.log(event)
        });
        this.socket.addEventListener('message', function (event) {
            const message = JSON.parse(event.data); // why `let` build error!!??
            console.log('ws message', message)
            switch (message.type) {
                case 'connect': {
                    console.log('ws connected')
                    break
                }
                case 'render:list-view:update': {
                    store.commit('libScanView/MOVIE_LISTVIEW_UPDATE', message.data)
                    break
                }
                case 'render:list-view:scan-end': {
                    store.commit('libScanView/SET_LIB_SCAN_STATE', message.data)
                    break
                }
                default:
                    console.log('不支持的消息', message)
            }
        });
    }
}

export default new WsMessage;