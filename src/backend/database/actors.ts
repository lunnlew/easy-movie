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
    async list(offset: any, size: any) {
        return this.knex(this.tableName).column(['id', 'name']).limit(size).offset(offset).select()
    }
}

export default new actors()