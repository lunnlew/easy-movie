
import { GlobalEventEmitterType } from './EventEmitter'
import { Knex } from 'knex'

/**
 * 应用配置
 */
export type AppConfigType = {
    /**
     * 代理设置
     */
    proxy: string
    /**
     * 服务状态
     */
    serviceState: 'Started' | 'Stopped'
}

/**
 * 全局应用实例类型
 */
export class ApplicationType {
    /**
     * 全局事件实例
     * @type {GlobalEventEmitterType}
     * @memberof ApplicationType
     * @description 全局事件实例
     * @example
     * ```js
     * const app = new Application()
     * app.event.on('test', (data) => {
     *  console.log(data)
     * })
    */
    event: GlobalEventEmitterType;
    /**
     * 数据库实例
     * @type {Knex}
     * @memberof ApplicationType
     * @example
     * const knex = app.get('knex')
     * knex.select('*').from('users').then(users => {
     *  console.log(users)
     * })
     */
    knex: Knex;
    /**
     * 应用配置信息
     * @type {AppConfigType}
     * @memberof ApplicationType
     * @description 应用配置信息
     * @example
     * ```js
     * const app = new Application()
     * app.config.proxy
     * ```
     */
    config: AppConfigType;
    /**
     * 是否开发模式
     */
    isDevelopment: boolean = false;
}