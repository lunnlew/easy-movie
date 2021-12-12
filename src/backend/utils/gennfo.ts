import application from "../libs/application"
import MediaNFO from "../libs/mediaNFO"
import path from 'path'
import fs from 'fs'
import { MovieFields } from "@/types/Movie"

/**
 * 生成nfo文件
 */
export default class gennfo {
    async generate(payload) {
        let { movie_id, dir_path } = payload
        let movie: MovieFields = await application.knex('movies').where('id', movie_id).first()

        let stats = fs.statSync(dir_path)
        // 是文件的话取得父目录
        if (stats.isFile()) {
            dir_path = path.dirname(dir_path)
        }

        let nfo_path = path.join(dir_path, movie.name + '.nfo')
        const nfo_file = new MediaNFO(nfo_path)
        nfo_file.setName(movie.name)
            .setSummary(movie.summary)
            .setBackdrop(movie.backdrop)
            .setPoster(movie.poster)
            .setDuration(movie.duration)
            .setIMDB_ID(movie.imdb_id)
            .setIMDB_Rating(movie.imdb_rating)
            .setIMDB_Votes(movie.imdb_votes)
            .setLanguage(movie.language)
            .setReleaseDate(movie.release_date)
            .setReleaseYear(movie.year)
            .setPoster(movie.poster)
            .write()
    }
}