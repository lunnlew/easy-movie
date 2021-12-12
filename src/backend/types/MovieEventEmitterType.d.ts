


import EventEmitter from 'events'
import application from '../libs/application'
import { ApplicationType } from './Application'
import { MovieFields, MovieFileFields, MovieInfo } from './Movie'

/**
 *电影on事件数据
 */
export type MovieOnEventPayload = Pick<
    MovieInfo,
    'name' | 'summary' | 'poster' | 'year' | 'backdrop' | 'casts' | 'crews' | 'duration' | 'genres' | 'release_date' | 'language' | 'spoken_language' | 'country' | 'original_title' | 'original_language' | 'imdb_id' | 'imdb_sid' | 'imdb_url' | 'imdb_rating' | 'imdb_votes'
> & Pick<MovieFields, 'id'> & Pick<MovieFileFields, 'path' | 'media_lib_id' | 'resource_type'>

/**
 * 下载电影图片参数
 */
export type MovieDownloadPosterPayload = Pick<MovieFileFields, 'media_lib_id' | 'path' | 'resource_type'> & Pick<MovieFields, 'id'> & Pick<MovieInfo, 'poster'>

/**
 * 下载电影海报
 */
export type MovieDownloadBackdropPayload = Pick<MovieFileFields, 'media_lib_id' | 'path' | 'resource_type'> & Pick<MovieFields, 'id'> & Pick<MovieInfo, 'backdrop'>
/**
 * 电泳演员数据
 */
export type MovieCastsPayload = Pick<MovieFileFields, 'media_lib_id' | 'resource_type'> & Pick<MovieFields, 'id'> & Pick<MovieInfo, 'casts'>
/**
 * 电影摄影组数据
 */
export type MovieCrewsPayload = Pick<MovieFileFields, 'media_lib_id' | 'resource_type'> & Pick<MovieFields, 'id'> & Pick<MovieInfo, 'crews'>

/**
 * NFO生成任务数据
 */
export type MovieGenNFOPayload = {
    /**
     * 电影ID
     */
    movie_id: number,
    /**
     * 电影文件位置
     */
    file_path: string,
}
/**
 *电影相关事件数据MAP
 */
interface MovieEventMap {
    "movie:save-info": MovieOnEventPayload,
    "movie:download-poster": MovieDownloadPosterPayload,
    "movie:download-backdrop": MovieDownloadBackdropPayload,
    "movie:update-casts": MovieCastsPayload,
    "movie:update-crews": MovieCrewsPayload,
    "movie:generate-nfo": MovieGenNFOPayload
}

/**
 * 电影相关消息事件
 */
export class MovieEventEmitterType {
    app: ApplicationType
    constructor(): this;
}