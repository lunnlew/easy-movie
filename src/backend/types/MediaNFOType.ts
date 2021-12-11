export interface MediaNFOType {
    _xml: Array<any>;

    /**
     * 获取xml
     */
    get xml(): string;

    /**
     * 设置电影名称
     * @param title 
     * @returns 
     */
    setName(name: string): this;

    /**
     * 设置电影简介
     * @param summary 
     * @returns 
     */
    setSummary(summary: string): this;

    /**
     * 设置电影发布年份
     * @param year 
     * @returns 
     */
    setReleaseYear(year: string): this;

    /**
     * 设置电影发布日期
     * @param date 
     * @returns 
     */
    setReleaseDate(date: string): this;

    /**
     * 设置电影时长
     * @param duration 
     * @returns 
     */
    setDuration(duration: number): this;

    /**
     * 设置电影海报
     * @param poster 
     * @returns 
     */
    setPoster(poster: string): this;

    /**
     * 设置电影幕布
     * @param backdrop 
     * @returns 
     */
    setBackdrop(backdrop: string): this;

    /**
     * 设置电影发行国家
     * @param countrys
     * @returns 
     */
    setCountrys(countrys: string): this;

    /**
     * 设置电影发行语言
     * @param language 
     * @returns 
     */
    setLanguage(language: string): this;

    /**
     * 设置电影题材
     * @param genres
     * @returns 
     */
    setGenres(genres: string): this;

    /**
     * 设置电影演员
     * @param casts 
     * @returns 
     */
    setCasts(casts: string): this;

    /**
     * 设置电影摄制组
     * @param crews 
     */
    setCrews(crews: string): this;

    /**
     * 设置电影imdb ID
     * @param imdb_id 
     * @returns 
     */
    setIMDB_ID(imdb_id: string): this;

    /**
     * 设置电影imdb 评分
     * @param imdb_rating 
     * @returns 
     */
    setIMDB_Rating(imdb_rating: number): this;

    /**
     * 设置电影imdb 评分人数
     * @param imdb_votes 
     * @returns 
     */
    setIMDB_Votes(imdb_votes: number): this;

    /**
     * 生成xml
     * @param root 
     * @param xmlOptions 
     * @returns 
     */
    generateXml(root: string, xmlOptions: any): this;


    /**
     * 写入xml
     * @param nfo_path 
     */
    write(nfo_path?: string): void;

}