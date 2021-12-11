
import application from '../libs/application'
import fs from 'fs'
import path from 'path'
import MediaNFO from '../libs/mediaNFO'

class genNFO {
    constructor() {
        console.log('genNFO initialize')
    }
    async initialize() {
        let offet = 0
        let limit = 100
        let list = []
        do {
            list = await application.knex('movie_files').offset(offet).limit(limit).select('id', 'name', 'type', 'resource_type', 'path', 'movie_id')
            for (let file of list) {
                if (file.resource_type == 'single') {
                    let dir_path = file.path
                    // 文件路径不存在清除数据库记录
                    if (!fs.existsSync(dir_path)) {
                        application.event.emit('clean-movie-path', {
                            fid: file.id,
                            path: dir_path,
                        })
                        console.log(`${dir_path} not exists`)
                        continue
                    }
                    let stats = fs.statSync(dir_path)
                    // 是文件的话取得父目录
                    if (stats.isFile()) {
                        dir_path = path.dirname(dir_path)
                    }
                    let movie = await application.knex('movies').where('id', file.movie_id).first()
                    let nfo_path = path.join(dir_path, movie.name + '.nfo')
                    const nfo_file = new MediaNFO(nfo_path)
                    nfo_file.setName(movie.name)
                        .setPoster(file.poster)
                        .write()
                }
            }
            offet += limit
            await new Promise((resolve, reject) => setTimeout(resolve, 1000))
        } while (list.length > 0)
    }
}
export default new genNFO();