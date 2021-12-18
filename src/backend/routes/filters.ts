

import { Router } from 'express'
import { buildResult, buildErrResult } from '../utils'
import application from '../libs/application'


const router = Router();

const list = async (req: any, res: any, next: any) => {
    let list = req.body.list
    let media_lib_id = req.body.media_lib_id
    let type = req.body.type
    try {
        let result: any = {}
        if (type === 'type_filter') {
            for (let item of list) {
                let count = await application.knex('movie_files')
                    .join('movies', function () {
                        this.on('movie_files.movie_id', '=', 'movies.id')
                    })
                    .where(`movies.genres`, 'like', `%${item.name}%`)
                    .andWhere(function () {
                        if (media_lib_id) {
                            this.where(`movie_files.media_lib_id`, media_lib_id)
                        }
                    }).on('query', function (query: any) {
                        console.log(query.sql)
                    })
                    .count('movies.id')
                    .catch(err => { throw err })
                if (count && count.length > 0) {
                    result[item.key] = count[0]['count(`movies`.`id`)'] || 0
                } else {
                    result[item.key] = 0
                }
            }
        } else if (type === 'tag_filter') {
            for (let item of list) {
                let knex = application.knex('movie_files')
                    .join('movies', function () {
                        this.on('movie_files.movie_id', '=', 'movies.id')
                    })

                if (item.key === 'watched') {// 已观看
                    knex = knex.where(`movie_files.watched`, 1)
                } else if (item.key === 'unwatched') {// 未观看
                    knex = knex.andWhere(function () {
                        this.where(`movie_files.watched`, '<>', 1).orWhere(`movie_files.watched`, null)
                    })
                } else if (item.key === 'recently_added') { // 最近添加
                    knex = knex.where(`movie_files.created_at`, '>', new Date(new Date().getTime() - 24 * 60 * 60 * 1000))
                } else {
                    // knex = knex.where(`movies.tags`, 'like', `%${item}%`)
                }

                let count = await knex.andWhere(function () {
                    if (media_lib_id) {
                        this.where(`movie_files.media_lib_id`, media_lib_id)
                    }
                }).on('query', function (query: any) {
                    console.log(query.sql)
                })
                    .count('movies.id')
                    .catch(err => { throw err })
                if (count && count.length > 0) {
                    result[item.key] = count[0]['count(`movies`.`id`)'] || 0
                } else {
                    result[item.key] = 0
                }
            }
        }
        res.json(buildResult(result, 200, 'sucess'))
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

router.post("/list", list)

export default router