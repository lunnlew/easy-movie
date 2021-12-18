

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import { GlobalEventEmitterType } from '@/types/EventEmitter';
class movie {
    event: GlobalEventEmitterType;
    knex;
    tableName;
    constructor() {
        this.event = application.event
        this.knex = application.knex
        this.tableName = 'movies'
    }
    async getByName(name: any) {
        return this.knex.select(['movies.*', 'movie_files.path', 'movie_files.id as fid', 'movie_files.media_lib_id']).from('movie_files').join('movies', function () {
            this.on('movie_files.movie_id', '=', 'movies.id')
        }).where('movies.name_cn', name).first()
    }
    async getById(id: any) {
        return this.knex.select(['movies.*', 'movie_files.path', 'movie_files.id as fid', 'movie_files.media_lib_id']).from('movie_files').join('movies', function () {
            this.on('movie_files.movie_id', '=', 'movies.id')
        }).where('movies.id', id).first()
    }
    async getActors(id: any, job: any = 'Acting', size: any = 10) {
        return this.knex.select('*').limit(size).offset(0).from('actor_movie').join('actors', function () {
            this.on('actor_movie.actor_id', '=', 'actors.id')
        }).where({
            movie_id: id,
            job: job
        })
    }
    async save(movieInfo: any) {
        return this.knex(this.tableName).insert(movieInfo)
    }
    async update(oldId: any, data: any) {
        return this.knex(this.tableName).where({ id: oldId }).update(data)
    }
    async list(filters: any, search: any, sort: any, offset: any, size: any) {

        // 先从关联表中查询出演员的电影
        let movieIds = []
        if (filters.actors && filters.actors[1].length > 0) {
            movieIds = await this.knex.select('movie_id')
                .from('actor_movie')
                .whereIn('actor_id', filters.actors[1])
                .on('query', function (query: any) {
                    console.log(query.sql)
                })
            movieIds = Array.from(new Set(movieIds.map(item => item.movie_id)))
        }

        let knex = this.knex
            .select([
                'movies.id',
                'movie_files.id as fid',
                'movie_files.media_lib_id', 'movies.name_cn',
                'movies.name_en',
                'movies.first_char_cn',
                'movies.imdb_rating',
                'movies.duration',
                'movies.language',
                'movies.year',
                'movies.poster',
                'movies.genres'
            ])
            .limit(size)
            .offset(offset)
            .from('movie_files')
            .leftJoin('movies', function () {
                this.on('movie_files.movie_id', '=', 'movies.id')
            })
            .andWhere(function () {
                for (let key in filters) {
                    if (key == 'media_lib_id' && filters[key] == '') {
                        continue
                    }
                    if (typeof filters[key] === 'object' && 'length' in filters[key]) {
                        if (filters[key][0] === 'like' && key == 'genres') {
                            // {genres: ['like', ['动作']]}
                            if (filters[key][1].length > 0) {
                                this.andWhere(function () {
                                    for (let name of filters[key][1]) {
                                        this.orWhere(`movies.${key}`, 'like', `%${name}%`)
                                    }
                                })
                            }
                        } else if (filters[key][0] === 'in' && key == 'actors') {
                            // {actors: ['in', ['1']]}
                            if (filters[key][1].length > 0) {
                                this.andWhere('movies.id', 'in', movieIds)
                            }
                        }
                    } else {
                        this.andWhere(`movie_files.${key}`, filters[key])
                    }
                }
            })
            .andWhere(function () {
                for (let field of search.fields) {
                    if (field === 'name') {
                        this.orWhere(`movies.name_cn`, 'like', `%${search.value}%`)
                        this.orWhere(`movies.name_en`, 'like', `%${search.value}%`)
                    } else {
                        this.orWhere(`movies.${field}`, 'like', `%${search.value}%`)
                    }
                }
            })
        if (['id'].indexOf(sort.sort_field) > -1) {
            knex = knex.orderBy(`movie_files.${sort.sort_field}`, sort.sort_order)
        } else if (['imdb_votes', 'release_date', 'first_char_cn'].indexOf(sort.sort_field) > -1) {
            knex = knex.orderBy(`movies.${sort.sort_field}`, sort.sort_order)
        }
        return knex.on('query', function (query: any) {
            console.log(query.sql)
        })
    }
}

export default new movie()