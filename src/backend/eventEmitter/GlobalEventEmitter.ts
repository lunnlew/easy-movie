
import EventEmitter from 'events'

/**
 * 全局事件实例
 */
class GlobalEventEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

export default new GlobalEventEmitter()