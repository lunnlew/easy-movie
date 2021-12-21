import { CastInfo } from "./Cast"
/**
 * 电影信息
 */
export type MovieInfo = {
    /**
     * 电影中文名称
     */
    name_cn: string;
    /**
     * 电影英文名称
     */
    name_en: string;
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
     * 幕布地址
     */
    backdrop_url?: string
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
/**
 * 电影字段
 */
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
} & Omit<MovieInfo, "casts" | "crews">

/**
 * 电影文件字段
 */
export type MovieFileFields = {
    /**
     * 记录ID
     */
    id?: number
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

/**
 * 电影信息入库后的多种动作
 */
export type MovieFetchOptions = {
    /**
     * 采集电影信息
     */
    'fetch_movie': boolean,
    /**
     * 生成NFO文件
     */
    'generate_nfo': boolean,
    /**
     * 更新客户端列表
     */
    'list_view_update': boolean
}

/**
 * 目录扫描信息
 */
export type scanedDirInfo = {
    /**
     * 文件数
     */
    fileCount: number,
    /**
     * 视频数
     */
    videoCount: number,
    /**
     * 目录数
     */
    dirCount: number,
    /**
     * 是否有海报
     */
    hasPoster: boolean,
    /**
     * NFO文件路径
     */
    nfoPaths?: string[],
    /**
     * NFO文件数量
     */
    nfoCount?: number,
    /**
     * 文件路径
     */
    filePaths: string[],
    /**
     * 目录路径
     */
    dirPaths: string[],
    /**
     * 文件数过多，超过100个
     */
    skipMoreFile: boolean
}