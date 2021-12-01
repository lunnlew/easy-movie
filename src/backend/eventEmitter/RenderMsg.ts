import { buildWsMessage } from '../utils'
import { GlobalEventType } from './GlobalEventEmitter'
class RenderMsg {
    eventEmitter
    ws
    constructor(ws: any, eventEmitter: GlobalEventType) {
        this.eventEmitter = eventEmitter
        this.ws = ws
        this.initialize()
    }
    async initialize() {
        this.ws.send(JSON.stringify({
            'type': 'connect',
            'data': 'success'
        }))
        this.ws.on('message', function () { })
        this.ws.on('close', function () { })
        this.eventEmitter.on('render:list-view:update', (payload) => {
            this.ws.send(buildWsMessage('render:list-view:update', payload))
        })
        this.eventEmitter.on('render:list-view:scan-end', (payload) => {
            this.ws.send(buildWsMessage('render:list-view:scan-end', payload))
        })
    }
}
export default RenderMsg