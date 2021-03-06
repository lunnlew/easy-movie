

import { Router } from 'express'
import libs from '../database/libs'
import { buildResult, buildErrResult } from '../utils'
import tvScan from '../scan/TvScan'
import movieScan from '../scan/MovieScan'
import movie_files from '../database/movie_files'
import application from '../libs/application'


const router = Router();

const libsList = async (req: any, res: any, next: any) => {
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    let offset = (page - 1) * size;
    try {
        let data = await libs.list(offset, size).catch(err => { throw err })
        res.json(buildResult([
            {
                id: '',
                name: 'all',
                path: '',
                type: 'all',
                meta: {
                    title: '全部'
                }
            },
            ...data
        ]))
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

const saveLib = async (req: any, res: any, next: any) => {
    let lib = req.body;
    try {
        let data = await libs.save(lib).catch(err => { throw err })
        res.json(buildResult(data))
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

const updateLib = async (req: any, res: any, next: any) => {
    let lib = req.body;
    try {
        let lib_id = lib.lib_id
        let newpath = lib.newpath.replace(/\\/g, '/')
        delete lib.lib_id
        delete lib.newpath
        let data = await libs.updateById(lib_id, {
            ...lib,
            path: newpath
        }).catch(err => { throw err })
        let offset = 0
        let size = 30
        let count = await application.knex('movie_files').where('media_lib_id', lib_id).count('id')
        let total = count[0]['count(`id`)'] as number || 0
        while (total > 0) {
            console.log(`更新库${lib_id}的${offset}-${offset + size}条数据`)
            let movie_files = await application.knex('movie_files').where('media_lib_id', lib_id).offset(offset).limit(size)
            let ids = movie_files.map(item => item.id)
            let movie_ids = Array.from(new Set(movie_files.map(item => item.movie_id)))
            await application.knex('movie_files').whereIn('id', ids).update({
                path: application.knex.raw('replace(`path`, ?, ?)', [lib.path, newpath])
            }).on('query', (query: any) => {
                console.log(query.sql, lib.path, ids)
            }).catch(err => { throw err })
            await application.knex('movies').whereIn('id', movie_ids).update({
                path: application.knex.raw('replace(`path`, ?, ?)', [lib.path, newpath])
            }).on('query', (query: any) => {
                console.log(query.sql, lib.path, movie_ids)
            }).catch(err => { throw err })
            offset += size
            total -= movie_files.length
        }
        res.json(buildResult(data))
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

const removeLib = async (req: any, res: any, next: any) => {
    let id = req.body.id;
    if (!id) {
        res.json(buildErrResult('需要提供id参数', 500))
        return
    }
    try {
        let lib = await libs.getById(id).catch(err => { throw err })
        if (lib.id) {
            movie_files.updateLibId(lib.id, '')
            await libs.removeById(id)
        }
        res.json(buildResult({}, 200, '删除成功'))
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

const getLib = async (req: any, res: any, next: any) => {
    let name = req.body.name;
    try {
        let data = await libs.getByName(name).catch(err => { throw err })
        res.json(buildResult(data))
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

const scanLib = async (req: any, res: any, next: any) => {
    let path = req.body.lib_path;
    let type = req.body.type;
    let lib_name = req.body.name;
    let lib_id = req.body.lib_id;
    if (lib_name === 'all') {
        return res.json(buildErrResult('跳过默认库的扫描', 500))
    }
    try {
        if (path && type) {
            let data = await libs.getByName(lib_name).catch(err => { throw err })
            libs.updateByName(lib_name, {
                ...data,
                scan_loading: true
            })
            if (type === 'tv') {
                tvScan.scan(path, lib_id || '', true)
            } else if (type === 'movie') {
                movieScan.scan(path, lib_id || '', true)
            }
            res.json(buildResult({}, 200, '提交扫描中'))
        } else {
            res.json(buildErrResult('参数错误', 500))
        }
    } catch (err: any) {
        res.json(buildErrResult(err.message, 500))
    }
}

router.post("/list", libsList)
router.post("/save", saveLib)
router.post("/update", updateLib)
router.post("/remove", removeLib)
router.post("/detail", getLib)
router.post("/scan", scanLib)

export default router