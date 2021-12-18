

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import { GlobalEventEmitterType } from '@/types/EventEmitter';

class libs {
    event: GlobalEventEmitterType;
    knex;
    tableName;
    constructor() {
        this.event = application.event
        this.knex = application.knex
        this.tableName = 'media_libs'
    }
    async save(libInfo: any) {
        return this.knex(this.tableName).insert({
            ...libInfo,
            created_at: Date.now(),
            updated_at: Date.now()
        })
    }
    async updateById(id: any, libInfo: any) {
        return this.knex(this.tableName).where({ id }).update({
            ...libInfo,
            updated_at: Date.now()
        })
    }
    async updateByName(name: any, libInfo: any) {
        return this.knex(this.tableName).where({ name }).update({
            ...libInfo,
            updated_at: Date.now()
        })
    }
    async getByName(name: any) {
        return this.knex(this.tableName).where({ name: name }).first()
    }
    async getById(id: any) {
        return this.knex(this.tableName).where({ id: id }).first()
    }
    async removeByName(name: any) {
        return this.knex(this.tableName).where({ name }).del()
    }
    async removeById(id: any) {
        return this.knex(this.tableName).where({ id }).del()
    }
    async list(offset: any, size: any) {
        return this.knex(this.tableName).column(['id', 'name', 'type', 'path']).limit(size).offset(offset).select()
    }
}

export default new libs()