import { GlobalEventEmitterType } from '@/types/EventEmitter'
import { buildWsMessage } from '../utils'
class RenderMsg {
    event: GlobalEventEmitterType
    ws
    constructor(ws: any, event: GlobalEventEmitterType) {
        this.event = event
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
        this.event.on('render:list-view:update', (payload) => {
            this.ws.send(buildWsMessage('render:list-view:update', payload))
        })
        this.event.on('render:list-view:scan-end', (payload) => {
            this.ws.send(buildWsMessage('render:list-view:scan-end', payload))
        })
    }
}
export default RenderMsg