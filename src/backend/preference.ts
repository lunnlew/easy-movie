'use strict'
import { app } from "electron";
const preference = {
    home_dir: app.getPath('userData'),
    __fix_dirname: process.cwd(),
    imdb_apikey: '7ce989c3767b014800d3e28afb106de4',
    imdb_apiurl: 'https://api.themoviedb.org/3/',
    imdb_imgbase: 'https://image.tmdb.org/t/p/w500',
    __app_path: app.getAppPath()
}
export const home_dir = preference.home_dir
export const __fix_dirname = preference.home_dir
export const imdb_apikey = preference.imdb_apikey
export const imdb_apiurl = preference.imdb_apiurl
export const imdb_imgbase = preference.imdb_imgbase
export const __app_path = preference.__app_path
export default preference