

import { __fix_dirname } from '../preference';
import Moviedb from './lib/moviedb';
import application from '../libs/application';
import { GlobalEventEmitterType } from '@/types/EventEmitter';
import { IScraper } from '@/types/ScraperEventEmitterType';


/**
 * 采集器
 */
class Scraper {
    scraper_list: Array<IScraper> = [];
    event: GlobalEventEmitterType;
    constructor() {
        this.event = application.event
        this.initialize();
    }
    async initialize() {
        console.log('Scraper Libs initialize');
        this.scraper_list.push(new Moviedb(application));
        this.event.on('scraper:start:fetch-movie', async (task) => {
            console.log('scraper:start:fetch-movie', task.task_uuid, task.payload.movie_id, task.payload.name, task.payload.year);
            // 找到刮削器
            let scraper = this.scraper_list[0]
            this.event.emit('scraper:' + scraper.scraper_id + ':fetch-movie' as 'scraper-app:fetch-movie', task);
        })
        this.event.on('scraper:start:fetch-cast', async (task) => {
            console.log('scraper:start:fetch-cast', task.task_uuid, task.payload.actor_id, task.payload.name);
            // 找到刮削器
            let scraper = this.scraper_list[0]
            this.event.emit('scraper:' + scraper.scraper_id + ':fetch-cast' as 'scraper-app:fetch-cast', task);
        })
    }
    async execute(task) {
        console.log('Scraper execute', task);
        if (task.task_event) {
            this.event.emit(task.task_event as any, task);
        } else {
            console.log('Scraper execute error', '不存在的事件名称');
        }
    }
}
export default new Scraper();