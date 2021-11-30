'use strict'

import { Router } from 'express'
import { buildResult, buildErrResult } from '../utils'
import dataM from '../database/DataM'


const router = Router();

const list = async (req: any, res: any, next: any) => {
    let list = req.body.list
    let media_lib_id = req.body.media_lib_id
    try {
        let result: any = {}
        for (let item of list) {
            let count = await dataM.knexInstance('movie_files')
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
        res.json(buildResult(result, 200, 'sucess'))
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

router.post("/list", list)

export default router