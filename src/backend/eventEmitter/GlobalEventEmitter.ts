'use strict'

import EventEmitter from 'events'
import { ScraperDownloadTask, ScraperInitTask, ScraperResultTask } from '../types';

/**
 * 刮削队列事件
 */
declare interface ScraperQueueEvent {
  /**
   * 新增刮削任务
   * @param event 
   * @param listener 
   */
  on(event: 'scraper-queue:add-task', listener: (task: ScraperInitTask) => void): this;
  /**
   * 刷新刮削任务队列
   * @param event 
   * @param listener 
   */
  on(event: 'scraper-queue:refresh', listener: (task: ScraperInitTask) => void): this;
  /**
   * 启动任务队列
   * @param event 
   * @param listener 
   */
  on(event: 'scraper-queue:start', listener: (task: ScraperInitTask) => void): this;
  /**
   * 提交任务结果
   * @param event 
   * @param listener 
   */
  on(event: 'scraper-queue:submit-task', listener: (task: ScraperResultTask) => void): this;
}
/**
 * 影片刮削事件
 */
declare interface MovieScraperEvent {
  /**
   * 抓取电影信息
   * @param event 
   * @param listener 
   */
  on(event: 'scraper:start:fetch-movie', listener: (task: ScraperInitTask) => void): this;
  /**
   * 抓取演职员信息
   * @param event 
   * @param listener 
   */
  on(event: 'scraper:start:fetch-cast', listener: (task: ScraperInitTask) => void): this;
  /**
   * 下载演员海报
   * @param event 
   * @param listener 
   */
  on(event: 'cast:download-avator', listener: (task: ScraperInitTask) => void): this;
  /**
   * 下载影片海报
   * @param event 
   * @param listener 
   */
  on(event: 'movie:download-poster', listener: (task: ScraperDownloadTask) => void): this;
  /**
   * 下载影片幕布
   * @param event 
   * @param listener 
   */
  on(event: 'movie:download-backdrop', listener: (task: ScraperDownloadTask) => void): this;
  /**
   * 更新影片演员
   * @param event 
   * @param listener 
   */
  on(event: 'movie:update-casts', listener: (task: any) => void): this;
  /**
   * 更新影片职员
   * @param event 
   * @param listener 
   */
  on(event: 'movie:update-crews', listener: (task: any) => void): this;
  /**
   * 保存影片演职员信息
   * @param event 
   * @param listener 
   */
  on(event: 'cast:save-info', listener: (task: any) => void): this;
  /**
   * 保存影片信息
   * @param event 
   * @param listener 
   */
  on(event: 'movie:save-info', listener: (task: any) => void): this;
}
/**
 * 影片文件目录扫描事件
 */
declare interface MovieScannerEvent {
  /**
   * 影片文件目录扫描结果
   * @param event 
   * @param listener 
   */
  on(event: 'scan:item-result', listener: (task: ScraperInitTask) => void): this;
}

/**
 * 客户端页面更新事件
 */
declare interface MovieViewEvent {
  /**
  * 通知客户端电影列表页更新
  * @param event 
  * @param listener 
  */
  on(event: 'render:list-view:update', listener: (task: ScraperInitTask) => void): this;
  /**
  * 通知客户端扫描结束
  * @param event 
  * @param listener 
  */
  on(event: 'render:list-view:scan-end', listener: (task: ScraperInitTask) => void): this;
}

export type GlobalEventType = EventEmitter & ScraperQueueEvent & MovieScraperEvent & MovieScannerEvent & MovieViewEvent;
class GlobalEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.initialize();
  }
  getEventEmitter() {
    return this;
  }
  initialize() {
    console.log('GlobalEventEmitter initialize');
  }
}

export default new GlobalEventEmitter()