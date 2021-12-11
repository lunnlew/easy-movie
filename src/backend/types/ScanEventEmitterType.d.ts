


import EventEmitter from 'events'
import application from '../libs/application'
import { ApplicationType } from './Application'

/**
 * 单项扫描结果
 */
type ScanItemResult = {
    /**
     * 是否单独电影目录
     */
    isSingleMovieDir?: boolean
    /**
     * 电影名称
     */
    movieName: string
    /**
     * 扫描的路径
     */
    scanPath: string
    /**
     * 扫描的路径结果
     */
    filePath?: string
    /**
     * 电影年份
     */
    year?: string
    /**
     * 电影语言
     */
    language?: string
    /**
     * 关联的媒体库ID
     */
    media_lib_id: string
    /**
     *  是否蓝光原盘目录
     */
    isBDMVDir?: boolean
    /**
     * 是否多集电影目录
     */
    isMultiMovieDir?: boolean
    /**
     * 是否是文件
     */
    isFile?: boolean
    /**
     * 扫描的文件夹信息
     */
    scanedDirInfo: {
        /**
         * 文件数
         */
        fileCount?: number
        /**
         * 视频文件数
         */
        videoCount?: number
        /**
         * 子目录数
         */
        dirCount?: number,
        /**
         * 是否有海报
         */
        hasPoster?: boolean,
        /**
         * 跳过
         */
        skip?: boolean
        /**
         * 扫描的文件结果
         */
        filePaths?: string[],
        /**
         * 扫描的目录结果
         */
        dirPaths?: string[],
    }
    /**
     * 扫描识别的类型
     */
    type: 'movie' | 'tv' | 'unknown'
    /**
     * 扫描的目录类别
     */
    dirType?: 1 | 2

}

/**
 * 目录扫描相关事件数据MAP
 */
interface ScanEventMap {
    "scan:item-result": ScanItemResult
}

/**
 * 目录扫描相关消息事件
 */
export class ScanEventEmitterType {
    app: ApplicationType
    constructor(): this;
}