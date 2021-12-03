import { net } from 'electron'
function buildGetRequest(url: string, params: any) {
    let url_p = new URL(url)
    let has_params = {}
    url_p.searchParams.forEach((val, key) => {
        has_params[key] = val
    })
    let query = ''
    params = Object.assign({}, has_params, params)
    for (let key in params) {
        query += key + '=' + params[key] + '&'
    }
    query = query.slice(0, -1)
    return {
        url: url_p.origin + url_p.pathname + '?' + query
    }
}
/**
 * 使用electron的net模块发送请求-可以支持系统代理等
 * @param config 
 * @returns 
 */
function RequestAdapter(config: any) {
    return new Promise((resolve, reject) => {
        if ('params' in config && config.method?.toLowerCase() == 'get') {
            let params = config.params
            delete config.params
            Object.assign(config, buildGetRequest(config.url, params))
        }
        let data = config.data
        if ('data' in config) {
            delete config.data
        }
        let req = net.request(config)
        if (data) {
            req.write(JSON.stringify(data))
        }
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