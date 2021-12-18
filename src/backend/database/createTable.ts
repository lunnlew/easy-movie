
import { Knex } from 'knex'
import { app } from "electron"
import fs from 'fs'
import path from 'path'

export default async function (knex: Knex) {
    console.log('DataM Create Tables');
    // 创建配置表
    await knex.schema.createTable('config', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name').comment('配置名称');
        table.string('type').comment('配置项类别');
        table.string('val').comment('配置值');
        table.integer('state').comment('配置状态');
        table.timestamps();
    });

    // 创建媒体库表
    await knex.schema.createTable('media_libs', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name').comment('媒体库名称');
        table.text('path').comment('媒体库路径');
        table.boolean('is_scaned').comment('是否已扫描');
        table.boolean('scan_loading').comment('是否扫描中');
        table.string('scan_time').comment('扫描时间');
        table.enum('type', ['tv', 'movie']).comment('媒体库类型');
        table.timestamps();
    });

    // 创建电影系列信息表
    await knex.schema.createTable('movies_series_info', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name').comment('电影系列名称');
        table.string('serie').comment('电影季数');
        table.timestamps();
    });

    // 创建电影信息表
    await knex.schema.createTable('movies', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name_cn').comment('电影中文名称');
        table.string('name_en').comment('电影英文名称');
        table.string('original_title').comment('别名');
        table.string('first_char_cn').comment('中文名称首字母');
        table.text('path').comment('电影路径');
        table.string('poster').comment('电影封面');
        table.string('backdrop').comment('电影背景');
        table.string('poster_url').comment('电影封面');
        table.string('backdrop_url').comment('电影背景');
        table.string('summary').comment('电影描述');
        table.string('tags').comment('电影标签');
        table.string('genres').comment('电影类型');
        table.string('subtitle').comment('电影字幕');
        table.string('duration').comment('电影时长');
        table.string('size').comment('电影大小');
        table.string('resolution').comment('电影分辨率');
        table.boolean('is_single').comment('是否单集');
        table.string('year').comment('电影年份');
        table.string('country').comment('电影国家');
        table.string('language').comment('电影语言');
        table.string('original_language').comment('原始语言');
        table.string('spoken_language').comment('电影配音');
        table.string('director').comment('电影导演');
        table.string('writer').comment('电影编剧');
        table.string('starring').comment('电影主演');
        table.string('release_date').comment('电影上映日期');
        table.string('imdb_rating').comment('电影IMDB评分');
        table.string('imdb_votes').comment('电影IMDB评分人数');
        table.string('imdb_id').comment('电影IMDB_ID');
        table.string('imdb_sid').comment('电影IMDB ID');
        table.string('imdb_url').comment('电影IMDB URL');
        table.string('douban_rating').comment('电影豆瓣评分');
        table.string('douban_votes').comment('电影豆瓣评分人数');
        table.string('douban_id').comment('电影豆瓣 ID');
        table.string('douban_url').comment('电影豆瓣 URL');
        table.boolean('is_scraped').comment('是否已爬取');
        table.boolean('is_scraped_at').comment('爬取时间');
        table.timestamps();
    });

    // 创建电影文件存放表
    await knex.schema.createTable('movie_files', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name').comment('文件名称');
        table.text('path').comment('文件路径');
        table.string('type').comment('文件类型');
        table.string('resolution').comment('文件分辨率');
        table.string('size').comment('文件大小');
        table.string('duration').comment('文件时长');
        table.string('subtitle').comment('文件字幕');
        table.string('watched').comment('是否已观看');
        table.string('movie_id').comment('电影ID');
        table.string('serie_id').comment('电影系列ID');
        table.string('media_lib_id').comment('媒体库ID');
        table.enum('resource_type', ['single', 'origin-disk']).comment('资源类型:单文件, 原盘目录');
        table.timestamps();
    });

    // 创建电视剧系列信息表
    await knex.schema.createTable('tv_series_info', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name').comment('电视剧系列名称');
        table.string('serie').comment('电视剧季数');
        table.timestamps();
    });

    // 创建电视剧信息表
    await knex.schema.createTable('tv_shows', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name').comment('电视剧名称');
        table.string('original_title').comment('别名');
        table.text('path').comment('电视剧路径');
        table.string('poster').comment('电视剧封面');
        table.string('backdrop').comment('电视剧背景');
        table.string('desc').comment('电视剧描述');
        table.string('tags').comment('电视剧标签');
        table.string('genres').comment('电视剧类型');
        table.string('subtitle').comment('电视剧字幕');
        table.string('duration').comment('电视剧时长');
        table.string('size').comment('电视剧大小');
        table.string('serie_id').comment('电视剧系列ID');
        table.string('episode').comment('电视剧集数');
        table.string('resolution').comment('电视剧分辨率');
        table.boolean('is-single').comment('是否单集');
        table.string('year').comment('电视剧年份');
        table.string('country').comment('电视剧国家');
        table.string('language').comment('电视剧语言');
        table.string('original_language').comment('原始语言');
        table.string('spoken_language').comment('电视剧配音');
        table.string('director').comment('电视剧导演');
        table.string('writer').comment('电视剧编剧');
        table.string('starring').comment('电视剧主演');
        table.string('release-date').comment('电视剧上映日期');
        table.string('imdb-rating').comment('电视剧IMDB评分');
        table.string('imdb-votes').comment('电视剧IMDB评分人数');
        table.string('imdb-id').comment('电视剧IMDB ID');
        table.string('imdb-url').comment('电视剧IMDB URL');
        table.string('douban-rating').comment('电视剧豆瓣评分');
        table.string('douban-votes').comment('电视剧豆瓣评分人数');
        table.string('douban-id').comment('电视剧豆瓣 ID');
        table.string('douban-url').comment('电视剧豆瓣 URL');
        table.timestamps();
    });

    // 创建电视剧文件存放表
    await knex.schema.createTable('tv_show_files', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name').comment('文件名称');
        table.text('path').comment('文件路径');
        table.string('type').comment('文件类型');
        table.string('resolution').comment('文件分辨率');
        table.string('size').comment('文件大小');
        table.string('duration').comment('文件时长');
        table.string('subtitle').comment('文件字幕');
        table.string('serie_id').comment('电视剧系列ID');
        table.string('tv_serie').comment('季号名');
        table.string('tv_show_id').comment('电视剧ID');
        table.string('tv_ep').comment('集号名');
        table.string('media_lib_id').comment('媒体库ID');
        table.enum('resource_type', ['single', 'origin-disk']).comment('资源类型:单文件, 原盘目录');
        table.timestamps();
    });

    // 创建演职员表
    await knex.schema.createTable('actors', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name_cn').comment('演职员名称');
        table.string('name_en').comment('演职员名称');
        table.string('avatar').comment('演职员头像');
        table.string('avatar_url').comment('演职员头像');
        table.string('gender').comment('演职员性别');
        table.string('imdb_id').comment('演职员imdb_id');
        table.string('imdb_sid').comment('演职员imdb_sid');
        table.string('imdb_url').comment('演职员imdb_url');
        table.string('douban_id').comment('演职员douban_id');
        table.string('birthday').comment('演职员生日');
        table.string('deathday').comment('演职员忌日');
        table.string('place_of_birth').comment('演职员出生地');
        table.string('also_known_as').comment('演员亦称');
        table.string('desc').comment('演职员简介');
        table.boolean('is_scraped').comment('是否已爬取');
        table.boolean('is_scraped_at').comment('爬取时间');
        table.timestamps();
    });

    // 创建演职员与电视剧关联表
    await knex.schema.createTable('actor_tv_show', (table) => {
        table.increments('id').comment('自增ID');
        table.integer('actor_id').comment('演职员ID');
        table.integer('tv_show_id').comment('电视剧ID');
        table.timestamps();
    });

    // 创建演职员与电影关联表
    await knex.schema.createTable('actor_movie', (table) => {
        table.increments('id').comment('自增ID');
        table.integer('actor_id').comment('演职员ID');
        table.integer('movie_id').comment('电影ID');
        table.integer('department').comment('部门');
        table.integer('character').comment('饰演角色');
        table.integer('job').comment('工作');
        table.timestamps();
    });

    // 创建采集任务队列表
    await knex.schema.createTable('scraper_queue', (table) => {
        table.increments('id').comment('自增ID');
        table.string('uuid').comment('采集任务UUID');
        table.integer('priority').comment('采集任务优先级');
        table.integer('fail_count').comment('采集任务失败次数');
        table.text('json').comment('采集任务JSON');
        table.timestamps();
    });

    // 创建回收站
    await knex.schema.createTable('recycle_bin', (table) => {
        table.increments('id').comment('自增ID');
        table.string('name').comment('名称');
        table.enum('type', ['tv', 'movie']).comment('类型');
        table.enum('resource_type', ['single', 'origin-disk', 'serie', 'tv', 'movie']).comment('资源类型:某文件, 某原盘目录, 某系列, 电视剧全, 电影全');
        table.timestamps();
    });

    // 版本号
    const pkgBuf = fs.readFileSync(path.join(app.getAppPath(), 'package.json'))
    const pkg = JSON.parse(pkgBuf.toString())
    await knex('config').insert([{
        name: 'version',
        val: pkg.version
    }])

    // 搜索
    await knex('config').insert([{
        name: '名称',
        val: 'name',
        type: 'search_field',
        state: 1
    }, {
        name: '发布年份',
        val: 'year',
        type: 'search_field',
        state: 0
    }])

    // 筛选-配置-启用项
    await knex('config').insert([{
        name: '类型',
        val: 'type_filter',
        type: 'filter_setting',
        state: 1
    }, {
        name: '主演',
        val: 'main_star_filter',
        type: 'filter_setting',
        state: 1
    }, {
        name: '标签',
        val: 'tag_filter',
        type: 'filter_setting',
        state: 1
    }])

    // 筛选-类型-子项
    await knex('config').insert([{
        name: '',
        val: 'Action',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'Comedy',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'Adventure',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'Tragedy',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'War',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'Thriller',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'Sci-Fi',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'Mystery',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'Horror',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'Fantasy',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'History',
        type: 'type_filter',
        state: 0
    }, {
        name: '',
        val: 'Animation',
        type: 'type_filter',
        state: 0
    }])

    // 筛选-标签-子项
    await knex('config').insert([{
        name: '已观看',
        val: 'watched',
        type: 'tag_filter',
        state: 0
    }, {
        name: '未观看',
        val: 'unwatched',
        type: 'tag_filter',
        state: 0
    }, {
        name: '最近添加',
        val: 'recently_added',
        type: 'tag_filter',
        state: 0
    }])

    // 排序方式
    await knex('config').insert([{
        name: '降序(默认)',
        val: 'desc',
        type: 'sort_type',
        state: 1
    }, {
        name: '升序',
        val: 'asc',
        type: 'sort_type',
        state: 0
    }])

    // 排序字段
    await knex('config').insert([{
        name: '添加时间(默认)',
        val: 'id',
        type: 'sort_field',
        state: 1
    }])
    await knex('config').insert([{
        name: '首字母',
        val: 'first_char_cn',
        type: 'sort_field',
        state: 0
    }])
    await knex('config').insert([{
        name: '发布时间',
        val: 'release_date',
        type: 'sort_field',
        state: 0
    }])
    await knex('config').insert([{
        name: 'IMDB评分',
        val: 'imdb_votes',
        type: 'sort_field',
        state: 0
    }])
}