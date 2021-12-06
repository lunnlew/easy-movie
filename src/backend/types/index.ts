/**
 * 电影信息
 */
export interface MovieInfo {
    /**
     * 是否抓取完毕
     */
    is_scraped?: boolean;
    /**
     * 抓取时间
     */
    is_scraped_at?: Date;
    /**
     * 电影ID
     */
    movie_id?: number,
    /**
     * 电影名称
     */
    name: string,
    /**
     * 扫描来源库ID
     */
    media_lib_id?: string,
    /**
     * 电影年份
     */
    year: string,
    /**
     * 电影时长
     */
    duration: number,
    /**
     * 发行日期
     */
    release_date: string,
    /**
     * 封面海报
     */
    poster: string,
    /**
     * 页面背景图
     */
    backdrop: string,
    /**
     * imdb评分
     */
    imdb_rating: string,
    /**
     * imdb评分人数
     */
    imdb_votes: string,
    /**
     * 电影简介
     */
    summary: string,
    /**
     * 电影题材
     */
    genres: string,
    /**
     * 原始语言
     */
    original_language?: string,
    /**
     * 配音语言
     */
    spoken_languages?: string,
    /**
     * 原始名称
     */
    original_title?: string,
    /**
     * imdb ID
     */
    imdb_sid?: number,
    /**
     * imdb_id
     */
    imdb_id: string,
    /**
     * imdb url
     */
    imdb_url: string,
    /**
     * 发布国家
     */
    country: string,
    /**
     * 电影语言
     */
    language: string,
    /**
     * 演职员
     */
    casts?: any[]
    /**
     * 演职员
     */
    crews?: any[]
    /**
     * 文件存放位置
     */
    path?: string
}

export interface TvInfo {

}

/**
 * 演职员信息
 */
export interface PersonInfo {
    /**
     * 是否抓取完毕
     */
    is_scraped?: boolean;
    /**
     * 抓取时间
     */
    is_scraped_at?: Date;
    /**
     * 演职员库中的ID
     */
    actor_id?: number,
    /**
     * 演员名称
     */
    name: string;
    /**
     * 演员照片
     */
    avatar?: string;
    /**
     * 演员性别
     */
    gender?: number;
    /**
     * 演员在IMDB的ID
     */
    imdb_sid?: number;
    /**
     * 演员在IMDB的imdb_id
     */
    imdb_id?: string;
    /**
     * 演员在IMDB的imdb_url
     */
    imdb_url?: string;
    /**
     * 演员生日
     */
    birthday?: string;
    /**
     * 演员出生地
     */
    place_of_birth?: string;
    /**
     * 演员忌日
     */
    deathday?: string;
    /**
     * 演员曾用名
     */
    also_known_as: string
}
/**
 * 刮削请求
 */
export interface ScraperInitTask {
    /**
     * 任务ID
     */
    task_uuid?: string,
    /**
     * 任务状态
     */
    task_state: 'success' | 'fail' | 'error'
    /**
     * 任务类型
     */
    task_type: 'fetch_movie' | 'fetch_tv' | 'fetch_cast',
    /**
     * 任务返回消息
     */
    task_msg: string,
    /**
     * 触发事件处理的名称
     */
    task_event: string
    /**
     * 任务优先级
     */
    task_priority: number
    /**
     * 任务附加数据
     */
    payload: ScraperMovieRequestPayload | ScraperCastRequestPayload,
}
/**
 * 刮削结果
 */
export interface ScraperResultTask {
    /**
     * 触发事件处理的名称
     */
    task_event: string
    /**
     * 任务ID
     */
    task_uuid: string,
    /**
     * 任务状态
     */
    task_state: 'success' | 'fail' | 'error'
    /**
     * 任务类型
     */
    task_type: 'fetch_movie' | 'fetch_tv' | 'fetch_cast',
    /**
     * 任务返回消息
     */
    task_msg: string,
    /**
     * 任务附加数据
     */
    payload: MovieInfo | TvInfo | PersonInfo,
}
/**
 *  刮削任务请求数据
 */
export interface ScraperMovieRequestPayload {
    /**
     * 电影名称
     */
    name: string,
    /**
     * 电影年份
     */
    year: string,
    /**
     * 查询语言
     */
    language: string,
    /**
     * 电影所在的媒体库ID
     */
    media_lib_id: string
    /**
     * 电影库中的ID
     */
    movie_id: number,
    /**
     * 电影在imdb中的imdb_id
     */
    imdb_id: string,
    /**
     * 文件存放位置
     */
    path: string;
}
/**
 *  刮削任务请求数据
 */
export interface ScraperCastRequestPayload {
    /**
     * 演职员姓名
     */
    name: string,
    /**
     * 演职员库中的ID
     */
    actor_id?: number,
    /**
     * 演职员在imdb中的ID 
     */
    imdb_sid?: number,
    /**
     * 演职员在imdb中的imdb_id
     */
    imdb_id?: string
    /**
     * 文件存放位置
     */
    path: string;
}

/**
 * 海报下载任务
 */
export interface ScraperDownloadTask {
    movie_id: number,
    lib_id: string,
    path: string,
    file_path: string,
    poster: string,
    backdrop: string,
}
/**
 * 有效的消息动作名称
 */
const invokeMainActions = [
    "loadConfig",
    "showOpenDialog",
    'showContextMenu',
    'setTypeFilterData',
    'showSearchAreaMenu',
    'windowControl',
    'invokeViewAction',
    'setFilterSetting'
] as const;

/**
 * 消息动作联合类型定义
 */
export type invokeMainActionType = typeof invokeMainActions[number]

/**
 * 主线程消息参数
 */
export interface invokeMainActionParams {
    /**
     * 消息动作名称
     */
    action: invokeMainActionType
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