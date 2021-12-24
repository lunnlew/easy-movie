import moment from "moment"

/**
 * 字母大写
 * @param str 
 * @returns 
 */
export function ToUpperCase(str: string) {
    if (str) {
        return str.toUpperCase()
    } else {
        return ''
    }
}

/**
 * 设置url前缀
 * @param img 
 * @returns 
 */
export function setImgUrlPrex(img: string) {
    if (img.startsWith('movie')) {
        return 'http://127.0.0.1:6877/api/' + img
    }
    return img
}

/**
 * 格式化大小
 * @param size 
 * @returns 
 */
export function fmtSize(size: number) {
    if (size < 1024) {
        return size + 'B'
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
    } else {
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    }
}

/**
 * 格式化时间戳
 * @param time 
 * @returns 
 */
export function fmtTime(time: number, fmt: string = 'YYYY-MM-DD') {
    moment.locale('zh-cn')
    return moment(time).format(fmt)
}

/**
 * 文件资源类别
 * @param type 
 */
export function fmtResourseType(type: string) {
    if (type === 'single') {
        return '影片'
    } else {
        return '原盘'
    }
}