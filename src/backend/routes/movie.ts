'use strict'

import { Router } from 'express'
import movie from '../database/movie'
import { buildResult, buildErrResult } from '../utils'
import fs from 'fs'
import path from 'path'
import { __fix_dirname } from '../preference'
import application from '../libs/application';
import movie_files from '../database/movie_files'

const router = Router();

const movieList = async (req: any, res: any, next: any) => {
    // 分页
    let pagination = req.body.pagination || {
        page: 1,
        size: 10
    }
    // 搜索
    let search = req.body.search || {
        value: '',
        fields: []
    };
    // 筛选
    let filters = req.body.filters || {
        media_lib_id: ''
    };
    // 排序
    let sort = req.body.sort || {
        sort_field: 'id',
        sort_order: 'asc'
    }
    let page = pagination.page || 1;
    let size = pagination.size || 10;
    let offset = (page - 1) * size;
    movie.list(filters, search, sort, offset, size).then((data: any) => {
        res.json(buildResult(data.map((item: any) => {
            item.poster = 'http://127.0.0.1:6877/api/movie/poster/' + item.id;
            return item;
        })))
    }).catch((err: any) => {
        res.json(buildErrResult(err.message, 500))
    })
}

function movieDetail(req: any, res: any, next: any) {
    let id = req.body.movieId;
    movie.getById(id).then((data: any) => {
        res.json(buildResult({
            ...data,
            poster: 'http://127.0.0.1:6877/api/movie/poster/' + data.id
        }))
    }).catch((err: any) => {
        res.json(buildErrResult(err.message, 500))
    })
}

const actorsList = async (req: any, res: any, next: any) => {
    let id = req.body.movieId;
    let job = req.body.job;
    let size = req.body.size || 10;
    movie.getActors(id, job, size).then((data: any) => {
        res.json(buildResult(data))
    }).catch((err: any) => {
        res.json(buildErrResult(err.message, 500))
    })
}

const moviePoster = async (req: any, res: any, next: any) => {
    let id = req.params.movie_id;
    movie.getById(id).then((data: any) => {
        if (!data) {
            return res.sendStatus(404);
        }
        if (!data.poster && !data.poster_url) {
            res.sendStatus(404);
        } else if (data.poster && data.poster.indexOf('http') === 0) {
            application.eventEmitter.emit('movie:download-poster', {
                movie_id: data.id,
                lib_id: data.media_lib_id || '',
                path: data.path || '',
                poster: data.poster || ''
            })
            res.sendStatus(404);
        } else if (!data.poster && data.poster_url.indexOf('http') === 0) {
            application.eventEmitter.emit('movie:download-poster', {
                movie_id: data.id,
                lib_id: data.media_lib_id || '',
                path: data.path || '',
                poster: data.poster_url || ''
            })
            res.sendStatus(404);
        } else {
            const f = path.resolve(path.dirname(data.path), data.poster)
            if (fs.existsSync(f)) {
                res.setHeader('Content-Type', 'image/png');
                fs.createReadStream(f).pipe(res);
            } else {
                res.sendStatus(404);
            }
        }
    }).catch((err: any) => {
        console.log(err);
        res.sendStatus(404);
    })
}

const movieBackdrop = async (req: any, res: any, next: any) => {
    let id = req.params.movie_id;
    movie.getById(id).then((data: any) => {
        if (!data.backdrop && !data.backdrop_url) {
            res.sendStatus(404);
        } else if (data.backdrop && data.backdrop.indexOf('http') === 0) {
            application.eventEmitter.emit('movie:download-backdrop', {
                movie_id: data.id,
                lib_id: data.media_lib_id || '',
                path: data.path || '',
                backdrop: data.backdrop || ''
            })
            res.sendStatus(404);
        } else if (!data.backdrop && data.backdrop_url.indexOf('http') === 0) {
            application.eventEmitter.emit('movie:download-backdrop', {
                movie_id: data.id,
                lib_id: data.media_lib_id || '',
                path: data.path || '',
                backdrop: data.backdrop_url || ''
            })
            res.sendStatus(404);
        } else {
            const f = path.resolve(path.dirname(data.path), data.backdrop)
            if (fs.existsSync(f)) {
                res.setHeader('Content-Type', 'image/png');
                fs.createReadStream(f).pipe(res);
            } else {
                res.sendStatus(404);
            }
        }
    }).catch((err: any) => {
        console.log(err);
        res.sendStatus(404);
    })
}

const movieUpdate = async function (req: any, res: any, next: any) {
    let old_data = req.body.old;
    let new_data = req.body.new;

    try {
        let result = await movie.getById(old_data.id).catch(err => { throw err });
        if (!result) {
            return res.json(buildErrResult('movie not found', 404));
        }

        if (old_data.media_lib_id !== new_data.media_lib_id) {
            await movie_files.update(old_data.fid, {
                media_lib_id: new_data.media_lib_id
            }).catch(err => { throw err });
        }

        await movie.update(old_data.id, {
            name: new_data.name,
            year: new_data.year,
        }).catch(err => { throw err });

        res.json(buildResult({}));
    } catch (err) {
        res.json(buildErrResult('movie not found', 404));
    }
}
router.post("/list", movieList)
router.post("/actors", actorsList)
router.post("/detail", movieDetail)
router.post("/update", movieUpdate)
router.all("/poster/:movie_id", moviePoster)
router.all("/backdrop/:movie_id", movieBackdrop)

export default router