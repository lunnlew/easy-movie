'use strict'

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import scraper from './scraper'
import dataM from '../database/DataM'
import { v4 as uuidv4 } from 'uuid'
import { ScraperInitTask, ScraperResultTask } from '../types/index'

// 由于可能的API调用限制，所以将任务放在一个队列中进行处理
/**
 * 采集任务队列
 */
class ScraperQueue {
    eventEmitter;
    running: boolean;
    queues: Array<ScraperInitTask>;
    knex
    constructor() {
        this.eventEmitter = application.eventEmitter
        this.knex = dataM.knexInstance
        this.running = false;
        this.queues = []
        if (!dataM.inited) {
            setTimeout(() => { this.initialize(); }, 10000)
        } else {
            this.initialize()
        }
    }
    async initialize() {
        console.log('ScraperQueue initialize');
        this.eventEmitter.on('scraper-queue:start', async () => {
            // 如果正在运行，则不再运行
            if (this.running) return;
            console.log('ScraperQueue start');
            this.running = true;
            while (this.queues.length > 0) {
                let task = this.queues.shift();
                // 这里不使用await，可尽可能利用时间
                scraper.execute(task as ScraperInitTask)
                // 至少间隔1秒执行一次
                await new Promise<void>((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                })
            }
            this.running = false;
            this.eventEmitter.emit('scraper-queue:refresh')
        })
        // 增加队列元素
        this.eventEmitter.on('scraper-queue:add-task', async (task: ScraperInitTask) => {
            console.log('scraper-queue:add-task', task.task_type || '', task.payload.name, task.task_event || '');
            const uuid = uuidv4();
            task = {
                task_uuid: uuid,
                ...task
            } as ScraperInitTask
            this.knex('scraper_queue').insert({
                uuid,
                fail_count: 0,
                priority: task.task_priority,
                json: JSON.stringify(task)
            }).catch(err => {
                console.log('新增数据库任务失败', err);
            })
            if (!this.running) {
                this.eventEmitter.emit('scraper-queue:refresh')
            }
        })
        // 刷新任务状态
        this.eventEmitter.on('scraper-queue:submit-task', async (task: ScraperResultTask) => {
            console.log('刮削结果', task.task_uuid, task.task_event, task.task_state, task.task_msg || '');
            if (task.task_state === 'success') {
                this.knex('scraper_queue').where({
                    uuid: task.task_uuid
                }).del().catch(err => {
                    console.log('删除刮削任务失败', task.task_uuid, err);
                })
                if (task.task_event) {
                    this.eventEmitter.emit(task.task_event, task.payload)
                }
            } else if (task.task_state === 'error') {
                this.knex('scraper_queue').where({
                    uuid: task.task_uuid
                }).increment('fail_count').catch(err => {
                    console.log('更新刮削失败次数不成功', task.task_uuid);
                })
            } else if (task.task_state === 'fail') {
                console.log('刮削失败', task.task_uuid);
                this.knex('scraper_queue').where({
                    uuid: task.task_uuid
                }).del().catch(err => {
                    console.log('删除刮削任务失败', task.task_uuid, err);
                })
            } else {
                console.log('不支持的任务', task.task_uuid);
            }
        })
        // 刷新队列状态
        this.eventEmitter.on('scraper-queue:refresh', async () => {
            if (this.running) {
                console.log('刮削队列正在运行，不刷新队列');
                return;
            }
            let tasks = await this.knex('scraper_queue')
                .select('*')
                .where('fail_count', '<=', 3)
                .limit(30)
                .orderBy('priority', 'asc')
                .catch(err => {
                    console.log('获取刮削任务失败', err);
                })
            let old_queues = this.queues.map(item => item.task_uuid);
            let loaded_tasks = [] as any
            if (tasks) {
                for (let task of tasks) {
                    // 不重复加载仍在队列中的任务
                    if (old_queues.indexOf(task.uuid) === -1) {
                        loaded_tasks.push(JSON.parse(task.json))
                    }
                }
            }
            if (loaded_tasks.length > 0) {
                this.queues = this.queues.concat(loaded_tasks)
                console.log('ScraperQueue Load tasks', loaded_tasks.length, this.queues.length);
                console.log('ScraperQueue will run', this.queues.length);
                this.eventEmitter.emit('scraper-queue:start')
            }
            if (!this.queues.length) {
                console.log('ScraperQueue Idle');
            }
        })
        // 触发队列执行
        this.eventEmitter.emit('scraper-queue:start')
    }
}
export default new ScraperQueue();