'use strict'

import { __fix_dirname } from '../preference';
import Moviedb from './lib/moviedb';
import application from '../libs/application';
import { ScraperInitTask } from '../types/index'
import { GlobalEventType } from '../eventEmitter/GlobalEventEmitter';

interface IScraper {
    /**
     * 刮削器识别ID
     */
    scraper_id: string;
}

/**
 * 采集器
 */
class Scraper {
    scraper_list: Array<IScraper> = [];
    eventEmitter: GlobalEventType;
    constructor() {
        this.eventEmitter = application.eventEmitter
        this.initialize();
    }
    async initialize() {
        console.log('Scraper Libs initialize');
        this.scraper_list.push(new Moviedb(application));
        this.eventEmitter.on('scraper:start:fetch-movie', async (task: any) => {
            console.log('scraper:start:fetch-movie', task.task_uuid, task.payload.movie_id, task.payload.name, task.payload.year);
            // 找到刮削器
            let scraper = this.scraper_list[0]
            this.eventEmitter.emit('scraper:' + scraper.scraper_id + ':fetch-movie', task);
        })
        this.eventEmitter.on('scraper:start:fetch-cast', async (task: any) => {
            console.log('scraper:start:fetch-cast', task.task_uuid, task.payload.actor_id, task.payload.name);
            // 找到刮削器
            let scraper = this.scraper_list[0]
            this.eventEmitter.emit('scraper:' + scraper.scraper_id + ':fetch-cast', task);
        })
    }
    async execute(task: ScraperInitTask) {
        console.log('Scraper execute', task);
        if (task.task_event) {
            this.eventEmitter.emit(task.task_event, task);
        } else {
            console.log('Scraper execute error', '不存在的事件名称');
        }
    }
}
export default new Scraper();