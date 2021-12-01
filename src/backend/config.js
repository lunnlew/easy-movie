'use strict'
const os = require('os')
module.exports = {
    home_dir: os.homedir() + '/.easy-movie/',
    __fix_dirname: process.cwd(),
    imdb_apikey: '7ce989c3767b014800d3e28afb106de4',
    imdb_apiurl: 'https://api.themoviedb.org/3/',
    imdb_imgbase: 'https://image.tmdb.org/t/p/w500',
}