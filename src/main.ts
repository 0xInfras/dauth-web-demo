import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Field,Icon,Tab, Tabs,Popup,Picker ,Uploader,Button,Dialog ,Loading,RadioGroup, Radio,Cell, CellGroup} from 'vant'
import 'vant/lib/index.css';


const app = createApp(App)
app.use(Field).use(Icon).use(Loading)
.use(Cell).use(CellGroup)
.use(Popup).use(Button).use(Picker).use(Uploader).use(Dialog).use(RadioGroup).use(Radio).use(Tab).use(Tabs).use(router).mount('#app')

