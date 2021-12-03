'use strict'

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import dataM from '../database/DataM'
class movie {
    eventEmitter;
    knex;
    tableName;
    constructor() {
        this.eventEmitter = application.eventEmitter
        this.knex = dataM.knexInstance
        this.tableName = 'movies'
    }
    async getByName(name: any) {
        return this.knex.select(['movies.*', 'movie_files.path', 'movie_files.id as fid', 'movie_files.media_lib_id']).from('movie_files').join('movies', function () {
            this.on('movie_files.movie_id', '=', 'movies.id')
        }).where('movies.name', name).first()
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
        let knex = this.knex
            .select(['movies.id', 'movie_files.id as fid', 'movie_files.media_lib_id', 'movies.name', 'movies.year', 'movies.poster'])
            .limit(size)
            .offset(offset)
            .from('movie_files')
            .join('movies', function () {
                this.on('movie_files.movie_id', '=', 'movies.id')
            })
            .andWhere(function () {
                for (let key in filters) {
                    if (typeof filters[key] === 'object' && 'length' in filters[key]) {
                        if (filters[key][0] === 'like') {
                            // {genres: ['like', ['动作']]}
                            if (filters[key][1].length > 0) {
                                this.andWhere(function () {
                                    for (let name of filters[key][1]) {
                                        this.orWhere(`movies.${key}`, 'like', `%${name}%`)
                                    }
                                })
                            }
                        }
                    } else {
                        this.andWhere(`movie_files.${key}`, filters[key])
                    }
                }
            })
            .andWhere(function () {
                for (let field of search.fields) {
                    this.orWhere(`movies.${field}`, 'like', `%${search.value}%`)
                }
            })
        return knex.orderBy(`movie_files.${sort.sort_field}`, sort.sort_order).on('query', function (query: any) {
            console.log(query.sql)
        })
    }
}

export default new movie()