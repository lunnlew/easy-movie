
/**
 * 演员信息
 */
export type CastInfo = {
    /**
     * 演员中文名称
     */
    name_cn: string
    /**
     * 演员英文名称
     */
    name_en: string
    /**
     * 演员头像
     */
    avatar: string
    /**
     * 演员头像
     */
    avatar_url?: string
    /**
     * 演员性别
     */
    gender: number
    /**
     * 演员出生日期
     */
    birthday: string
    /**
     * 演员去世日期
     */
    deathday: string
    /**
     * 演员出生地
     */
    place_of_birth: string
    /**
     * 演员亦称
     */
    also_known_as: string
    /**
     * 演员在IMDB数据库中的整数ID字段，注意：不是IMDB_ID
     */
    imdb_sid: number
    /**
     * 演员的IMDB_ID
     */
    imdb_id: string
    /**
     * 演员的IMDN_URL
     */
    imdb_url: string
    /**
     * 演员的IMDB评分
     */
    imdb_rating?: number
    /**
     * 演员的IMDB评分人数
     */
    imdb_votes?: number
    /**
     * 角色
     */
    character?: string
    /**
     * 部门
     */
    department?: string
    /**
     * 职位
     */
    job?: string
    /**
     * 演员简介
     */
    desc?: string
}

/**
 * 数据库字段
 */
export type CastFields = {
    /**
     * 演员ID
     */
    id?: number
    /**
     * 是否已经刮削
     */
    is_scraped: boolean
    /**
     * 刮削时间
     */
    is_scraped_at: number
} & CastInfo