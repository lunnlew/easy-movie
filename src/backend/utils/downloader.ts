import axios from 'axios'
import fs from 'fs'
import RequestAdapter from '../libs/RequestAdapter'
/**
 * 网络资源下载器
 */
export default class Downloader {
    constructor() {
        this.download = this.download.bind(this);
    }
    async download(url, path) {
        return new Promise<void>((resolve, reject) => {
            const file = fs.createWriteStream(path);
            axios.get(url, {
                responseType: 'stream',
                adapter: RequestAdapter as any
            }).then((response) => {
                const stream = response.data
                stream.pipe(file)
                stream.on('end', () => {
                    resolve()
                })
                stream.on('error', (err) => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            });
        })
    }
}