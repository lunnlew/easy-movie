import movieMsg from "./movieMsg";
import castMsg from "./castMsg";
import RenderMsg from "./RenderMsg";
import application from '../libs/application';

new movieMsg(application.eventEmitter)
new castMsg(application.eventEmitter)

export default RenderMsg