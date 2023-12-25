<template>
    <!-- 手机版  -->
    <div v-if="is_mobile">
        <div class="checkout_main">
        <div v-if="!loading">
            <div class="checkout_box">
                <div class="checkout_img_box">
                    <van-loading style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" v-if="imgload" type="spinner" />
                    <img v-else :src="item_image">
                </div>
                <p class="checkout_title" v-text="item_name"> </p>
                <p class="checkout_p_title" v-text="'Amount (' + currency + ')'"></p>
                <p class="checkout_money" v-text="amount"></p>
            </div>
            <div v-if="!order_created">
                <div style="padding-top:2vh, width:80%">
                    <van-button :class="buttonClass" type="primary" block @click="payWithFiat">Pay by Fiat</van-button>
                    <van-button :class="buttonClass" style="margin-top:2vh" color="rgba(209, 20, 20, 1)" type="primary" block @click="payWithCrypto">Pay by Crypto</van-button>
                </div>
             </div>
             <div v-else>
             </div>
         </div>
         <div v-else class="loading_box">
             <div class="checkout_box">
                <van-loading v-if="!loading"  vertical type="spinner" style="padding-top:20vh">Loading payment methods...</van-loading>
                <div v-else class="err_text" style="padding-top:20vh">
                    <p>Query order info failed!</p>
                    <p style="padding-top:2vh">Please contact your vendor</p>
                </div>
             </div>
          </div>
           <p class="btn_info" style="padding-top:30vh" >powered by Infras.tech</p>
        </div>
    </div>

    <!-- PC版  -->
    <div v-else>
        <div class="checkout_main">
        <div v-if="!loading">
            <div class="checkout_box">
                <div class="checkout_img_box">
                    <van-loading style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" v-if="imgload" type="spinner" />
                    <img v-else :src="item_image">
                </div>
                <p class="checkout_title" v-text="item_name"> </p>
                <p class="checkout_p_title" v-text="currency"></p>
                <p class="checkout_money" v-text="amount"></p>
            </div>
            <div v-if="!order_created">
                <div style="padding-top:2vh, width:80%">
                    <van-button :class="buttonClass" type="primary" block @click="payWithFiat">Pay by Fiat</van-button>
                    <van-button :class="buttonClass" style="margin-top:2vh" color="rgba(209, 20, 20, 1)" type="primary" block @click="payWithCrypto">Pay by Crypto</van-button>
                </div>
             </div>
             <div v-else>
             </div>
         </div>
         <div v-else class="loading_box">
             <div class="checkout_box">
                <van-loading v-if="!loading"  vertical type="spinner" style="padding-top:20vh">Loading payment methods...</van-loading>
                <div v-else class="err_text" style="padding-top:20vh">
                    <p>Query order info failed!</p>
                    <p style="padding-top:2vh">Please contact your vendor</p>
                </div>
             </div>
          </div>
           <p class="btn_info" style="padding-top:30vh" >powered by Infras.tech</p>
        </div>
    </div>

</template>

<script>

import {postEventToken} from "../utils/common.js"
import {localSign} from "../utils/common.js"
import {host} from "../utils/common.js"
import {apiList, is_mobile} from "../utils/common.js"
//import { showToast  } from 'vant';

//先清理一次缓存
sessionStorage.clear();

export default {
    data(){
        return{
            item_name: this.$route.query.item,
            item_image: this.$route.query.img,
            currency:this.$route.query.currency,
            amount:this.$route.query.amount,
            imgload:true,
            loading:true,
            is_mobile: is_mobile,
            order_created: false,
            external_id:'',
        }
    },

    mounted:function(){
        sessionStorage.setItem('security_key', atob(this.$route.query.security_key));
        //auth_code, 就从接口里拿信息，没有的话就从URL参数里拿
         if(this.$route.query.auth_code != undefined){
            this.getOrderInfo(this.$route.query.auth_code);
         }
         else{
            this.loading = false;
            //正式上的时候，这些参数是从query里获取出来的
            sessionStorage.setItem('client_id', this.$route.query.client_id);
            sessionStorage.setItem('auth_id', this.$route.query.auth_id);
            sessionStorage.setItem('order_id', this.$route.query.order_id);
            if(this.$route.query.security_key != undefined)
            {
                sessionStorage.setItem('security_key', this.$route.query.security_key);
            }
            //如果是发邮件跳订单的场景，chain_id会从邮件链接中带过来。如果没有获取到，就默认填1使用Arb
            if(this.$route.query.chain_id != undefined)
            {
                sessionStorage.setItem('chain_id', this.$route.query.chain_id);
            }
            else
            {
                sessionStorage.setItem('chain_id',1);
            }
        }
    },
    methods:{
        getOrderInfo(verifyCode){
            //这个接口不传递client_id,而是调用之后从服务端取回来自己的client_id
            let url = host + apiList["verify"]
            let formData = new FormData();
            formData.append('auth_code', verifyCode)
            postEventToken(url, 
            localSign(formData),(res)=>{
                let retCode = res.data.ret
                let data = res.data.data;

                //TODO:这里目前是没有创建过订单，所以跳转到PayWithXXX页面去创建。
                //后面要增加一个已经创建的标志判断，已经创建了就直接走到XXXOrder
                let order_exist = true;
                switch (retCode) {
                    case 0:
                        this.loading = false;

                        if(order_exist){
                            sessionStorage.setItem('client_id', data.client_id);
                            sessionStorage.setItem('auth_id', data.authid);
                            sessionStorage.setItem('order_id', data.order_id);

                            this.item_name =  data.name;
                            this.item_image = data.image;
                            this.currency = data.fiat_code;
                            this.amount = data.amount;
                            this.external_id = data.out_order_id;
                        }
                        this.imgLoad()
                        //商品的具体信息
                        //let item = JSON.parse(data.items);
                        break;
                    case 99999:
                        //TODO: 需要补充一个已经过期的表现
                        break;
                    default:
                        break;
                }
            },(er)=>{
                console.error(er)
            }, null)

        },
        payWithFiat(){
            let params = {

                amount: this.amount,
                auth_id: sessionStorage.getItem('auth_id'),
                exOrderId: this.external_id,
                crypto: 'USDT',
                //本地创建
                create: true
            }
            this.$router.push({path:"PayWithFiat", query: params});
        },
        payWithCrypto(){
            let params = {
                currency: this.currency,
                amount: this.amount
            }
            this.$router.push({path:"PayWithCrypto", query: params});
        },
        cryptoOrder(){
            let params = {
                currency: this.currency,
                amount: this.amount
            }
            this.$router.push({path:"CryptoOrder", query: params});
        },
        fiatOrder(){
            let params = {
                currency: this.currency,
                amount: this.amount
            }
            this.$router.push({path:"FiatOrder", query: params});
        },
        imgLoad(){
            var img = new Image();
            img.onload = function(){
                // 图片加载完成后的操作
                this.imgload = false
            };
            img.src = this.item_image;
        }
    }
}
</script>
<style scoped lang="less">
    .checkout_main{
        padding: 3vw 5.3vw 5.3vw;
        .checkout_box{
            min-height: 50vh;
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
