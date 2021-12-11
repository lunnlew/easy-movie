
import chokidar from 'chokidar'
import application from '../libs/application'
import tvScan from '../scan/TvScan'
import movieScan from '../scan/MovieScan'
import '../libs/application';
import '../eventEmitter'
import '../database/DataM'
import '../scraper/ScraperQueue'

class watchDir {
    constructor() {
        console.log('watchDir initialize')
    }
    async initialize() {
        let list = await application.knex('media_libs').select('*')
        let watch_dirs = list.map(item => item.path)
        const watcher = chokidar.watch(watch_dirs, {
            ignored: /^(?=.*(\.\w+)$)(?!.*(?:\.mkv|\.flv)$).*$/,
            persistent: true,
            ignoreInitial: false,
            followSymlinks: true,
            cwd: '.',
            disableGlobbing: false,

            usePolling: false,
            interval: 100,
            binaryInterval: 300,
            alwaysStat: false,
            depth: 99,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100
            },

            ignorePermissionErrors: false,
            atomic: true
        });
        function find_media_lib(path) {
            return list.find(item => path.indexOf(item.path) === 0)
        }
        function emit_scan(path) {
            path = path.replace(/\\/g, '/')
            let lib = find_media_lib(path)
            if (lib.type === 'tv') {
                tvScan.scan(path, lib.id, true)
            } else if (lib.type === 'movie') {
                movieScan.scan(path, lib.id, true)
            }
        }
        watcher.on('add', path => emit_scan(path))
        // watcher.on('addDir', path => emit_scan(path))
    }
}

export default new watchDir()