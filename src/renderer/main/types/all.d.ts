export type MovieInfo = {
    /**
     * 电影ID
     */
    id: number;
    /**
     * 电影名称
     */
    name: string;
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