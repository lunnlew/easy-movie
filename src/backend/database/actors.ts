'use strict'

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import dataM from './DataM'

class actors {
    eventEmitter;
    knex;
    tableName;
    constructor() {
        this.eventEmitter = application.eventEmitter
        this.knex = dataM.knexInstance
        this.tableName = 'actors'
    }
    async list(name: string, offset: any, size: any) {
        return this.knex('actors')
            .distinct(['actors.id', 'actors.name'])
            .leftJoin('actor_movie', function () {
                this.on('actor_movie.actor_id', '=', 'actors.id')
            })
            .where('actors.name', 'like', `%${name}%`)
            .andWhere('actor_movie.job', '=', 'Actor')
            .limit(size).offset(offset).select()
    }
}

export default new actors()