export type MovieInfo = {
    /**
     * 电影ID
     */
    id: number;
    /**
     * 电影中文名称
     */
    name_cn: string;
    /**
     * 电影英文名称
     */
    name_en: string;
    /**
     * 名称首字母
     */
    first_char_cn?: string;
    /**
     * 电影年份
     */
    year: string;
    /**
     * 电影海报
     */
    poster: string;
    /**
     * 电影题材
     */
    genres: string,
    /**
     * 电影简介
     */
    summary: string;

    /**
     * 电影时长
     */
    duration: number;

    /**
     * 制片国家/地区
     */
    country: string;

    /**
     * 发行语言
     */
    language: string;

    /**
     * 电影评分
     */
    imdb_rating: number;

    /**
     * 上映时间
     */
    release_date: string;

    /**
     * 又名
     */
    original_title: string;

    /**
     * imdb_id
     */
    imdb_id: string;

    /**
     * 存储库id
     */
    media_lib_id: string;

    name?: string;

    path?: string;

    ext?: string;

    size?: number;

    atime?: number;

    ctime?: number;

    mtime?: number;

    resource_type?: string;
}


/**
* 媒体库定义
*/
export type Lib = {
    /**
     * 媒体库ID
     */
    lib_id: number;
    /**
     * 媒体库名称
     */
    name: string;
    /**
     * 是否扫描过
     */
    is_scaned: boolean;
    /**
     * 是否扫描完成
     */
    is_complete?: boolean;
    /**
     * 是否扫描中
     */
    scan_loading?: boolean;
    /**
     * 媒体库路径
     */
    lib_path: string;
    /**
     * 媒体库顺序
     */
    sort: number;
    /**
     * 媒体库类型
     */
    type: string;
    /**
     * 额外信息
     */
    meta: {
        [key: string]: any
    }
}


export default MovieInfo;



/**
 * 有效的消息动作名称
 */
const invokeRenderActions = [] as const;

/**
 * 消息动作联合类型定义
 */
export type invokeRenderActionType = typeof invokeRenderActions[number]

/**
 * 渲染线程消息参数
 */
export interface invokeRenderActionParams {
    /**
     * 消息动作名称
     */
    action: invokeRenderActionType
    /**
     * 消息动作名称
     */
    command: string
    /**
     * 消息唯一编码
     */
    uuid: string,
    /**
     * 消息动作参数
     */
    options: any
}