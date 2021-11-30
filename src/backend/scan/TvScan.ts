'use strict'

import { __fix_dirname } from '../config';
import application from '../application';
const path = require('path');
const fs = require('fs');
class TvScan {
  eventEmitter;
  constructor() {
    this.eventEmitter = application.eventEmitter
    this.initialize();
  }
  async initialize() {
    console.log('TvScan initialize');
  }
  async scan(dirname: any, media_lib_id: any, is_top: boolean = false) {
    // 
  }
}
export default new TvScan()