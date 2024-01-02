<template>
    <div class="checkout_main">
        <div class="checkout_box">
            <div class="checkout_img_box">

                <van-loading style="    position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" v-if="imgload" type="spinner" />
                <img v-else :src="item_image">
            </div>
            <p class="checkout_title" v-text="item_name"> </p>
            <p class="checkout_p_title" v-text="currencyStr"></p>
            <p class="checkout_money" v-text="amount"></p>
            <p class="checkout_crypto" v-text="cryptoAmount"></p>
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
import { showToast  } from 'vant'

import {DAuthWalletManager} from "dauth-web"

export default {
    data(){
        return{
            imgload:true,
            selPayment:null,
            selPaymentID:"",
            item_name: "",
            item_image: "",
            currency:"",
            currencyStr:"",
            amount:0,
            cryptoAmount:0,
            payMenu:[],
            isGetPay:true,
            isDisabled:false,
            quoteType:"",
        }
    },

    mounted:function(){
        this.currencyStr = "Amount (" +this.$route.query.faitCode+ ")"
        this.currency = this.$route.query.faitCode
        this.amount = this.$route.query.amount * 1 //to number
        this.buttonClass  = 'disabled_confirm';

        const c = {
            cryptoCode:this.$route.query.cryptoCode,
            cryptoIcon:this.$route.query.cryptoIcon

        }
        //查询可购买的币种
        this.item_name = c.cryptoCode
        this.item_image = c.cryptoIcon;
        console.log("item_image", this.item_image)
        this.imgLoad();
        
        DAuthWalletManager.paymentEstimate({
            quoteType: "AnchorFait",
            crypto: c,
            fiatCode: this.currency,
            inputAmount:  this.amount
        }).then((res)=>{
            if(res.data.outAmount ===0 )//说明法币数量不足
            {
                showToast(`输入金额应该在${res.data.amountMin}-${res.data.amountMax}}之间`)
            }
            else
            {
                this.quoteType = res.data.quoteType 
                //匹配支付方式
                DAuthWalletManager.matchPayment({
                    quoteType: res.data.quoteType,
                    crypto: c,
                    fiatCode: this.currency,
                    inputAmount: this.amount
                }).then((faitListData)=>{
                    const faitList = faitListData.data
                    this.payMenu = []
                    //加载支付列表
                    for(const fait of faitList){
                        this.payMenu.push({paymethod_id:fait.paymentId,icon:fait.icon})
                    }
                    console.log("payment", faitList, this.payMenu)
                    if(this.payMenu.length > 0){
                        this.selPaymentID = this.payMenu[0].paymethod_id   //默认第一个
                        this.buttonClass  = 'confirm_btn';
                    }
                }).catch(()=>{
                    showToast(`匹配支付方式失败`)
                })
                console.log("res.data.outAmount", res.data.outAmount)
                this.cryptoAmount = res.data.outAmount
            }
        }).catch((er)=>{
            showToast(`预估金额失败 ${JSON.stringify(er)}`)
        })
        //this.getPayMenu(); //获取支付方式
    },
    methods:{
        ConfrimEvent(){

            if(this.selPaymentID !== "")
            {
                //创建订单
                DAuthWalletManager.createFiatOrder({
                    outOrderId:"",//demo默认传空，业务自己需要传orderId
                    quoteType: this.quoteType,
                    fiatCode: this.currency,
                    cryptoCode: this.item_name,
                    amount: this.amount,
                    paymethodId: this.selPaymentID
                }).catch(()=>{
                    showToast("创建订单失败")
                }).then((res)=>{
                    //跳转到订单详情
                    console.log(res)
                    this.$router.push({
                        name: 'FiatOrder',
                        query: {orderId:res.data}
                    })
                })
            }
            else{
                showToast("请先选择支付方式")
            }
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
