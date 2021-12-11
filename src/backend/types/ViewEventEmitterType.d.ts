


import EventEmitter from 'events'
import application from '../libs/application'
import { ApplicationType } from './Application'


/**
 * 电影列表数据更新
 */
export type MovieListViewUpdatePayload = {
    /**
     * 媒体库ID
     */
    lib_id: string
    /**
     * 电影信息
     */
    movie: Pick<MovieInfo, "name" | "year" | "language" | "imdb_ID"> & Pick<MovieFields, 'id'> & {
        /**
         * 电影ID
         */
        movie_id: number
    }
}
/**
 * 窗口视图相关事件数据MAP
 */
interface ViewEventMap {
    "render:list-view:update": MovieListViewUpdatePayload,
    "render:list-view:scan-end": {
        lib_id: string,
        is_complete: boolean,
        scan_loading: boolean
    }
}

/**
 * 窗口视图相关消息事件
 */
export class ViewnEventEmitterType {
    app: ApplicationType
    constructor(): this;
}