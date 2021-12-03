import { net } from 'electron'
function buildGetRequest(url: string, params: any) {
    let query = ''
    for (let key in params) {
        query += key + '=' + params[key] + '&'
    }
    query = query.slice(0, -1)
    return {
        url: url + '?' + query
    }
}
/**
 * 使用electron的net模块发送请求-可以支持系统代理等
 * @param config 
 * @returns 
 */
function RequestAdapter(config: any) {
    return new Promise((resolve, reject) => {
        if (config.params) {
            let params = config.params
            delete config.params
            Object.assign(config, buildGetRequest(config.url, params))
        }
        let req = net.request(config)
        req.on('response', (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    data: data
                })
            })
        })
        req.on('error', (err) => {
            reject(err)
        })
        req.end()
    })
}
export default RequestAdapter