

import { __fix_dirname } from '../preference';
import application from '../libs/application';
class TvScan {
  event;
  constructor() {
    this.event = application.event
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