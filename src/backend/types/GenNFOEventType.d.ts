export type NFOContent = {
    /**
     * 电影名称
     */
    name: string;
}
/**
 * 生成NFO文件时提供的参数
 */
export type NFOGenPlayload = {
    /**
     * 存放nfo文件路径
     */
    nfo_path: string;
    /**
     * 用于生成nfo文件的数据
     */
    content: NFOContent;
}

export interface GenNFOEventMap {
    /**
     * 生成NFO文件
     */
    'movie-gen-nfo': NFOGenPlayload
}