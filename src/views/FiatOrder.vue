<template>
    <div class="order_main">
        <p class="order_title">Payment Details</p>
        <van-cell-group :border="false" style="padding-top:4vw" >
            <van-cell style="padding:1vw 0;" title="Order ID" :value="order_id" :border="false"/>
            <van-cell style="padding:1vw 0;" title="Total Amount" :value="amount" :border="false" />
            <van-cell style="padding:1vw 0;" title="Payment Method" :value="payment" :border="false" />
            <van-cell style="padding:1vw 0;" title="Payee" :value="payee" :border="false" />
        </van-cell-group>
        <div class="ord_deal_main">
            <input class="copy_input" type="textarea" v-for="paymethod in paymethod_info" :id="paymethod.name" :value="paymethod.value" :key="paymethod.name"/>
            <van-cell-group :border="false" style="background:#f7f8fa;padding:2vw 0;" >
                <van-cell v-for="paymethod in paymethod_info" :key="paymethod.name" :title="paymethod.name" style="padding-top:1vw;padding-bottom:1vw;background:#f7f8fa" :border="false" >
                    <template v-if="paymethod.type === 'file'" #value>
                        <span @click="showImgEvent(paymethod.value)" style="color:rgba(42, 130, 228, 1)">Scan to pay</span>
                    </template>
                    <template v-else #right-icon>
                        <span>{{ paymethod.value }}</span>
                        <van-icon name="description-o" @click="copyEvent(paymethod.name)" class="description-icon" />
                    </template>
                </van-cell>
             </van-cell-group>
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
         <div v-else-if="state==='WITHDRAW_SUCCESS'">
            <p class="completed">SUCCESS</p>
        </div>
        <div v-else>
        </div>

        <van-dialog v-model:show="showImg" close-on-click-overlay="true" confirm-button-text="Close"> <img style='max-width: 100%; height: auto;' :src="img_url"/> </van-dialog>
    </div>
</template>
<script>
import {postEventToken} from "../utils/common.js"
import {localSign} from "../utils/common.js"
import {host} from "../utils/common.js"
import {apiList} from "../utils/common.js"
import { showToast  } from 'vant';
export default{
    data(){
        return{
            fileList:[],
            payee:"",
            paymethod_info:[],
            order_id: '',
            timestamp:0,
            buyTime:"",
            scdl:"",
            amount: '',
            payment:'',
            showImg: false,
            state:''
        }
    },
    mounted:function(){
        if(this.$route.query.security_key != undefined)
        {
            //有可能是没有经过CheckOut直接过来的，如果是的话，就要
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

        if(this.$route.query.client_id != undefined)
            this.client_id = this.$route.query.client_id
        else
            this.client_id = sessionStorage.getItem('client_id')

        this.last_update = 0;
        this.getDetail();

        this.timestamp = 0;
        this.buyTime = setInterval(()=>{
            if(this.timestamp !=0){
                this.tick()
            }
        },1000)
    },
    methods:{
        getDetail(){
            //获取详情，更新本地状态
            let url = host + apiList["detail"]
            let formData = new FormData();
            formData.append('authid', this.auth_id);
            formData.append('order_id', this.order_id);

            postEventToken(url,localSign(formData),(res)=>{
                this.last_update = new Date().getTime();
                let retCode = res.data.ret
                switch (retCode) {
                    case 0:
                        this.order_id = res.data.data.order_id;
                        this.paymethod_info = res.data.data.paymethod_info.paymethod_value_info

                        this.amount = res.data.data.amount;
                        this.payment = res.data.data.paymethod_info.paymethod_name;
                        this.payee = res.data.data.paymethod_info.paymethod_username;
                        this.state = res.data.data.state;
                        this.timestamp = Number(res.data.data.create_time)

                        break;

                     default:
                        showToast("Query order detail failed!");
                        return

                }
            },(er)=>{
                console.error(er)
            },this.client_id)
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
                console.error(er)
            },this.client_id)
        },
        CancelOrderEvent(){
            this.isDisabled = true;
            this.buttonClass  = 'disabled_btn';

            let url = host + apiList["cancel"]
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
                console.error(er)
            },this.client_id)
        },
        showImgEvent(url){
            this.showImg = true;
            this.img_url = url;
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
    .ord_deal_main{
        background: #dcdee0;
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