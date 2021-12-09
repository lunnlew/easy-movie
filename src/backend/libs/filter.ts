import dataM from '../database/DataM'
import proxyControl from "./proxy";
import application from './application'

/**
 * 更新type过滤器的子选项启用状态
 * @param event 
 * @param params 
 */
export function setFilterData(event: any, params: any) {
    dataM.knexInstance('config').where('type', '=', params.options.type).where({ val: params.options.name }).update({
        state: params.options.value ? 1 : 0
    }).on('query', (query: any) => {
        console.log(query.sql)
    }).catch(err => {
        console.log(err)
    })
}

/**
 * 更新过滤器的配置项启用状态
 * @param event 
 * @param params 
 */
export function setFilterSetting(event: any, params: any) {
    for (let item of params.options) {
        dataM.knexInstance('config').where('type', '=', 'filter_setting').where({ val: item.value }).update({
            state: item.checked ? 1 : 0
        }).on('query', (query: any) => {
            console.log(query.sql)
        }).catch(err => {
            console.log(err)
        })
    }
}

/**
 * 保存代理设置并设置窗口会话代理
 * 注意：无法在此处直接设置应用程序级别的代理，需要重启应用程序才能设置生效
 * @param event 
 * @param params 
 */
export function setProxySetting(event: any, params: any) {
    application.loadUserProfile();
    application.userProfile.proxy = params.options.proxy;
    // 设置会话代理
    proxyControl.setAllSessionProxy(params.options.proxy);
    application.saveUserProfile();
}

/**
 * 加载代理设置
 * @param event 
 * @param params 
 * @param handler 
 */
export function loadProxySetting(event: any, params: any, handler: any) {
    if (handler) {
        handler(application.userProfile.proxy);
    }
}