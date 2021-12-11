import { CastInfo } from "./Cast"
export type MovieInfo = {
    /**
     * 电影名称
     */
    name: string;
    /**
     * 电影原始名称
     */
    original_title: string;
    /**
     * 电影原始语言
     */
    original_language: string;
    /**
     * 电影简介
     */
    summary: string;
    /**
     * 电影发行年
     */
    year: string;
    /**
     * 电影发布日期
     */
    release_date: string;
    /**
     * 电影时长
     */
    duration: number
    /**
     * 电影发行国家
     */
    country: string;
    /**
     * 电影发行语言
     */
    language: string;
    /**
     * 电影配音语言
     */
    spoken_language: string;
    /**
     * 电影海报
     */
    poster: string;
    /**
     * 电影幕布
     */
    backdrop: string;
    /**
     * 电影题材
     */
    genres: string
    /**
     * 电影演员
     */
    casts: CastInfo[];
    /**
     * 电影摄影组
     */
    crews: CastInfo[];
    /**
     * 电影在IMDB数据库中的整数ID字段，注意：不是IMDB_ID
     */
    imdb_sid: number
    /**
     * 电影的IMDB_ID
     */
    imdb_id: string
    /**
     * 电影的IMDN_URL
     */
    imdb_url: string
    /**
     * 电影的IMDB评分
     */
    imdb_rating: number
    /**
     * 电影的IMDB评分人数
     */
    imdb_votes: number
}
export type MovieFields = {
    /**
     * 电影ID
     */
    id?: number
    /**
     * 是否已经刮削
     */
    is_scraped: boolean
    /**
     * 刮削时间
     */
    is_scraped_at: Date
    /**
     * 幕布地址
     */
    backdrop_url?: string
} & Omit<MovieInfo, "casts" | "crews">

export type MovieFileFields = {
    /**
     * 媒体库ID
     */
    media_lib_id: string
    /**
     * 文件路径
     */
    path: string
    /**
     * 资源类型
     */
    resource_type?: 'single' | 'origin-disk'
}