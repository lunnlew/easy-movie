

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import { GlobalEventEmitterType } from '@/types/EventEmitter';

class MovieFile {
    event: GlobalEventEmitterType;
    knex;
    tableName;
    constructor() {
        this.event = application.event
        this.knex = application.knex
        this.tableName = 'movie_files'
    }
    async save(movieInfo: any) {
        return this.knex(this.tableName).insert(movieInfo)
    }
    async update(oldId: any, data: any) {
        return this.knex(this.tableName).where({ id: oldId }).update(data)
    }
    async updateLibId(oldId: any, newId: any) {
        return this.knex(this.tableName).where({ media_lib_id: oldId }).update({
            media_lib_id: newId
        })
    }
    async getByPath(path: string) {
        return this.knex(this.tableName).where({ path }).first()
    }
    async list(offset: any, size: any) {
        return this.knex(this.tableName).column(['id', 'name']).limit(size).offset(offset).select()
    }
}

export default new MovieFile()