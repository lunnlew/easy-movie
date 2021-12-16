import app from './application'

/**
 * 加载配置
 * @param event 
 * @param params 
 * @param handler 
 */
export async function loadConfig(event: any, params: any, handler: any) {
    console.log('loadConfig', params.options.type)
    let fields = await app.knex('config').where('type', '=', params.options.type)
    handler(fields)
}