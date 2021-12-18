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
    if (img.startsWith('http')) {
        return img
    }
    return 'http://127.0.0.1:6877/api/' + img
}