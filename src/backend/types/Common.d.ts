export interface CommonEvent {
    /**
     * 清理数据残留
     */
    'clean-movie-path': {
        /**
         * 电影文件的ID
         */
        fid: string
        /**
         * 文件的路径
         */
        path: string
    }
}