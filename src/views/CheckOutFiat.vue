<template>
    <div class="checkout_main">
        <div class="checkout_box">
            <div class="checkout_img_box">

                <van-loading style="    position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" v-if="imgload" type="spinner" />
                <img v-else :src="item_image">
            </div>
            <p class="checkout_title" v-text="item_name"> </p>
            <p class="checkout_p_title" v-text="currency"></p>
            <p class="checkout_money" v-text="amount"></p>
            <p class="pay_title">Pay with</p>
            <ul class="pay_menu" v-if="payMenu.length > 0">
                <li @click="selectPayment(data)" v-for="(data,index) in payMenu" :key="index">
                    <van-radio-group v-model='selPaymentID' style="margin:0 4.8vw 0 5.3vw">
                    <van-radio :name="data.paymethod_id" checked-color="rgba(77, 95, 149, 1)" icon-size="5vw"></van-radio>
                    </van-radio-group>
                    <img :src="data.icon" />
                    <span>{{data.paymethod_name}}</span>
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
//先清理一次缓存
sessionStorage.clear();

export default {
    data(){
        return{
            imgload:true,
            selPayment:null,
            selPaymentID:0,
            item_name: this.$route.query.item,
            item_image: this.$route.query.img,
            currency:"Amount (" + this.$route.query.currency + ")",
            amount:this.$route.query.amount,
            payMenu:[],
            isGetPay:true,
            isDisabled:false
        }
    },

    mounted:function(){

        //正式上的时候，这些参数是从query里获取出来的
        sessionStorage.setItem('auth_id', this.$route.query.auth_id);
        sessionStorage.setItem('order_id', this.$route.query.order_id);
        sessionStorage.setItem('client_id', this.$route.query.client_id);

        if(this.$route.query.security_key != undefined)
        {
            sessionStorage.setItem('security_key', this.$route.query.security_key);
        }

        let localCreate = this.$route.query.local_create
        //测试时本地生成订单
        if(localCreate === 'true')
        {
            this.createOrder();
        }

        this.imgLoad();
        this.getPayMenu(); //获取支付方式
    },
    methods:{
        ConfrimEvent(){
            let url = host + apiList["create"]
            if(this.payMenu.length === 0 || this.selPayment === undefined){
                showToast("Please choose one payment method")
                return
            }
            let auth_id = sessionStorage.getItem('auth_id');
            let order_id = sessionStorage.getItem('order_id');

            //它这里是文本写的"undefined"
            if(auth_id === "undefined" || order_id === "undefined") {
                showToast("Error occurs!")
                return
            }

            this.isDisabled = true;
            this.buttonClass  = 'disabled_confirm';

            let formData = new FormData();
            formData.append('authid', auth_id);
            formData.append('order_id', order_id);
            formData.append('paymethod_id', this.selPaymentID);

            postEventToken(url,localSign(formData),(res)=>{
                let retCode = res.data.ret
                switch (retCode) {
                    case 0:
                        this.$router.push("FiatOrder");
                        return;
                    case 1000052:
                        //已有订单，回到历史状态
                        showToast(res.data.info);
                        break;
                    default:
                        showToast(" An error was occurred, Code: " + retCode)
                        break;
                }
            },()=>{
                showToast("An error was occurred.")
                //关闭
            }, sessionStorage.getItem('client_id'))

        },

        //获取道具详情，道具详情需要在app菜单点击后写入localStorge,以json字符串形式写
        /*getInfos(){
           let itemInfo = localStorage.getItem("itemInfo")
           if(itemInfo){
                let json = JSON.stringify(itemInfo)
                this.item_name = json.item_name;
                this.item_image = json.item_image;
                this.currency = json.currency;
                this.amount = json.amount;
           }
        },*/
        //测试阶段本地创建订单用
        createOrder(){
            let url = host + apiList["preCreate"]
            let formData = new FormData();

            formData.append('amount', this.$route.query.amount)
            formData.append('crypto_code', this.$route.query.crypto)
            formData.append('authid', this.$route.query.auth_id)
            formData.append('fiat_code', this.$route.query.currency)
            formData.append('out_order_id', this.$route.query.exOrderId)
            formData.append('chain_id', 1)

            postEventToken(url, localSign(formData),(res)=>{
                this.isGetPay = false
                let retCode = res.data.ret
                switch (retCode) {
                    case 0:
                        sessionStorage.setItem('order_id', res.data.data.detail.order_id);
                        break;
                    default:
                        showToast("本地测试状态下创建订单失败！");
                        break;
                }
            },()=>{
                this.isGetPay = false
                this.selPayment = null
            },sessionStorage.getItem('client_id'))
        },

        //获取支付方式
        getPayMenu(){
            let url = host + apiList["getCurrency"]
            let formData = new FormData();
            formData.append('authid', sessionStorage.getItem('auth_id'))

            postEventToken(url, localSign(formData),(res)=>{
                this.isGetPay = false
                let retCode = res.data.ret
                switch (retCode) {
                    case 0:
                     for (const item of res.data.data.fiat_list) {
                            if(item.fiat_code === this.$route.query.currency) {
                                this.payMenu = item.paymethod_info_list
                                if(this.payMenu.length > 0){
                                    this.selPaymentID = this.payMenu[0].id   //默认第一个

                                 }
                             }
                         }
                     this.buttonClass  = 'confirm_btn';
                     break;
                }
            },()=>{
                this.isGetPay = false
                this.selPayment = null
            },  sessionStorage.getItem('client_id'))

        },
        selectPayment(item){
            this.selPayment = item
            this.selPaymentID = item.paymethod_id

        },
        imgLoad(){
            var img = new Image();
            img.onload = function(){
                // 图片加载完成后的操作
                this.imgload = false
            };
        }
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
            font-size: 4.2vw;
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
        margin-top: 2.6vw;
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
