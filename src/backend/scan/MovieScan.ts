

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import movie from '../database/movie'
import MediaNFO from "../libs/mediaNFO"
import movieFile from '../database/movie_files'
import libs from '../database/libs'
import { endsWithVideo, baseName, parseMovieName, longestCommonPrefix, minEditDistance, getFirstChar, endsWithNFO } from '../utils'
import { GlobalEventEmitterType } from '@/types/EventEmitter';
import { MovieFetchOptions, MovieFields, MovieFileFields, scanedDirInfo } from '@/types/Movie';
import { ScanItemResult } from '@/types/ScanEventEmitterType';
import { CastInfo } from '@/types/Cast';

const path = require('path');
const fs = require('fs');
class MovieScan {
  event: GlobalEventEmitterType;
  constructor() {
    this.event = application.event
    this.initialize();
  }
  async initialize() {
    console.log('MovieScan initialize');
    // 接受扫描单项结果
    this.event.on('scan:item-result', async (scanInfo) => {
      let pre_movieInfo = {
        imdb_id: '',
        name_cn: '',
        year: '',
        language: '',
      } as Pick<MovieFields, 'imdb_id' | 'name_cn' | 'year' | 'language'>;
      if (scanInfo.isSingleMovieDir) {
        pre_movieInfo.year = this.extractYear(scanInfo.movieName, scanInfo.filePath) || scanInfo.year
        let newMovieName = parseMovieName(scanInfo.movieName, pre_movieInfo.year)
        pre_movieInfo.name_cn = newMovieName
        pre_movieInfo.language = scanInfo.language || 'en'
        // 电影名称是否含有中文
        if (/.*[\u4e00-\u9fa5]+.*$/.test(newMovieName)) {
          pre_movieInfo.language = 'zh'
        }
        await this.save_movie_info(pre_movieInfo as any, {
          path: scanInfo.filePath.replace(/\\/g, '/'),
          media_lib_id: scanInfo.media_lib_id
        })
      } else if (scanInfo.isBDMVDir) {
        pre_movieInfo.year = this.extractYear(scanInfo.movieName, scanInfo.filePath) || scanInfo.year
        let newMovieName = parseMovieName(scanInfo.movieName, pre_movieInfo.year)
        pre_movieInfo.name_cn = newMovieName
        pre_movieInfo.language = scanInfo.language || 'en'
        // 电影名称是否含有中文
        if (/.*[\u4e00-\u9fa5]+.*$/.test(newMovieName)) {
          pre_movieInfo.language = 'zh'
        }
        await this.save_movie_info(pre_movieInfo as any, {
          path: scanInfo.filePath.replace(/\\/g, '/'),
          media_lib_id: scanInfo.media_lib_id,
          resource_type: 'origin-disk'
        })
      } else if (scanInfo.isMultiMovieDir) {
        for (let scanInfo_item of scanInfo.scanedDirInfo.filePaths) {
          pre_movieInfo.year = this.extractYear(scanInfo.movieName, scanInfo_item)
          let newMovieName = parseMovieName(baseName(scanInfo_item).split(' ')[0], pre_movieInfo.year)
          pre_movieInfo.name_cn = newMovieName
          pre_movieInfo.language = scanInfo.language || 'en'
          // 电影名称是否含有中文
          if (/.*[\u4e00-\u9fa5]+.*$/.test(newMovieName)) {
            pre_movieInfo.language = 'zh'
          }
          await this.save_movie_info(pre_movieInfo as any, {
            path: scanInfo_item.replace(/\\/g, '/'),
            media_lib_id: scanInfo.media_lib_id,
          })
        }
      } else {
        console.log('其他类别文件夹，跳过', scanInfo.scanPath)
      }
    })
  }
  /**
   * 提取年份
   * @param movieName 电影名称
   * @param file_path 电影文件路径
   * @returns 
   */
  extractYear(movieName: string, file_path: string): string {
    let movieName_matched = Array.from(movieName.matchAll(/\d{4}\b/g))
    let file_path_matched = Array.from(file_path.matchAll(/\d{4}\b/g))
    let year = ''
    if (movieName_matched.length > 0 && file_path_matched.length > 0) {
      if (movieName_matched[0] === file_path_matched[0]) {
        year = movieName_matched[0].toString()
      } else {
        year = movieName_matched[0].toString()
      }
    } else if (movieName_matched.length > 0) {
      year = movieName_matched[0].toString()
    } else if (file_path_matched.length > 0) {
      year = file_path_matched[0].toString()
    }
    return year
  }
  /**
   * 保存电影信息
   */
  async save_movie_base_info(movie_info: MovieFields, filePath: string): Promise<number> {
    let has_base_info = false
    // 查询电影基础信息是否已存在
    let select_movieinfos: MovieFields[] = await movie.knex('movies').column(['id', 'name_cn', 'year']).where({
      name_cn: movie_info.name_cn
    }).limit(50).offset(0).select().catch(e => { throw e })

    //  尝试匹配年份信息
    let movie_data = select_movieinfos.find(item => item.year === movie_info.year)
    if (select_movieinfos && movie_data) {
      has_base_info = true
      movie_info.id = movie_data.id
    } else {
      delete movie_info.id
    }

    // 如果没有基础信息，则保存
    if (!has_base_info) {
      let ids: number[] = await movie.save({
        ...movie_info,
        first_char_cn: getFirstChar(movie_info.name_cn),
        path: filePath,
      }).catch(e => { throw e })
      movie_info.id = ids[0]
    }

    return movie_info.id || 0
  }
  /**
   * 保存电影文件信息
   * @param filePath  电影文件路径
   * @param movie_id 电影id
   * @param media_lib_id 库id
   * @param resource_type 文件资源类型
   * @returns 
   */
  async save_movie_file_info(filePath: string, movie_id: number, media_lib_id: string, resource_type: string): Promise<number> {
    if (!filePath) {
      console.log('未指定要保存的文件路径，跳过')
      return 0
    }
    let file_info: MovieFileFields = await movieFile.getByPath(filePath).catch(err => {
      console.log('MovieScan getByPath err', err)
      return {}
    })
    if (file_info.id) {
      console.log('已存在该路径记录，不做处理', filePath);
      return file_info.id
    }
    // 保存新的文件记录
    let new_file_info = {
      path: filePath,
      name: baseName(filePath),
      media_lib_id: media_lib_id,
      resource_type: resource_type || 'single',
      type: 'movie',
      movie_id: movie_id
    }
    let res = await movieFile.save(new_file_info).catch(err => {
      console.log('MovieScan save file err', err)
    })
    return res[0] || 0
  }

  /**
   * 保存信息
   * @param movie_info 电影信息
   * @param movie_file 文件信息
   * @returns 
   */
  async save_movie_info(movie_info: MovieFields, movie_file: MovieFileFields, options: MovieFetchOptions = {
    fetch_movie: true,
    generate_nfo: true,
    list_view_update: true,
  }): Promise<number> {

    // 文件信息入库
    let movie_file_id = await this.save_movie_file_info(
      movie_file.path,
      movie_info.id || 0,
      movie_file.media_lib_id,
      movie_file.resource_type
    )

    if (!movie_file_id) {
      return
    }

    // 电影信息入库
    let movie_info_id = await this.save_movie_base_info(movie_info, movie_file.path)
    if (!movie_info_id) {
      return
    }

    // 更新关联关系
    await movieFile.update(movie_file_id, {
      movie_id: movie_info_id
    })

    // 去刮削影视信息
    if (options.fetch_movie) {
      this.event.emit('scraper-queue:add-task', {
        task_event: 'scraper:start:fetch-movie',
        task_priority: 1,
        payload: {
          name: movie_info.name_cn,
          year: movie_info.year,
          language: movie_info.language,
          movie_id: movie_info.id,
          imdb_id: movie_info.imdb_id,
          media_lib_id: movie_file.media_lib_id,
          path: movie_file.path,
          resource_type: movie_file.resource_type || 'single'
        }
      });
    }

    // 去生成影视nfo信息
    if (options.generate_nfo) {
      this.event.emit('movie:generate-nfo', {
        movie_id: movie_info.id,
        file_path: movie_file.path,
      });
    }

    // 页面上显示
    if (options.list_view_update) {
      this.event.emit('render:list-view:update', {
        lib_id: movie_file.media_lib_id,
        movie: {
          id: movie_info.id,
          name_cn: movie_info.name_cn,
          name_en: movie_info.name_en,
          year: movie_info.year,
          language: movie_info.language,
          movie_id: movie_info.id,
          imdb_id: movie_info.imdb_id
        }
      })
    }

    return movie_info_id
  }
  /**
   * 获取可能的目录电影信息
   * @param filePath 目录
   * @returns 目录信息
   */
  scanDirInfo(filePath: string): scanedDirInfo {
    let files = fs.readdirSync(filePath);
    let fileCount = 0
    let videoCount = 0
    let dirCount = 0
    let hasPoster = false
    let skipMoreFile = false
    let nfoCount = 0
    let filePaths = [] as string[]
    let nfoPaths = [] as string[]
    let dirPaths = [] as string[]
    for (let file of files) {
      const _file = path.join(filePath, file) as string;
      const stat = fs.statSync(_file);
      if (!stat.isDirectory()) {
        if (baseName(_file).indexOf('cover') === 0 || baseName(_file).indexOf('poster') === 0) {
          hasPoster = true
        }
        if (endsWithVideo(_file)) {
          videoCount++
          filePaths.push(_file) // 只记录视频文件路径
        }
        if (endsWithNFO(_file)) {
          nfoCount++
          nfoPaths.push(_file) // 只记录nfo文件路径
        }
        fileCount++
      } else {
        dirPaths.push(_file)
        dirCount++
      }
      if (fileCount > 100) {
        skipMoreFile = true
        break
      }
    }
    return {
      fileCount,
      videoCount,
      dirCount,
      hasPoster,
      nfoPaths,
      nfoCount,
      filePaths,
      dirPaths,
      skipMoreFile
    }
  }
  /**
   * 判断是否是单个电影文件目录
   * @param scanedDirInfo 扫描结果
   * @returns true|false  是|否
   */
  isSingleMovieDir(scanedDirInfo: scanedDirInfo): boolean {
    // 有视频文件及封面
    if (scanedDirInfo.hasPoster && scanedDirInfo.videoCount > 0) {
      return true
    }
    // 仅一个视频文件
    if (scanedDirInfo.videoCount === 1 && scanedDirInfo.dirCount === 0) {
      return true
    }
    return false
  }
  /**
   * 判断是否存在NFO文件
   * @param scanedDirInfo 扫描结果
   * @returns true|false  是|否
   */
  isHasNFO(scanedDirInfo: scanedDirInfo): boolean {
    // 有NFO文件
    if (scanedDirInfo.nfoCount > 0) {
      return true
    }
    return false
  }
  /**
   * 判断是否是多个电影文件目录
   * @param scanedDirInfo 扫描结果
   * @returns true|false  是|否
   */
  isMultiMovieDir(scanedDirInfo: scanedDirInfo): boolean {
    if (scanedDirInfo.videoCount > 1 && scanedDirInfo.dirCount === 0) {
      return true
    }
    return false
  }
  /**
   * 是否蓝光原盘目录
   * @param scanedDirInfo 扫描结果
   * @returns 
   */
  isBDMVDir(scanedDirInfo: scanedDirInfo): boolean {
    if (scanedDirInfo.videoCount === 0 && scanedDirInfo.dirCount > 0) {
      let conut = 0
      for (let dir of scanedDirInfo.dirPaths) {
        if (dir.indexOf('BDMV') > -1) {
          conut++
        } else if (dir.indexOf('CERTIFICATE') > -1) {
          conut++
        }
      }
      if (conut >= 2) {
        return true
      }
    }
    return false
  }
  /**
   * 从NFO文件中获取电影信息
   * @param nfo_path NFO文件路径
   * @param scanInfo 提取的信息
   */
  async extractMovieInfoFromNFO(nfo_path: string, scanInfo: ScanItemResult): Promise<void> {
    console.log('存在NFO文件', `${nfo_path}`);
    let media_nfo = await new MediaNFO().loadFromFile(nfo_path)
    let movie_info = {} as MovieFields & {
      videos: {
        file: [
          {
            _: string
            $: MovieFileFields
          }
        ]
      },
      casts: {
        person: [
          {
            _: string
            $: CastInfo
          }
        ]
      }
    }
    for (let prop of media_nfo._xml) {
      for (let propkey in prop) {
        if (propkey === 'Metadata') {
          continue
        }
        movie_info[propkey] = prop[propkey]
      }
    }

    // 新的影视信息
    let new_movie_info = {
      name_cn: movie_info.name_cn,
      name_en: movie_info.name_en,
      summary: movie_info.summary,
      backdrop: movie_info.backdrop,
      poster: movie_info.poster,
      language: movie_info.language,
      imdb_id: movie_info.imdb_id,
      imdb_sid: movie_info.imdb_sid,
      imdb_url: movie_info.imdb_url,
      genres: movie_info.genres,
      country: movie_info.country,
      spoken_language: movie_info.spoken_language,
      original_title: movie_info.original_title,
      original_language: movie_info.original_language,
      imdb_votes: movie_info.imdb_votes,
      imdb_rating: movie_info.imdb_rating,
      year: movie_info.year,
      release_date: movie_info.release_date,
      duration: movie_info.duration,
      is_scraped: true,
      is_scraped_at: Date.now(),
    }

    // 电影信息入库
    let movie_info_id = await this.save_movie_base_info(new_movie_info, '')
    if (!movie_info_id) {
      console.log('电影信息入库失败', `${nfo_path}`);
      return
    }

    // 文件信息入库
    if (Array.isArray(movie_info.videos.file)) {
      for (let video of movie_info.videos.file) {
        let attr = video.$
        console.log('发现文件', attr.path);

        let movie_file = {
          path: (path.dirname(nfo_path) + attr.path).replace(/\\/g, '/'),
          media_lib_id: scanInfo.media_lib_id,
          resource_type: attr.resource_type || 'single',
        }

        // 文件信息入库
        let movie_file_id = await this.save_movie_file_info(
          movie_file.path,
          movie_info_id,
          movie_file.media_lib_id,
          movie_file.resource_type
        )

        if (!movie_file_id) {
          console.log('文件信息入库失败', `${attr.path}`);
          return
        }

        // 更新电影-文件关联关系
        await movieFile.update(movie_file_id, {
          movie_id: movie_info_id
        })

        console.log('文件信息入库成功', `${attr.path}`);
      }
    }

    // 演职员信息入库
    if (Array.isArray(movie_info.casts.person)) {
      for (let person of movie_info.casts.person) {
        let attr = person.$
        console.log('发现演职员', attr.name_cn);

        // 演职员信息入库
        let actor = await application.knex('actors').select(['id', 'imdb_sid']).where({
          imdb_sid: attr.imdb_sid
        }).first()
        let actor_id = actor.id
        if (!actor) {
          let ids = await application.knex('actors').insert({
            imdb_id: attr.imdb_id,
            imdb_sid: attr.imdb_sid,
            imdb_rating: attr.imdb_rating,
            imdb_votes: attr.imdb_votes,
            name_cn: attr.name_cn,
            name_en: attr.name_en,
            avatar: attr.avatar,
            avatar_url: attr.avatar_url,
            imdb_url: attr.imdb_url,
            gender: attr.gender,
            birthday: attr.birthday,
            deathday: attr.deathday,
            place_of_birth: attr.place_of_birth,
            also_known_as: attr.also_known_as,
            desc: attr.desc,
            is_scraped: true,
            is_scraped_at: Date.now(),
          })
          actor_id = ids[0]
        }

        // 更新电影-演职员关联关系
        let actor_movie = await application.knex('actor_movie').where({
          movie_id: movie_info_id,
          actor_id: actor_id,
        }).first()

        if (!actor_movie) {
          await application.knex('actor_movie').insert({
            movie_id: movie_info_id,
            actor_id: actor_id,
            department: attr.department,
            job: attr.job,
            character: attr.character,
          })
        }

        console.log('演职员信息入库成功', `${attr.name_cn}`);
      }

    }
  }
  /**
   * 扫描电影文件夹
   * @param file_path 目标文件夹路径
   * @param media_lib_id 媒体库ID
   * @param is_top 是否是顶级文件夹
   */
  async scan(file_path: string, media_lib_id: string, is_top: boolean = false) {
    const file_stat = fs.statSync(file_path)
    let files = [] as string[]
    if (file_stat.isDirectory()) {
      files = fs.readdirSync(file_path).map(item => path.join(file_path, item).replace(/\\/g, '/'));
    } else {
      files = [file_path.replace(/\\/g, '/')]
    }
    for (const filePath of files) {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        let scanedDirInfo = this.scanDirInfo(filePath);
        if (scanedDirInfo.skipMoreFile) {
          console.log(`${filePath} 文件过多跳过`);
          continue
        }
        if (this.isHasNFO(scanedDirInfo)) {
          for (let nfo_file of scanedDirInfo.nfoPaths) {
            this.extractMovieInfoFromNFO(nfo_file, {
              media_lib_id,
              scanPath: filePath,
              filePath: filePath,
              movieName: baseName(filePath),
              type: 'movie',
              scanedDirInfo
            })
          }
        } else if (this.isSingleMovieDir(scanedDirInfo)) {
          console.log(`${filePath} 单文件电影目录`);
          this.event.emit('scan:item-result', {
            media_lib_id,
            scanPath: filePath,
            filePath: scanedDirInfo.filePaths[0],
            movieName: baseName(filePath),
            isSingleMovieDir: true,
            type: 'movie',
            scanedDirInfo
          });
        } else if (this.isMultiMovieDir(scanedDirInfo)) {
          // 尝试取得两个文件路径的公共前缀
          let commonPathPrefix = longestCommonPrefix([scanedDirInfo.filePaths[0], scanedDirInfo.filePaths[1]]).replace(/(\\|\/)$/gi, '')
          console.log(`${filePath} 多文件电影目录, 公共前缀: ${commonPathPrefix}`);
          if (commonPathPrefix === filePath) {
            /**
             * 如果公共前缀是当前目录
             * 可能结构如下
             *  /path/to/movie1/1.mp4 /path/to/movie1/2.mp4 /path/to/movie1/3.mp4
             *  /path/to/dir/nnn1.mp4 /path/to/dir/ddd2.mp4 /path/to/dir/mmm3.mp4
             */
            let f1 = baseName(scanedDirInfo.filePaths[0]).substr(0, 6)
            let f2 = baseName(scanedDirInfo.filePaths[1]).substr(0, 6)
            let editDistance = minEditDistance(f1, f2)
            console.log(`${f1}=>${f2}, 编辑距离: ${editDistance}`);
            if (editDistance <= 2) {
              let movieName = baseName(scanedDirInfo.filePaths[0])
              // 同一个电影
              console.log('可能的电影名称', movieName)
              this.event.emit('scan:item-result', {
                media_lib_id,
                scanPath: filePath,
                movieName: movieName,
                isMultiMovieDir: true,
                dirType: 1, // 同系列
                type: 'movie',
                scanedDirInfo
              });
            } else {
              // 不同电影
              scanedDirInfo.filePaths.forEach(_filePath => {
                let movieName = baseName(_filePath)
                console.log('可能的电影名称', movieName)
                this.event.emit('scan:item-result', {
                  media_lib_id,
                  scanPath: filePath,
                  filePath: _filePath,
                  movieName: movieName,
                  isMultiMovieDir: true,
                  dirType: 2, // 不同系列
                  type: 'movie',
                  scanedDirInfo
                });
              })
            }
          } else {
            /**
             *如果公共前缀不是当前目录
             * 可能结构如下
             *  /path/to/movie1/movie-1.mp4 /path/to/movie1/movie-2.mp4 /path/to/movie1/movie-3.mp4
             *  /path/to/movie1/movie1-1-dd.mp4 /path/to/movie1/movie1-2-vv.mp4 /path/to/movie1/movie1-3-bb.mp4
             *  /path/to/movie1/ep-1.mp4 /path/to/movie1/ep-2.mp4 /path/to/movie1/ep-3.mp4
             */
            let movieName = baseName(commonPathPrefix)
            // 排除特别的关键词
            if (movieName.indexOf('ep') === 0) {
              movieName = baseName(path.dirname(commonPathPrefix))
            }
            console.log('可能的电影名称', movieName)
            this.event.emit('scan:item-result', {
              media_lib_id,
              scanPath: filePath,
              movieName: movieName,
              isMultiMovieDir: true,
              dirType: 1, // 同系列
              type: 'movie',
              scanedDirInfo
            });
          }
        } else if (this.isBDMVDir(scanedDirInfo)) {
          console.log(`${filePath} BDMV目录`);
          let movieName = baseName(filePath)
          console.log('可能的电影名称', movieName)
          this.event.emit('scan:item-result', {
            media_lib_id,
            scanPath: filePath,
            filePath: filePath,
            movieName,
            isBDMVDir: true,
            type: 'movie',
            scanedDirInfo
          });
        } else {
          console.log(`扫描子目录： ${filePath}`);
          await this.scan(filePath, media_lib_id)
        }
      } else {
        if (endsWithVideo(filePath)) {
          let movieName = baseName(filePath)
          console.log('可能的电影名称', movieName)
          this.event.emit('scan:item-result', {
            media_lib_id,
            scanPath: path.dirname(filePath),
            filePath: filePath,
            movieName,
            isFile: true,
            type: 'movie',
            scanedDirInfo: {
              fileCount: 1,
              videoCount: 1,
              dirCount: 0,
              hasPoster: false,
              filePaths: [filePath],
              dirPaths: [],
              skipMoreFile: false
            }
          });
        } else {
          console.log(`${filePath} is not video file`);
        }
      }
    }
    if (is_top) {
      console.log('目录扫描完成')
      let lib_data = await libs.getById(media_lib_id)
      libs.updateById(media_lib_id, {
        ...lib_data,
        is_scaned: true,
        scan_loading: false
      })
      this.event.emit('render:list-view:scan-end', {
        lib_id: media_lib_id,
        is_complete: true,
        scan_loading: false
      })
    }
  }
}
export default new MovieScan()