

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import { GlobalEventEmitterType } from '@/types/EventEmitter';

class actors {
    event: GlobalEventEmitterType;
    knex;
    tableName;
    constructor() {
        this.event = application.event
        this.knex = application.knex
        this.tableName = 'actors'
    }
    async getById(id: any) {
        return this.knex('actors').where('actors.id', id).first()
    }
    async list(name: string, offset: any, size: any) {
        return this.knex('actors')
            .distinct(['actors.id', 'actors.name_cn'])
            .leftJoin('actor_movie', function () {
                this.on('actor_movie.actor_id', '=', 'actors.id')
            })
            .where('actors.name_cn', 'like', `%${name}%`)
            .andWhere('actor_movie.job', '=', 'Actor')
            .limit(size).offset(offset).select()
    }
}

export default new actors()