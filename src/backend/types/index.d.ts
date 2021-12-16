
/**
 * 有效的消息动作名称
 */
const invokeMainActions = [
    "loadConfig",
    "showOpenDialog",
    'showContextMenu',
    'setFilterData',
    'showSearchAreaMenu',
    'showMovieItemMenu',
    'showSortAreaMenu',
    'showLibMenu',
    'windowControl',
    'invokeViewAction',
    'setFilterSetting',
    'setProxySetting',
    'reluanch',
    'loadProxySetting',
    'loadServiceState'
] as const;

/**
 * 消息动作联合类型定义
 */
export type invokeMainActionType = typeof invokeMainActions[number]

/**
 * 主线程消息参数
 */
export interface invokeMainActionParams {
    /**
     * 消息动作名称
     */
    action: invokeMainActionType
    /**
     * 消息动作名称
     */
    command: string
    /**
     * 消息唯一编码
     */
    uuid: string,
    /**
     * 消息动作参数
     */
    options: any
}