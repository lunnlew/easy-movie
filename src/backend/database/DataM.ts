

import { __fix_dirname, home_dir } from '../preference';
import { Knex, knex } from 'knex'
import createTable from './createTable'
const path = require('path');
const fs = require('fs');
class DataM {
  knexInstance!: Knex<any, unknown[]>;
  inited: boolean = false;
  constructor() {
    this.initialize();
  }
  async initialize() {
    if (!fs.existsSync(home_dir)) {
      fs.mkdirSync(home_dir);
    }
    const filename = process.env.SQLITE_PATH || path.join(home_dir, 'data.db');
    const config: Knex.Config = {
      client: 'sqlite3',
      connection: { filename },
      migrations: {
        tableName: 'migrations'
      },
      useNullAsDefault: true // sqlite does not support inserting default values
    };
    console.log('DataM initialize', config);
    this.knexInstance = knex(config);
    if (!fs.existsSync(filename)) {
      await createTable(this.knexInstance);
    }
    this.inited = true;
  }
}
export default new DataM()