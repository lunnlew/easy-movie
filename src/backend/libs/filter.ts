import dataM from '../database/DataM'

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