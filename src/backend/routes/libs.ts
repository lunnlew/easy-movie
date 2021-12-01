'use strict'

import { Router } from 'express'
import libs from '../database/libs'
import { buildResult, buildErrResult } from '../utils'
import tvScan from '../scan/TvScan'
import movieScan from '../scan/MovieScan'
import movie_files from '../database/movie_files'


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
    let name = req.body.name;
    if (name === 'all') {
        return res.json(buildErrResult('跳过默认库的扫描', 500))
    }
    try {
        if (path && type) {
            let data = await libs.getByName(req.body.name).catch(err => { throw err })
            libs.updateByName(req.body.name, {
                ...data,
                scan_loading: true
            })
            if (type === 'tv') {
                tvScan.scan(path, req.body.id || '', true)
            } else if (type === 'movie') {
                movieScan.scan(path, req.body.id || '', true)
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
router.post("/remove", removeLib)
router.post("/detail", getLib)
router.post("/scan", scanLib)

export default router