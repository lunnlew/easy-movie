'use strict'
import os from 'os'
import { app } from "electron";
const config = {
    home_dir: os.homedir() + '/.easy-movie/',
    __fix_dirname: process.cwd(),
    imdb_apikey: '7ce989c3767b014800d3e28afb106de4',
    imdb_apiurl: 'https://api.themoviedb.org/3/',
    imdb_imgbase: 'https://image.tmdb.org/t/p/w500',
    __app_path: app.getAppPath()
}
export const home_dir = config.home_dir
export const __fix_dirname = config.home_dir
export const imdb_apikey = config.imdb_apikey
export const imdb_apiurl = config.imdb_apiurl
export const __app_path = config.__app_path
export const imdb_imgbase = config.imdb_imgbase
export default config