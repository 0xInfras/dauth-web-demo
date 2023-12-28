import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Field,Icon,Tab, Tabs,Popup,Picker ,Uploader,Button,Dialog ,Loading,RadioGroup, Radio,Cell, CellGroup} from 'vant'
import 'vant/lib/index.css';
import {DAuthWalletManager} from "dauth-web"

DAuthWalletManager.initSDK({
    appId: "1bfe5bbf619681e49cdc62d07badc4cb",
    sdkVersion: "1.2.2",
    serverTag: "test",
    chainType: "ArbitrumGoerli"
    // appId: "430f220f2a6554040849863e04ba5187",
    // sdkVersion:"1.2.2",
    // serverTag:"prod",
    // chainType:"Arbitrum"
  })
.then(
    (inited) => {
    //初始化选链列表
    if (inited) {

        const app = createApp(App)
        app.use(Field).use(Icon).use(Loading)
        .use(Cell).use(CellGroup)
        .use(Popup).use(Button).use(Picker).use(Uploader).use(Dialog).use(RadioGroup).use(Radio).use(Tab).use(Tabs).use(router).mount('#app')
        
    }
    else {
        window.alert("init failed")
    }
    }
).catch(() => {
    window.alert("init sdk failed")
});


