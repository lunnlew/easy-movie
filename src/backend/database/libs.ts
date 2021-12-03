'use strict'

import { __fix_dirname } from '../preference';
import application from '../libs/application';
import dataM from './DataM'

class libs {
    eventEmitter;
    knex;
    tableName;
    constructor() {
        this.eventEmitter = application.eventEmitter
        this.knex = dataM.knexInstance
        this.tableName = 'media_libs'
    }
    async save(libInfo: any) {
        return this.knex(this.tableName).insert(libInfo)
    }
    async updateById(id: any, libInfo: any) {
        return this.knex(this.tableName).where({ id }).update(libInfo)
    }
    async updateByName(name: any, libInfo: any) {
        return this.knex(this.tableName).where({ name }).update(libInfo)
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