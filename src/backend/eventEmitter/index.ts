import movieMsg from "./movieMsg";
import castMsg from "./castMsg";
import RenderMsg from "./RenderMsg";
import application from '../libs/application';

/**
 * 影视相关事件
 */
new movieMsg(application.eventEmitter)
/**
 * 演职员相关事件
 */
new castMsg(application.eventEmitter)

export default RenderMsg