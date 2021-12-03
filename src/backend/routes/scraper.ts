'use strict'

import { Router } from 'express'
import { MovieDb as MovieDbApi } from 'moviedb-promise'
import { buildResult, buildErrResult } from '../utils'
import { imdb_apikey, imdb_apiurl, imdb_imgbase } from '../preference';
import application from '../libs/application';
import { ScraperInitTask, ScraperMovieRequestPayload } from '../types';
import movie from '../database/movie';
import RequestAdapter from '../libs/RequestAdapter';

const router = Router();
const imdb_api = new MovieDbApi(imdb_apikey, imdb_apiurl);

const search = async (req: any, res: any, next: any) => {
    let name = req.body.name
    try {
        let data = await imdb_api.searchMovie({ query: name, language: 'zh' }, {
            adapter: RequestAdapter as any,
            // proxy: false,
            // httpsAgent: application.buildHttpsTunnelAgent()
        }).catch(err => { throw err })
        res.json(buildResult(data?.results?.map((item: any) => ({ ...item, poster_path: item.poster_path ? imdb_imgbase + item.poster_path : null }))))
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

const bind = async (req: any, res: any, next: any) => {
    let imdb_movie = req.body.imdb_movie
    let current = req.body.current
    try {
        let data = await movie.getById(current.id).catch(err => { throw err })
        if (data.id) {
            // 去刮削影视信息
            application.eventEmitter.emit('scraper-queue:add-task', {
                task_event: 'scraper:start:fetch-movie',
                task_priority: 1,
                payload: {
                    name: imdb_movie.title,
                    year: imdb_movie.release_date?.substr(0, 4),
                    language: 'zh',
                    movie_id: current.id,
                    imdb_id: data.imdb_id,
                    media_lib_id: data.media_lib_id,
                    path: data.path
                } as ScraperMovieRequestPayload
            } as ScraperInitTask);
            res.json(buildResult(''))
        } else {
            res.json(buildErrResult('movie not found', 500))
        }
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

router.post("/search", search)
router.post("/bind", bind)

export default router