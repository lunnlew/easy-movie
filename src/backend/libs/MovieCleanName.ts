/**
 * 电影文件名清洗工具
 */
class MovieCleanName {
    name = ''
    constructor() { }
    testName(name) {
        this.name = name
        return {
            hasResolution: this.hasResolution(),
            hasCollectSource: this.hasCollectSource(),
            hasVideoCodec: this.hasVideoCodec(),
            hasAudioCodec: this.hasAudioCodec(),
            hasDTSAudio: this.hasDTSAudio(),
            hasTrueHDAudio: this.hasTrueHDAudio(),
            hasDR: this.hasDR(),
        }
    }
    /**
     * 是否有分辨率标识
     */
    hasResolution() {
        return this.name.search(/\b(4K|2k|2160p|1080p|720p|480p|360p)\b/i)
    }
    /**
     * 是否有压制标识
     */
    hasCollectSource() {
        return this.name.search(/\b(REMUX|BluRay|Blu-Ray|BD|BDRip|WEB-DL|UHD|FHD|HD|HDTVrip|HDTV|DVD|DVDrip|DVDR|DVD-R|SD)\b/i)
    }
    /**
     * 是否有视频编码标准
     */
    hasVideoCodec() {
        // HEVC x265 x265-FLAME x265.10bit
        return this.name.search(/\b(HEVC|x265|x264|H\.264|XVID)\b/i)
    }
    /**
     * 是否有音频编码标准
     */
    hasAudioCodec() {
        return this.name.search(/\b(TrueHD|DTS|DD|flac|acc|ac3|mp3)\b/i)
    }
    /**
     * 是否有DTS
     */
    hasDTSAudio() {
        // DTS-HD.MA DTS-HD DTS-HR DTS-X DTS DD DD+
        return this.name.search(/\b(DTS|DD)\b/i)
    }
    /**
     * 是否有TrueHD
     */
    hasTrueHDAudio() {
        return this.name.search(/\b(TrueHD)\b/i)
    }
    /**
     * 是否有DR
     */
    hasDR() {
        // HDR SDR
        return this.name.search(/\b([HS]{1}DR)\b/i)
    }
}

export default new MovieCleanName()