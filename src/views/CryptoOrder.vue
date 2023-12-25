<template>
    <div class="order_main">
        <p class="order_title">Payment Details</p>
        <van-cell-group :border="false" style="padding-top:4vw" >
            <van-cell style="padding:1vw 0;" title="Order ID" :value="order_id" :border="false"/>
            <van-cell style="padding:1vw 0;" title="Total Amount" :value="amount" :border="false" />
            <van-cell style="padding:1vw 0;" title="Chain & Coin" :value="chain_name" :border="false" />
        </van-cell-group>
        <div class="ord_deal_main">
             <div class="order_img_box">
                <img id="qrcode" :src="QRImgUrl" />
             </div>
             <div style="display:flex; width:80%; margin:auto ">
                <div style="white-space: nowrap; overflow:hidden; text-overflow:ellipsis; width:75%; text-align:right">{{address_shorten}}</div>
                <van-icon style="width:25%" name="description-o" @click="copyEvent(address)" class="description-icon" />
             </div>
        </div>

        <div v-if="state==='UNPAID'">
            <!-- state为未支付状态 -->
            <p class="ord_s_title" style="padding-bottom:3vw">Screenshot  proof</p>
             <div><van-uploader  v-model="fileList" max-count="1" :after-read="afterRead" ></van-uploader></div>
            <p class="pay_time_text">Please complete payment within </p>
            <p class="pay_times" v-text="scdl"></p>

             <van-button style="margin-top:13.3vw" type="primary" block @click="PaidEvent" :disabled="isDisabled">Paid</van-button>
             <van-button style="margin-top:5vw ;" color="rgba(209, 20, 20, 1)" type="primary" block @click="CancelOrderEvent" :disabled="isDisabled">Cancel Order</van-button>
        </div>
        <div v-else-if="state==='PAID'">
            <p class="paid">Waiting for confirmation</p>
            <p class="waiting_for_confirm">This process typically completes within 5 minutes.</p>
        </div>
        <div v-else-if="state==='CANCEL'">
            <p class="canceled">CANCELED</p>
        </div>
        <div v-else-if="state==='COMPLETED'">
            <p class="completed">COMPLETED</p>
        </div>
        <div v-else>
        </div>

    </div>
</template>
<script>
import {postEventToken} from "../utils/common.js"
import {localSign} from "../utils/common.js"
import {host} from "../utils/common.js"
import {apiList} from "../utils/common.js"
import { showToast  } from 'vant'
import QRCode from 'qrcode'

export default{
    data(){
        return{
            payee:"",
            order_id: '',
            timestamp:0,
            buyTime:"",
            scdl:"",
            amount: '',
            state:'',
            address:'',
            address_shorten:'',
            QRImgUrl:'',
        }
    },
    mounted:function(){
        if(this.$route.query.security_key != undefined)
        {
            sessionStorage.setItem('security_key', atob(this.$route.query.security_key));
        }

        //如果是直接带参数进来的，优先用参数
        if(this.$route.query.auth_id != undefined)
            this.auth_id = this.$route.query.auth_id
        else
            this.auth_id = sessionStorage.getItem('auth_id')

        if(this.$route.query.order_id != undefined)
            this.order_id = this.$route.query.order_id
        else
            this.order_id = sessionStorage.getItem('order_id')

        if(this.$route.query.order_id != undefined)
            this.client_id = this.$route.query.client_id
        else
            this.client_id = sessionStorage.getItem('client_id')

        this.last_update = 0;
        this.getDetail();

        this.address = this.$route.query.address;
        this.address_shorten = this.shorten(this.address);
        this.chain_name = this.$route.query.chain_name;
        this.chain_id = this.$route.query.chain_id;
        this.amount = this.$route.query.amount;
        if(this.address){
            this.getQRcode();
        }
        this.timestamp = 0;
        this.buyTime = setInterval(()=>{
            if(this.timestamp !=0){
                this.tick()
            }
        },1000)
    },

    methods:{
        shorten(address) {
            var str =address;
            var last = 0;
            var all = str.length;
            var fisrt = str.substring(0,8);
            // 没有中文括号（
            if (str.lastIndexOf('（') == -1) {
                // 也没有英文括号(
                if (str.lastIndexOf('(') == -1) {
                    last = all - 8;
                }else{
                    // 有英文括号(，就从英文括号开始截取
                    last = str.lastIndexOf('(');
                }
            }else{
                last = str.lastIndexOf('（');
            }
            // 如果长度大于13个字符才显示省略号
            if (all > 24) {
                return fisrt + " ... " + str.substring(last,all);
            }
            return str
        },
        getQRcode(){
            let opts = {
               errorCorrectionLevel: "L",//容错级别
               type: "image/png",//生成的二维码类型
               quality: 1.0,//二维码质量
               width: 256,//宽
               height: 256,//高
               text: this.address,//二维码内容
               color: {
                    dark: "#666666",//前景色
                    light: "#fff"//背景色
               }
            };

            QRCode.toDataURL(this.address, opts , (err, url) => {
                  if (err) throw err
                  this.QRImgUrl= url
            })
        },

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getDetail(){

        },

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        afterRead(){

        },
        PaidEvent(){
            if(this.fileList.length === 0){
                showToast("Please upload your payment proof first")
                return
            }
            this.isDisabled = true;
            let url = host + apiList["paid"]
            let formData = new FormData();
            formData.append('authid', this.auth_id);
            formData.append('order_id', this.order_id);
            postEventToken(url,localSign(formData),(res)=>{
                let retCode = res.data.ret
                switch (retCode) {
                    case 0:
                        this.getDetail();
                        break;
                    default:
                        this.isDisabled = false;
                 }
            },(er)=>{
                console.error("paid error", er)
            },this.client_id)
        },
         copyEvent(id){
            var element = document.getElementById(id);
            element.select();
            element.setSelectionRange(0,element.value.length);
            document.execCommand('copy')
            showToast("copied to clipboard！")
        },
        tick(){
            let ogDate = this.timestamp
            let newDate = new Date().getTime()
            let ft = 1000*15*60;
            if(ogDate){
                if(parseInt(ogDate)+ft < newDate){
                    //过去
                    this.scdl = "00:00"
                    // localStorage.removeItem("ogDate")
                    clearInterval(this.buyTime)
                    this.CancelOrderEvent()
                }else{
                    let ot = ft-(newDate - ogDate)
                    let m = ot/(60*1000)
                    let my = ot%(60*1000)
                    let s = my/1000
                    this.scdl = Math.floor(m)+":"+(Math.floor(s) < 10 ? ('0'+Math.floor(s)):Math.floor(s))
                    //计算刷新时间，如果超过3秒，就调用detail
                    if(newDate >= this.last_update + 3000){
                        this.getDetail();
                    }

                }
            }else{
            // localStorage.setItem("ogDate",newDate)
            }
        }
    }
}
</script>
<style scoped lang="less">
    .order_main{
         padding: 6.6vw 5.3vw 5.3vw;
         .order_title{
            font-size: 6.4vw;
            font-weight:700;
            padding-bottom: 6.2vw;
            border-bottom: 0.2vw solid rgba(204, 204, 204, 1);
         }
         .ord_s_title{
            padding-top: 5.3vw;
            font-weight: 700;
            font-size: 4.26vw;
        }
    }
    .order_img_box{
            width: 80%;
            height: 80%;
            margin: 0 auto 0;
            position: relative;
            img{
                width: 100%;
                height: 100%;
            }
    }
    .ord_deal_main{
        margin-top: 6.4vw;
    }
     .description-icon {
        font-size: 16px;
        line-height: inherit;
        margin-left: 1vw;
    }
    .copy_input{
        position: fixed;
        top: 100000vw;
        opacity: 0;
    }
    .pay_time_text{
        text-align: center;
         padding-top: 9.3vw;
    }
    .waiting_for_confirm{
        text-align: center;
        padding-top: 3.6vw;
    }
    .pay_times{
        color:rgba(67, 207, 124, 1);
        font-size:9.6vw ;
        text-align: center;
        padding: 2vw 0;
    }
    .paid{
        color:rgba(67, 207, 124, 1);
        font-size:7.6vw ;
        text-align: center;
        padding: 2vw 0;
        padding-top: 16.3vw;
    }
    .canceled{
        color:rgba(255, 0, 0, 1);
        font-size:9.6vw ;
        text-align: center;
        padding: 2vw 0;
        padding-top: 16.3vw;
    }
    .completed{
        font-size:9.6vw ;
        text-align: center;
        padding: 2vw 0;
        padding-top: 16.3vw;
    }

</style>
<style lang="less">
    .order_main{
        .van-cell__value{
        color: #000;
        }
    }
    .ord_deal_main{
         .van-cell__title{
            color: rgba(128, 128, 128, 1);

        }
    }

</style>