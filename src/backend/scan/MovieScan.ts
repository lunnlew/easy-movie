

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import movie from '../database/movie'
import MediaNFO from "../libs/mediaNFO"
import movieFile from '../database/movie_files'
import libs from '../database/libs'
import { endsWithVideo, baseName, parseMovieName, longestCommonPrefix, minEditDistance, getFirstChar, endsWithNFO } from '../utils'
import { GlobalEventEmitterType } from '@/types/EventEmitter';
import { MovieFields } from '@/types/Movie';

const path = require('path');
const fs = require('fs');
class MovieScan {
  event: GlobalEventEmitterType;
  constructor() {
    this.event = application.event
    this.initialize();
  }
  buildYear(movieName: string, file_path: string) {
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
  async initialize() {
    console.log('MovieScan initialize');
    // 接受扫描单项结果
    this.event.on('scan:item-result', async (scanInfo) => {
      let pre_movieInfo = {
        imdb_id: '',
        name_cn: '',
        year: '',
        language: '',
      };
      if (scanInfo.isSingleMovieDir) {
        pre_movieInfo.year = this.buildYear(scanInfo.movieName, scanInfo.filePath) || scanInfo.year
        let newMovieName = parseMovieName(scanInfo.movieName, pre_movieInfo.year)
        pre_movieInfo.name_cn = newMovieName
        pre_movieInfo.language = scanInfo.language || 'en'
        // 电影名称是否含有中文
        if (/.*[\u4e00-\u9fa5]+.*$/.test(newMovieName)) {
          pre_movieInfo.language = 'zh'
        }
        await this.save_movie_info(pre_movieInfo as any, {
          filePath: scanInfo.filePath.replace(/\\/g, '/'),
          media_lib_id: scanInfo.media_lib_id
        })
      } else if (scanInfo.isBDMVDir) {
        pre_movieInfo.year = this.buildYear(scanInfo.movieName, scanInfo.filePath) || scanInfo.year
        let newMovieName = parseMovieName(scanInfo.movieName, pre_movieInfo.year)
        pre_movieInfo.name_cn = newMovieName
        pre_movieInfo.language = scanInfo.language || 'en'
        // 电影名称是否含有中文
        if (/.*[\u4e00-\u9fa5]+.*$/.test(newMovieName)) {
          pre_movieInfo.language = 'zh'
        }
        await this.save_movie_info(pre_movieInfo as any, {
          filePath: scanInfo.filePath.replace(/\\/g, '/'),
          media_lib_id: scanInfo.media_lib_id,
          resource_type: 'origin-disk'
        })
      } else if (scanInfo.isMultiMovieDir) {
        for (let scanInfo_item of scanInfo.scanedDirInfo.filePaths) {
          pre_movieInfo.year = this.buildYear(scanInfo.movieName, scanInfo_item)
          let newMovieName = parseMovieName(baseName(scanInfo_item).split(' ')[0], pre_movieInfo.year)
          pre_movieInfo.name_cn = newMovieName
          pre_movieInfo.language = scanInfo.language || 'en'
          // 电影名称是否含有中文
          if (/.*[\u4e00-\u9fa5]+.*$/.test(newMovieName)) {
            pre_movieInfo.language = 'zh'
          }
          await this.save_movie_info(pre_movieInfo as any, {
            filePath: scanInfo_item.replace(/\\/g, '/'),
            media_lib_id: scanInfo.media_lib_id,
          })
        }
      } else {
        console.log('未知文件夹类型')
      }
    })
  }
  async save_movie_info(movie_info: MovieFields, movie_file: any) {
    if (!movie_file.filePath) {
      console.log('未指定路径，跳过')
      return
    }
    console.log('MovieScan movieFile.findByPath', movie_file.filePath);
    let fileinfo = await movieFile.getByPath(movie_file.filePath).catch(e => { throw e })
    let has_main_info = false
    if (fileinfo) {
      console.log('暂时对已存在的不做处理');
      return
      // if (fileinfo.media_lib_id !== scanInfo.media_lib_id) {
      //   let exists_movie = await movie.knex('movies').where({
      //     id: fileinfo.movie_id
      //   }).first()
      //   if (exists_movie) {
      //     console.log('存在不同库的信息, 复用信息')
      //     movie_info.name_cn = exists_movie.name_cn
      //     movie_info.year = exists_movie.year
      //     movie_info.id = exists_movie.id
      //     movie_info.language = exists_movie.language
      //     movie_info.imdb_id = exists_movie.imdb_id
      //     has_main_info = true
      //   }
      // } else {
      //   console.log('存在相同库的信息, 忽略')
      //   return
      // }
    } else {
      // 查询电影基础信息是否已存在
      let select_movieinfos = await movie.knex('movies').column(['id', 'name_cn', 'year']).where({
        name_cn: movie_info.name_cn
      }).limit(50).offset(0).select().catch(e => { throw e })
      let movie_data = select_movieinfos.find(item => item.year === movie_info.year)
      if (select_movieinfos && movie_data) {
        has_main_info = true
        movie_info.id = movie_data.id
      } else {
        delete movie_info.id
      }
    }

    console.log('MovieScan pre_movieInfo', movie_info);
    if (!has_main_info) {
      // 不存在基础信息
      let ids = await movie.save({
        ...movie_info,
        first_char_cn: getFirstChar(movie_info.name_cn),
        path: movie_file.filePath,
      }).catch(e => { throw e })
      movie_info.id = ids[0]
    }

    console.log(`${movie_info.name_cn}, ${movie_info.year || ''}, ${movie_file.filePath} 路径入库`);
    // 保存新的文件路径
    await movieFile.save({
      path: movie_file.filePath,
      name: movie_info.name_cn,
      type: 'movie',
      movie_id: movie_info.id,
      media_lib_id: movie_file.media_lib_id,
      resource_type: movie_file.resource_type || 'single'
    }).catch(e => { throw e })

    // 去刮削影视信息
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
        path: movie_file.filePath,
        resource_type: movie_file.resource_type || 'single'
      }
    });

    // 去生成影视nfo信息
    // this.event.emit('movie:generate-nfo', {
    //   movie_id: movie_info.id,
    //   file_path: movie_file.filePath,
    // });

    // 页面上显示
    this.event.emit('render:list-view:update', {
      lib_id: movie_file.media_lib_idd,
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
  /**
   * 获取可能的目录电影信息
   * @param filePath 目录
   * @returns 目录信息
   */
  scanDirInfo(filePath: string) {
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
   * @param path 目录路径
   * @returns true|false  是|否
   */
  isSingleMovieDir(scanedDirInfo: any) {
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
   * @param path 目录路径
   * @returns true|false  是|否
   */
  isHasNFO(scanedDirInfo: any) {
    // 有NFO文件
    if (scanedDirInfo.nfoCount > 0) {
      return true
    }
    return false
  }
  /**
   * 判断是否是多个电影文件目录
   * @param path 目录路径
   * @returns true|false  是|否
   */
  isMultiMovieDir(scanedDirInfo: any) {
    if (scanedDirInfo.videoCount > 1 && scanedDirInfo.dirCount === 0) {
      return true
    }
    return false
  }
  /**
   * 是否蓝光原盘目录
   * @param scanedDirInfo 
   * @returns 
   */
  isBDMVDir(scanedDirInfo: any) {
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
  async extractMovieInfoFromNFO(nfo_path: string, scanInfo: any) {
    console.log('存在NFO文件', `${nfo_path}`);
    let media_nfo = await new MediaNFO().loadFromFile(nfo_path)
    let movie_info = {} as any
    for (let prop of media_nfo._xml) {
      for (let propkey in prop) {
        if (propkey === 'Metadata') {
          continue
        }
        movie_info[propkey] = prop[propkey]
      }
    }
    if (Array.isArray(movie_info.videos.file)) {
      for (let video of movie_info.videos.file) {
        let attr = video.$
        await this.save_movie_info({
          name_cn: movie_info.name_cn,
          name_en: movie_info.name_en,
          summary: movie_info.summary,
          backdrop: movie_info.backdrop,
          poster: movie_info.poster,
          language: movie_info.language,
          imdb_id: movie_info.imdb_id,
          imdb_url: movie_info.imdb_url,
          imdb_votes: movie_info.imdb_votes,
          imdb_rating: movie_info.imdb_rating,
          year: movie_info.year,
          release_date: movie_info.release_date,
          duration: movie_info.duration,
        } as MovieFields, {
          filePath: (path.dirname(nfo_path) + attr.path).replace(/\\/g, '/'),
          media_lib_id: scanInfo.media_lib_id,
          resource_type: attr.resource_type || 'single',
          name: movie_info.name_cn,
        })
      }
    }
  }
  async scan(file_path: any, media_lib_id: any, is_top: boolean = false) {
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
              skip: false
            }
          });
        } else {
          console.log(`${filePath} is not video file`);
        }
      }
    }
    if (is_top) {
      libs.getById(media_lib_id).then((data: any) => {
        libs.updateById(media_lib_id, {
          ...data,
          is_scaned: true,
          scan_loading: false
        })
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