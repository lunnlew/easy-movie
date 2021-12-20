import application from "../libs/application"
import MediaNFO from "../libs/mediaNFO"
import path from 'path'
import fs from 'fs'
import { MovieFields, MovieFileFields } from "@/types/Movie"
import { CastFields } from "@/types/Cast"

/**
 * 生成nfo文件
 */
export default class gennfo {
    async generate(payload) {
        let { movie_id, file_path } = payload
        let movie: MovieFields = await application.knex('movies').where('id', movie_id).first()
        let movie_files: Array<MovieFileFields & MovieFields> = await application.knex.select(['movies.*', 'movie_files.path', 'movie_files.resource_type']).from('movie_files').join('movies', function () {
            this.on('movie_files.movie_id', '=', 'movies.id')
        }).where({
            movie_id: movie_id
        })
        let movie_casts: Array<CastFields> = await application.knex.select(['actors.*', 'actor_movie.*']).from('actor_movie').join('actors', function () {
            this.on('actor_movie.actor_id', '=', 'actors.id')
        }).where({
            movie_id: movie_id
        })

        let stats = fs.statSync(file_path)
        // 是文件的话取得父目录
        if (stats.isFile()) {
            file_path = path.dirname(file_path)
        }

        let nfo_path = path.join(file_path, movie.name_cn + '.nfo')
        const nfo_file = await new MediaNFO().loadFromFile(nfo_path)
        nfo_file.setName(movie.name_cn)
            .setSummary(movie.summary)
            .setBackdrop(movie.backdrop)
            .setPoster(movie.poster)
            .setDuration(movie.duration)
            .setIMDB_ID(movie.imdb_id)
            .setIMDB_URL(movie.imdb_url)
            .setIMDB_Rating(movie.imdb_rating)
            .setIMDB_Votes(movie.imdb_votes)
            .setLanguage(movie.language)
            .setReleaseDate(movie.release_date)
            .setReleaseYear(movie.year)
            .setPoster(movie.poster)
            .setGenres(movie.genres)
            .setVideos(movie_files.map(v => ({
                path: v.path.replace(file_path.replace(/\\/g, '/'), ''),
                resource_type: v.resource_type
            })))
            .setCasts(movie_casts.map(v => ({
                avatar: v.avatar || '',
                avatar_url: v.avatar_url || '',
                birthday: v.birthday || '',
                deathday: v.deathday || '',
                name_cn: v.name_cn || '',
                name_en: v.name_en || '',
                imdb_id: v.imdb_id || '',
                imdb_sid: v.imdb_sid || '',
                imdb_url: v.imdb_url || '',
                gender: v.gender || 0,
                job: v.job || 'Actor',
                character: v.character || '',
                department: v.department || '',
                place_of_birth: v.place_of_birth || '',
                imdb_rating: v.imdb_rating || 0,
                imdb_votes: v.imdb_votes || 0
            })))
            .write()
    }
}