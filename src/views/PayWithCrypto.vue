<template>
    <div class="checkout_main">
        <div class="checkout_box">
            <p class="checkout_title">Select Crypto</p>
            <ul class="pay_menu" v-if="payMenu.length > 0">
                <li @click="selectPayment(data)" v-for="(data,index) in payMenu" :key="index">
                    <van-radio-group v-model='selPaymentID' style="margin:0 4.8vw 0 5.3vw">
                    <van-radio :name="data.pid" checked-color="rgba(77, 95, 149, 1)" icon-size="5vw"></van-radio>
                    </van-radio-group>
                    <span>{{data.name}}</span>
                </li>
            </ul>
            <div v-else class="loading_box">
                <van-loading v-if="isGetPay"  vertical type="spinner">Loding payment methods...</van-loading>
                <p v-else class="err_text">Load payment methods failed.</p>
            </div>
        </div>
        <van-button :class="buttonClass" :disabled="isDisabled" type="primary" block @click="ConfrimEvent">Confrim</van-button>
        <p class="btn_info">powered by Infras.tech</p>
    </div>
</template>
<script>
import {postEventToken} from "../utils/common.js"
import {localSign} from "../utils/common.js"
import {host} from "../utils/common.js"
import {apiList} from "../utils/common.js"
import { showToast  } from 'vant';


export default {
    data(){
        return{
            selPaymentID:0,
            payMenu:[
                {
                    pid :1,
                    name:'ETH-USDT',
                    chain:2,
                    crypto:"USDT"
                },
                {
                    pid :2,
                    name:'ARB-USDT',
                    chain:1,
                    crypto:"USDT"
                },
                {
                    pid :3,
                    name:'TRON-USDT',
                    chain:3,
                    crypto:"USDT"
                },
            ],
        }
    },

    methods:{
        selectPayment(item){
            this.selPayment = item
            this.selPaymentID = item.pid
        },
        ConfrimEvent(){
            let url = host + apiList["crypto_create"]

            let auth_id = sessionStorage.getItem('auth_id');
            let order_id = sessionStorage.getItem('order_id');

            //它这里是文本写的"undefined"
            if(auth_id === "undefined" || order_id === "undefined") {
                showToast("Error occurs!")
                return
            }

            let formData = new FormData();
            formData.append('authid', auth_id);
            formData.append('out_order_id', order_id);
            formData.append('chain_id', this.selPayment.chain);
            formData.append('crypto_code', this.selPayment.crypto);
            formData.append('amount', this.$route.query.amount);

            postEventToken(url,localSign(formData),(res)=>{
                let retCode = res.data.ret
                let data = res.data.data
                switch (retCode) {
                    case 0:
                        this.cryptoOrder(data);
                        break;
                    default:
                        showToast(" An error was occurred, Code: " + retCode);
                        break;
                }
            },()=>{
                showToast("An error was occurred.")
                //关闭
            }, sessionStorage.getItem('client_id'))

        },
        cryptoOrder(data){
            let params = {
                address: data.wallet_address,
                timestamp: data.timestamp,
                order_id: data.order_id,
                count_down: data.timeout,
                chain_name: this.selPayment.name,
                chain_id: this.selPayment.chain,
                amount: this.$route.query.amount,
            }
            this.$router.push({path:"CryptoOrder", query:params});
        },
    }
}
</script>
<style scoped lang="less">
    .checkout_main{
        padding: 3vw 5.3vw 5.3vw;
        .checkout_box{
            min-height: 80vh;
        }
        .checkout_img_box{

                width: 26.4vw;
                height: 26.4vw;
                margin: 0 auto 0;
                padding-top: 16vw;
                position: relative;
                img{
                    width: 100%;
                    height: 100%;
                }


        }
        .checkout_title{
            font-size: 8.2vw;
            padding-top: 2vw;
            text-align: center;
        }
        .checkout_p_title{
             font-size: 4.2vw;
            padding-top: 16vw;
            text-align: center;
        }
        .checkout_money{
            font-size: 12.8vw;
            text-align: center;
            padding-top: 2.6vw;
        }
        .pay_title{
            font-size: 4.2vw;
            padding-top: 5.3vw;
        }
    }
    .pay_menu{
        max-height: 80vh;
        overflow: auto;
        margin-top: 4.6vw;
        li{
            margin-top: 2.6vw;
            align-items:center;
            display:flex;
            width:99%;
            border: 0.5vw solid rgba(77, 95, 149, 1);
            height: 14.9vw;
            border-radius: 1vw;
            img{
                width:12.8vw;

            }
            span{
                width:60%;
                text-align:left;
                 font-size: 4.2vw;
                 padding-left: 4.8vw;
            }
        }
    }
    .confirm_btn{
        margin-top: 12vw;
    }
    .disabled_confirm {
      margin-top: 12vw;
      background-color: gray; /* 设置禁用状态下的背景颜色为灰色 */
      color: white; /* 设置禁用状态下的文本颜色为白色 */
      cursor: not-allowed; /* 设置鼠标样式为禁止符号 */
      disabled: true;
    }
    .btn_info{
        color: rgba(128, 128, 128, 1);
        font-size: 3.2vw;
        padding-top: 2vw;
        text-align: center;
    }
    .loading_box{
        padding-top:12vw;
    }
    .err_text{
        text-align: center;
        color: #999;
    }
</style>
