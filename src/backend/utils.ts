import path from 'path'

/**
 * 构建返回数据
 * @param data 
 * @param code 
 * @param message 
 * @returns 
 */
export function buildResult(data: any, code: number = 200, message: string = 'success') {
    return {
        data: data,
        code: code,
        message: message
    }
}

/**
 * 构建返回数据
 * @param message 
 * @param code 
 * @param data 
 * @returns 
 */
export function buildErrResult(message: string = 'error', code: number = 500, data: any = null) {
    return {
        data: data,
        code: code,
        message: message
    }
}

/**
 * 是否视频文件
 * @param file 文件路径
 * @returns 
 */
export function endsWithVideo(file: string) {
    return file.endsWith('.mkv') || file.endsWith('.mp4') || file.endsWith('.avi')
}

/**
 * 获取子目录名称
 * @param filePath 目录路径
 * @returns 子目录名称
 */
export function baseName(filePath: string) {
    return path.basename(filePath);
}

/**
 * 获取影片名称
 * @param name
 * @returns 
 */
export function parseMovieName(name: string, split: string = '.') {
    if (name.indexOf(split) > -1) {
        name = name.substring(0, name.lastIndexOf(split) - 1);
    }
    // 去除特别关键词
    return name.replace(/(4k|2K|1080p?|720p?|高清|超清|清晰|原盘|蓝光)/ig, '').replace(/\./ig, ' ');
}

/**
 * 组装WS消息
 * @param type WS消息类型
 * @param data WS消息数据
 * @returns 
 */
export function buildWsMessage(type: string, data: any) {
    return JSON.stringify(
        {
            type: type,
            data: data
        }
    )
}

/**
 * 最长公共前缀
 */
export function longestCommonPrefix(strs: string[]) {
    if (strs.length === 0) {
        return '';
    }
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
        }
    }
    return prefix;
}

/**
 * 字符串编辑距离
 */
export function minEditDistance(s1: string, s2: string) {
    const len1 = s1.length
    const len2 = s2.length

    let matrix = []

    for (let i = 0; i <= len1; i++) {
        // 构造二维数组
        matrix[i] = new Array()
        for (let j = 0; j <= len2; j++) {
            // 初始化
            if (i == 0) {
                matrix[i][j] = j
            } else if (j == 0) {
                matrix[i][j] = i
            } else {
                // 进行最小值分析
                let cost = 0
                if (s1[i - 1] != s2[j - 1]) { // 相同为0，不同置1
                    cost = 1
                }
                const temp = matrix[i - 1][j - 1] + cost
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, temp)
            }
        }
    }
    return matrix[len1][len2] //返回右下角的值
}