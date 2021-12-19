


import EventEmitter from 'events'
import application from '../libs/application'
import { ApplicationType } from './Application'
import { CastFields, CastInfo } from './Cast'
import { MovieFileFields } from './Movie'

/**
 *演员on事件数据
 */
export type CastOnEventPayload = Pick<
    CastInfo,
    'name_cn' | 'name_en' | 'avatar' | 'gender' | 'birthday' | 'deathday' | 'place_of_birth' | 'also_known_as' | 'imdb_sid' | 'imdb_id' | 'imdb_url'
> & Pick<CastFields, 'id'> & Pick<MovieFileFields, 'path' | 'resource_type'>

/**
 * 下载演员图片参数
 */
export type CastDownloadAvatorPayload = Pick<CastFields, 'id' | 'imdb_id' | 'imdb_sid'> & Pick<CastInfo, 'avatar'> & Pick<MovieFileFields, 'path' | 'resource_type'>

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