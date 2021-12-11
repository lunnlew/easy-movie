import EventEmitter from 'events'
import application from '../libs/application'
import { ApplicationType } from './Application'
import { CastEventMap } from './CastEventEmitterType'
import { MovieEventMap } from './MovieEventEmitterType'
import { ScraperEventMap } from './ScraperEventEmitterType'
import { ViewEventMap } from './ViewEventEmitterType'
import { ScanEventMap } from './ScanEventEmitterType'

/**
 * 类型合并定义
 */
type AllEventMap = CastEventMap & MovieEventMap & ScraperEventMap & ViewEventMap & ScanEventMap

/**
 * on事件类型
 */
type GlobalOnEventType = keyof AllEventMap;

/**
 * on事件数据
 */
type EventOnPayload<T extends GlobalOnEventType> = AllEventMap[T];

/**
 * emit事件数据
 */
type EventEmitPayload<T extends GlobalOnEventType> = AllEventMap[T];

/**
 * 全局事件实例类型
 */
export class GlobalEventEmitterType extends EventEmitter {
    on<T extends GlobalOnEventType>(event: T, listener: (data: EventOnPayload<T>) => void | Promise<void>): this;
    once<T extends GlobalOnEventType>(event: T, listener: (data: EventOnPayload<T>) => void | Promise<void>): this;
    off<T extends GlobalOnEventType>(event: T, listener: (data: EventOnPayload<T>) => void | Promise<void>): this;
    emit<T extends GlobalOnEventType>(event: T, ...args: Parameters<(data: EventEmitPayload<T>) => void>): this;
    emit<T extends GlobalOnEventType>(event: T): this;
}