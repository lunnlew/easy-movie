import { Router } from 'express'
import movie from '../database/movie'
import { buildResult, buildErrResult, getFirstChar } from '../utils'
import fs from 'fs'
import path from 'path'
import { __fix_dirname } from '../preference'
import application from '../libs/application';
import movie_files from '../database/movie_files'
import actors from '../database/actors'

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
        res.json(buildResult(data.map((item: any) => ({
            ...item,
            poster: (item.poster || item.poster_url) ? 'movie/poster/' + item.id : ''
        }))))
    }).catch((err: any) => {
        res.json(buildErrResult(err.message, 500))
    })
}

function movieDetail(req: any, res: any, next: any) {
    let id = req.body.movieId;
    movie.getById(id).then((data: any) => {
        res.json(buildResult({
            ...data,
            poster: (data.poster || data.poster_url) ? 'movie/poster/' + data.id : '',
            backdrop: (data.backdrop || data.backdrop_url) ? 'movie/backdrop/' + data.id : ''
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
        res.json(buildResult(data.map((item: any) => ({
            ...item,
            avatar: (item.avatar || item.avatar_url) ? 'movie/' + id + '/avatar/' + item.id : ''
        }))))
    }).catch((err: any) => {
        res.json(buildErrResult(err.message, 500))
    })
}

const moviePoster = async (req: any, res: any, next: any) => {
    let id = req.params.movie_id;
    movie.getById(id).then((movie_data: any) => {
        if (!movie_data) {
            return res.sendStatus(404);
        }
        if (!movie_data.poster && !movie_data.poster_url) {
            res.sendStatus(404);
        } else if (movie_data.poster && movie_data.poster.indexOf('http') === 0) {
            application.event.emit('movie:download-poster', {
                id: movie_data.id,
                media_lib_id: movie_data.media_lib_id || '',
                path: movie_data.path || '',
                poster: movie_data.poster || '',
                resource_type: movie_data.resource_type || ''
            })
            res.sendStatus(404);
        } else if (!movie_data.poster && movie_data.poster_url.indexOf('http') === 0) {
            application.event.emit('movie:download-poster', {
                id: movie_data.id,
                media_lib_id: movie_data.media_lib_id || '',
                path: movie_data.path || '',
                poster: movie_data.poster_url || '',
                resource_type: movie_data.resource_type || ''
            })
            res.sendStatus(404);
        } else {
            let f = ''
            if (movie_data.resource_type == 'single') {
                f = path.resolve(path.dirname(movie_data.path), movie_data.poster)
            } else if (movie_data.resource_type == 'origin-disk') {
                f = path.resolve(movie_data.path, movie_data.poster)
            }
            console.log(f)
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

const movieActorAvatar = async (req: any, res: any, next: any) => {
    let actor_id = req.params.actor_id;
    let movie_id = req.params.movie_id;
    let movie_data = await movie.getById(movie_id)
    actors.getById(actor_id).then((data: any) => {
        if (!data) {
            return res.sendStatus(404);
        }
        if (!data.avatar && !data.avatar_url) {
            res.sendStatus(404);
        } else if (data.avatar && data.avatar.indexOf('http') === 0) {
            application.event.emit('cast:download-avator', {
                imdb_id: data.imdb_id,
                id: data.id,
                path: movie_data.path,
                avatar: data.avatar
            })
            res.sendStatus(404);
        } else if (!data.avatar && data.avatar_url.indexOf('http') === 0) {
            application.event.emit('cast:download-avator', {
                imdb_id: data.imdb_id,
                id: data.id,
                path: movie_data.path,
                avatar: data.avatar_url
            })
            res.sendStatus(404);
        } else {
            let f = ''
            if (movie_data.resource_type == 'single') {
                f = path.resolve(path.dirname(movie_data.path) + '/.avatar/', data.avatar)
            } else if (movie_data.resource_type == 'origin-disk') {
                f = path.resolve(movie_data.path + '/.avatar/', data.avatar)
            }
            console.log(f)
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
    movie.getById(id).then((movie_data: any) => {
        if (!movie_data.backdrop && !movie_data.backdrop_url) {
            res.sendStatus(404);
        } else if (movie_data.backdrop && movie_data.backdrop.indexOf('http') === 0) {
            application.event.emit('movie:download-backdrop', {
                id: movie_data.id,
                media_lib_id: movie_data.media_lib_id || '',
                path: movie_data.path || '',
                backdrop: movie_data.backdrop || '',
                resource_type: movie_data.resource_type
            })
            res.sendStatus(404);
        } else if (!movie_data.backdrop && movie_data.backdrop_url.indexOf('http') === 0) {
            application.event.emit('movie:download-backdrop', {
                id: movie_data.id,
                media_lib_id: movie_data.media_lib_id || '',
                path: movie_data.path || '',
                backdrop: movie_data.backdrop_url || '',
                resource_type: movie_data.resource_type
            })
            res.sendStatus(404);
        } else {
            let f = ''
            if (movie_data.resource_type == 'single') {
                f = path.resolve(path.dirname(movie_data.path), movie_data.backdrop)
            } else if (movie_data.resource_type == 'origin-disk') {
                f = path.resolve(movie_data.path, movie_data.backdrop)
            }
            console.log(f)
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
                media_lib_id: new_data.media_lib_id,
                updated_at: Date.now()
            }).catch(err => { throw err });
        }

        await movie.update(old_data.id, {
            name_cn: new_data.name_cn,
            first_char_cn: getFirstChar(new_data.name_cn),
            year: new_data.year,
            updated_at: Date.now()
        }).catch(err => { throw err });

        res.json(buildResult({}));
    } catch (err) {
        res.json(buildErrResult('movie not found', 404));
    }
}

const movieActorsFilterList = function (req: any, res: any, next: any) {
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    let name = req.body.name || '';
    actors.list(name, (page - 1) * size, size).then((data: any) => {
        res.json(buildResult(data))
    }).catch((err: any) => {
        res.json(buildErrResult(err.message, 500))
    })
}

router.post("/list", movieList)
router.post("/actors-filter", movieActorsFilterList)
router.post("/actors", actorsList)
router.post("/detail", movieDetail)
router.post("/update", movieUpdate)
router.all("/poster/:movie_id", moviePoster)
router.all("/:movie_id/avatar/:actor_id", movieActorAvatar)
router.all("/backdrop/:movie_id", movieBackdrop)

export default router