import xml from "xml";
import fs from "fs";
import { parseStringPromise } from "xml2js"
import { MediaNFOType } from "@/types/MediaNFOType";

/**
 * 获取电影NFO文件
 * 
 * @example
 * const nfo = new MediaNFO()
 * nfo.setSummary('电影简介')
 * nfo.setReleaseYear(2020)
 * nfo.setReleaseDate('2020-01-01')
 * nfo.setDuration(120)
 * nfo.setPoster('电影海报')
 * nfo.setBackdrop('电影幕布')
 * nfo.setCountry('中国')
 * nfo.setLanguage('中文')
 * nfo.setGenres('动作')
 * nfo.setCasts('演员')
 * nfo.setCrews('摄制组')
 * nfo.setIMDB_ID('tt1234567')
 * nfo.setIMDB_Rating(9.8)
 * nfo.setIMDB_Votes(100)
 * console.log(nfo.xml)
 * // <movie>
 * //     <summary>电影简介</summary>
 * //     <year>2020</year>
 * //     <release_date>2020-01-01</release_date>
 * //     <duration>120</duration>
 * //     <poster>电影海报</poster>
 * //     <backdrop>电影幕布</backdrop>
 * //     <country>中国</country>
 * //     <language>中文</language>
 * //     <genres>动作</genres>
 * //     <casts>演员</casts>
 * //     <crews>摄制组</crews>
 * //     <imdb_id>tt1234567</imdb_id>
 * //     <imdb_rating>9.8</imdb_rating>
 * //     <imdb_votes>100</imdb_votes>
 * // </movie> 
 */
export default class MediaNFO implements MediaNFOType {
    _xml: Array<any> = [];
    _nfo_file: string = '';

    /**
     * 获取xml
     */
    get xml(): string {
        return this.generateXml('movie', this._xml);
    }

    /**
     * 加载已有的文件数据
     * @param nfo_path 
     * @returns 
     */
    async loadFromFile(nfo_path: string) {
        this._nfo_file = nfo_path
        if (nfo_path && fs.existsSync(nfo_path)) {
            let result = await parseStringPromise(fs.readFileSync(nfo_path, 'utf-8'))
            for (let key in result.movie) {
                this._xml.push({
                    [key]: result.movie[key][0]
                })
            }
        }
        return this
    }

    /**
     * 设置XML标签
     * @param key 
     * @param value 
     * @returns 
     */
    setXmlProperty(key: string, value: any) {
        let index = this._xml.findIndex(item => key in item)
        if (index > -1) {
            this._xml[index][key] = value
        } else {
            this._xml.push({
                [key]: value
            })
        }
        return this
    }

    /**
     * 设置电影名称
     * @param name 
     * @returns 
     */
    setName(name: string) {
        this.setXmlProperty('name', name)
        return this
    }
    /**
     * 设置电影简介
     * @param summary 
     * @returns 
     */
    setSummary(summary: string) {
        this.setXmlProperty('summary', summary)
        return this
    }
    /**
     * 设置电影发布年份
     * @param year 
     * @returns 
     */
    setReleaseYear(year: string) {
        this.setXmlProperty('year', year)
        return this
    }
    /**
     * 设置电影发布日期
     * @param date 
     * @returns 
     */
    setReleaseDate(date: string) {
        this.setXmlProperty('release_date', date)
        return this
    }
    /**
     * 设置电影时长
     * @param duration 
     * @returns 
     */
    setDuration(duration: number) {
        this.setXmlProperty('duration', duration)
        return this
    }
    /**
     * 设置电影海报
     * @param poster 
     * @returns 
     */
    setPoster(poster: string) {
        this.setXmlProperty('poster', poster)
        return this
    }
    /**
     * 设置电影幕布
     * @param backdrop 
     * @returns 
     */
    setBackdrop(backdrop: string) {
        this.setXmlProperty('backdrop', backdrop)
        return this
    }
    /**
     * 设置电影发行国家
     * @param countrys 
     * @returns 
     */
    setCountrys(countrys: string) {
        this.setXmlProperty('countrys', countrys)
        return this
    }
    /**
     * 设置电影发行语言
     * @param language 
     * @returns 
     */
    setLanguage(language: string) {
        this.setXmlProperty('language', language)
        return this
    }
    /**
     * 设置电影题材
     * @param genres
     * @returns 
     */
    setGenres(genres: string) {
        this.setXmlProperty('genres', genres)
        return this
    }
    /**
     * 设置资源类型
     * @param type 
     * @returns 
     */
    setResourceType(type: Array<any>) {
        this.setXmlProperty('resource_type', type.join(','))
        return this
    }
    /**
     * 设置文件列表
     * @param genres
     * @returns 
     */
    setVideos(files: Array<any>) {
        this.setXmlProperty('videos', files.join(','))
        return this
    }
    /**
     * 设置电影演员
     * @param casts 
     * @returns 
     */
    setCasts(casts: string) {
        this.setXmlProperty('casts', casts)
        return this
    }
    /**
     * 设置电影摄制组
     * @param crews 
     */
    setCrews(crews: string) {
        this.setXmlProperty('crews', crews)
        return this
    }
    /**
     * 设置电影imdb ID
     * @param imdb_id 
     * @returns 
     */
    setIMDB_ID(imdb_id: string) {
        this.setXmlProperty('imdb_id', imdb_id)
        return this
    }
    /**
     * 设置电影imdb 评分
     * @param imdb_rating 
     * @returns 
     */
    setIMDB_Rating(imdb_rating: number) {
        this.setXmlProperty('imdb_rating', imdb_rating)
        return this
    }
    /**
     * 设置电影imdb 评分人数
     * @param imdb_votes 
     * @returns 
     */
    setIMDB_Votes(imdb_votes: number) {
        this.setXmlProperty('imdb_votes', imdb_votes)
        return this
    }
    /**
     * 生成xml
     * @param root 
     * @param xmlOptions 
     * @returns 
     */
    generateXml(root: string, xmlOptions: any) {
        return xml(
            { [root]: xmlOptions },
            { declaration: true, indent: "\t" }
        ).replace(/\n/g, "\r\n");
    }
    /**
     * 写入文件
     * @param _nfo_file 
     */
    write(_nfo_file?: string) {
        if (_nfo_file) {
            this._nfo_file = _nfo_file;
        }
        if (!this._nfo_file) {
            throw new Error('_nfo_file is empty');
        }
        fs.writeFileSync(this._nfo_file, this.xml);
    }
}