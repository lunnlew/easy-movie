
import { MovieInfo, MovieFileFields } from './Movie'
import { GlobalOnEventType } from './EventEmitter'
import { CastFields, CastInfo } from './Cast';

type ScraperTask = {
    /**
     * 传递的下一个任务事件名称
     */
    task_event?: GlobalOnEventType
    /**
     * 任务的唯一标识
     */
    task_uuid?: string,
    /**
     * 任务结果状态
     */
    task_state?: 'success' | 'fail' | 'error'
    /**
     * 任务结果消息
     */
    task_msg?: string
    /**
     * 任务结果类型
     */
    task_type?: string
    /**
     * 任务优先级
     */
    task_priority?: number
    /**
     * 任务结果数据
     */
    payload?: any
}


export interface IScraper {
    /**
     * 刮削器识别ID
     */
    scraper_id: string;
}


/**
 *  刮削电影任务请求数据
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
     * 电影在imdb中的imdb_ID
     */
    imdb_id: string,
    /**
     * 电影在imdb中的imdb id
     */
    imdb_sid?: string,
    /**
     * 文件存放位置
     */
    path: string;
    /**
     * 资源类型
     */
    resource_type?: 'single' | 'origin-disk'
}

/**
 *  刮削演员任务请求数据
 */
export type ScraperCastRequestPayload = {
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
    path?: string;
}

type ScraperMovieTask = Omit<ScraperTask, 'payload'> & {
    payload: ScraperMovieRequestPayload
}

type ScraperCastTask = Omit<ScraperTask, 'payload'> & {
    payload: ScraperCastRequestPayload
}

type ScraperSubmitTaskMap = {
    'fetch_movie': MovieInfoScraperResult
    'fetch_tv': null
    'fetch_cast': CastInfoScraperResult
}
type ScraperSubmitTaskType = keyof ScraperSubmitTaskMap
type SubmitTaskPayload<T extends ScraperSubmitTaskType> = ScraperSubmitTaskMap[T];

type ScraperSubmitTask = {
    [K in ScraperSubmitTaskType]: Omit<ScraperTask, 'task_type' | 'payload'> & {
        /**
         * 任务类型
         */
        task_type: K
        /**
         * 任务数据
         */
        payload?: SubmitTaskPayload<K>
    }
}[ScraperSubmitTaskType]

/**
 * 刮削器相关事件数据MAP
 */
type ScraperEventMap = {
    "scraper-queue:add-task": ScraperAddTaskMap
    "scraper-queue:submit-task": ScraperSubmitTask
    'scraper:start:fetch-movie': ScraperMovieTask,
    'scraper:start:fetch-cast': ScraperCastTask
    'scraper-queue:refresh': undefined
    'scraper-queue:start': undefined
    'scraper-app:fetch-movie': ScraperMovieTask,
    'scraper-app:fetch-cast': ScraperCastTask,
}
/**
 * 刮削器事件
 */
type ScraperEventType = keyof ScraperEventMap
/**
 * 刮削器事件数据
 */
type EventEmitPayload<T extends ScraperEventType> = ScraperEventMap[T];
/**
 * 允许添加的任务名称
 */
type ScraperAddTaskType = keyof Omit<ScraperEventMap, 'scraper-queue:add-task' | 'scraper-queue:submit-task' | 'scraper-queue:refresh' | 'scraper-queue:start'>
/**
 * 允许添加的任务数据
 */
type ScraperAddTaskMap = {
    [K in ScraperAddTaskType]: Omit<ScraperTask, 'task_event' | 'payload'> & {
        task_event: K
    } & Pick<EventEmitPayload<K>, 'payload'>
}[ScraperAddTaskType]

/**
 * 电影刮削结果
 */
export type MovieInfoScraperResult = MovieInfo & Pick<MovieFileFields, 'id' | 'media_lib_id'>
/**
 * 演员刮削结果
 */
export type CastInfoScraperResult = CastInfo & Pick<CastFields, 'id'>

/**
 * 刮削器相关消息事件
 */
export class ScraperEventEmitterType {
    app: ApplicationType
    constructor(): this;
}