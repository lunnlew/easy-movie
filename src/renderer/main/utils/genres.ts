export const dicts: {
    [key: string]: string
} = {
    'Action': '动作',
    'Adventure': '冒险',
    'Animation': '动画',
    'Biography': '传记',
    'Comedy': '喜剧',
    'Crime': '犯罪',
    'Documentary': '纪录',
    'Drama': '剧情',
    'Family': '家庭',
    'Fantasy': '奇幻',
    'Film Noir': '黑色',
    'History': '历史',
    'Horror': '恐怖',
    'Music': '音乐',
    'Musical': '歌舞',
    'Mystery': '悬疑',
    'Romance': '浪漫',
    'Sci-Fi': '科幻',
    'Short': '短片',
    'Sport': '运动',
    'Superhero': '超级英雄',
    'Thriller': '惊悚',
    'War': '战争',
    'Western': '西部片',
    'Foreign': '外国片',
    'Tragedy': '悲剧'
}

export default function fmt_genres(genres: string) {
    return genres.split(",").map(item => {
        return dicts[item.trim()] || item
    }).join(" , ")
}