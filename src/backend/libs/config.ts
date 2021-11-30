import dataM from '../database/DataM'

/**
 * 加载配置
 * @param event 
 * @param params 
 * @param handler 
 */
export async function loadConfig(event: any, params: any, handler: any) {
    let fields = await dataM.knexInstance('config').where('type', '=', params.options.type)
    handler(fields)
}