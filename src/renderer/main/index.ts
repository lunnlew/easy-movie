import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from 'element-plus'
import { VideoPlay } from '@element-plus/icons'
import 'element-plus/dist/index.css'
import animated from 'animate.css'
import axios from './utils/axios'
import wsMessage from './utils/WsMessage'

const app = createApp(App)
app.config.globalProperties.$http = axios
app.config.globalProperties.$ws = wsMessage
app.use(ElementPlus)
app.component('VideoPlay', VideoPlay)
app.use(animated as any)
app.use(store)
app.use(router)
app.mount("#app");
