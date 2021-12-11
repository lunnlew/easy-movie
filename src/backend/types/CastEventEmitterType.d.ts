


import EventEmitter from 'events'
import application from '../libs/application'
import { ApplicationType } from './Application'
import { CastFields, CastInfo } from './Cast'

/**
 *演员on事件数据
 */
export type CastOnEventPayload = Pick<
    CastInfo,
    'name' | 'avatar' | 'gender' | 'birthday' | 'deathday' | 'place_of_birth' | 'also_known_as' | 'imdb_sid' | 'imdb_id' | 'imdb_url'
> & Pick<CastFields, 'id'>

/**
 * 下载演员图片参数
 */
export type CastDownloadAvatorPayload = Pick<CastFields, 'id'> & Pick<CastInfo, 'avatar'>

/**
 *演员相关事件数据MAP
 */
interface CastEventMap {
    /**
     * 保存演员信息
     */
    'cast:save-info': CastOnEventPayload
    /**
     * 下载演员图片
     */
    'cast:download-avator': CastDownloadAvatorPayload
}

/**
 * 演员相关消息事件
 */
export class CastEventEmitterType {
    app: ApplicationType
    constructor(): this;
}