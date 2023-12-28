<template>
    <div class="van_group_box">
        <div >
            <p class="kyc_title">
                Secure Verification
            </p>
            <p class="kyc_info">
                To ensure your account and funds are in good hands, we kindly ask you to provide some necessary KYC details. This helps us verify your identity and protect your financial interests.
            </p>
        </div>
        
        <van-cell-group>
            <p class="key_s_title">1.Complete the forms</p>
            <!-- <van-tabs style="padding-top:5.3vw" v-model:active="sendType">
                <van-tab  title="Mobile phone" name="1" >
                     <div class="flex_main" style="padding-top:2vw">
                        <div class="phone_num" @click="pickerDisplay(true)">
                        {{phoneNum}}
                        <van-icon name="arrow-down" style="position:relative;left:1vw" />
                        </div>
                        <van-field class="van_field_css van_field_css_phone" v-model="phone" placeholder="请输入手机" />
                    </div>
                </van-tab>
                  <van-tab  title="Switch to Email" name="2">
                     <div class="flex_main" style="padding-top:2vw">
                        <van-field class="van_field_css van_field_css_phone" style="width:100%;margin-left:0" v-model="mail" placeholder="请输入邮箱" />
                    </div>
                </van-tab>
            </van-tabs>
           
            <div class="flex_main">
                <van-field v-model="sms" center clearable class="van_field_css van_field_css_sms"
                placeholder="短信"></van-field>
                <div class="sms_btn" :class="{sms_btn_disable:isSend || !sendButtonEnable}" 
                    @click="getSms">{{isSend?second+"s":smsTitle}}</div>
            </div> -->

            <p class="key_s_title2">Document Issued Country/Region</p>
             <div class="flex_main">
                <div class="select_box" @click="regionDisplay(true)">
                    {{RegionName}}
                    <van-icon name="arrow-down" style="position:absolute;right:2vw;top:50%;transform: translateY(-50%);" />
                </div>
                <van-field class="van_field_css van_field_css_phone" style="opacity: 0;width:0;margin-left:0;padding-left:0;padding-right:0;"  />
             </div>
             <p class="key_s_title2">Document Type</p>
              <div class="flex_main">
                <div class="select_box" @click="typeDisplay(true)">
                    {{typeCode}}
                    <van-icon name="arrow-down" style="position:absolute;right:2vw;top:50%;transform: translateY(-50%);" />
                </div>
                
                 <van-field class="van_field_css van_field_css_phone" style="opacity: 0;width:0;margin-left:0;padding-left:0;padding-right:0;"  />
            </div>
            <div>
                <van-field v-model="fullName" center clearable class="van_field_css"
                placeholder="FullName"></van-field>
               
            </div>
            <div>
                <van-field v-model="idNum" center clearable class="van_field_css"
                placeholder="id-number"></van-field>
               
            </div>
        </van-cell-group>
        <p class="key_s_title">2.Take pictures of both sides of your document</p>
         <p class="key_s_title2" style="margin-top:6vw;margin-bottom:1.5vw">
            ·Ensure all details are readable in the image.
         </p>
        <p class="key_s_title2" style="margin-top:1vw;margin-bottom:1.5vw">
             ·Ensure the document is original and has not expired.
         </p>
          <p class="key_s_title2" style="margin-top:1vw;margin-bottom:1.5vw">
            ·Place the document against a solid-colored background.
         </p>
        <div  >
            <p class="key_s_title" style="padding-bottom:3vw">{{frontTitle}}</p>
            <van-uploader multiple  v-model="fileList" :max-count="front" :after-read="afterRead" ></van-uploader>
            
        </div>
        <div  >
            <p class="key_s_title" style="padding-bottom:3vw">{{backTitle}}</p>
            <van-uploader multiple  v-model="fileListB" :max-count="back" :after-read="afterReadB" />
        </div>
        <van-button class="submit_btn" type="primary" block @click="SubmitEvent">Submit</van-button>
    </div>
    <van-popup v-model:show="pickerShow" position="bottom" @close="onClose" :style="{height:'55%'}">
        <van-picker
            class="picker_css"
            confirm-button-text="Ok"
            cancel-button-text="Cancel"
            title="区号"
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="onClose" 
        />
    </van-popup>
    <van-popup v-model:show="regionShow" position="bottom" @close="regionClose" :style="{height:'55%'}">
        <van-picker
            class="picker_css"
            title="Country/Region"
             confirm-button-text="Ok"
            cancel-button-text="Cancel"
            show-toolbar
            :columns="regionColumns"
            @confirm="regionConfirm"
            @cancel="regionClose" 
        />
    </van-popup>
    <van-popup v-model:show="typeShow" position="bottom" @close="typeClose" :style="{height:'55%'}">
        <van-picker
            class="picker_css"
            title="Document Type"
             confirm-button-text="Ok"
            cancel-button-text="Cancel"
            show-toolbar
            :columns="typeColumns"
            @confirm="typeConfirm"
            @cancel="typeClose" 
        />
    </van-popup>
    
</template>
<script>
import {postEventToken} from "../utils/common.js"
import { showToast,showDialog  } from 'vant';
import {DAuthWalletManager} from "dauth-web";
    export default{
        data(){
        return{
            phoneNum:"+86",
            isSend:false,
            second:60,
            smsTitle:"send",
            sms:"",
            phone:"",
            mail:"",
            pickerShow:false,
            columns :[],
            sendType:"1",
            RegionCode:"",
            RegionName:"",
            regionShow:false,
            regionColumns:[
                ],
             typeArr:{},
             typeShow:false,
             typeColumns:[],
             typeCode:"",
             fileList:[ ],
             fileBase64:"",
             fileListB:[],
             fileBase64B:"",
             front:1,
             back:1,
             frontTitle:"Upload the front cover",
             backTitle:"Upload the front cover",
             sendButtonEnable:true,
             idNum:"",
             fullName:""
            }
            
        },
        mounted:function(){
            if(this.$route.query != undefined)
            {
                sessionStorage.setItem('email', this.$route.query.email);
                sessionStorage.setItem('authId', this.$route.query.authId);
                sessionStorage.setItem('accessToken', this.$route.query.accesstoken);

                this.mail = this.$route.query.email
                this.sendButtonEnable = false

                //查询国家列表
                DAuthWalletManager.queryCountryList().then((res)=>{
                    const countrylist  = res.data
                    this.regionColumns = []
                    this.columns = []
                    for(const c of countrylist)
                    {
                        this.regionColumns.push({ text: c.countryName, value: c.countryName ,countryISO:c.countryCode})
                        this.columns.push({text: c.phoneAreaCode, value: c.phoneAreaCode })
                        this.typeArr[c.countryName] = [
                            { text: 'ID', value: 'ID',front:1,back:1,frontTitle:"Upload the front cover",backTitle:"Upload the back cover"},
                            { text: 'Driver', value: 'Driver',front:1,back:0,frontTitle:"Upload the front cover",backTitle:"Upload the back cover"},
                        ]
                    }
                   
                    this.RegionCode = this.regionColumns[0].countryISO
                    this.RegionName = this.regionColumns[0].value
                    this.typeColumns = this.typeArr[this.RegionName]

                }).catch((er)=>{
                    window.alert("queryCountryList error ", er)
                })
            }
        },
        methods:{
            cleanEvent(){
                this.fileList = []
                this.fileListB = []
                this.frontTitle = ""
                this.backTitle = ""
                this.phone = ""
                this.sms = ""
                this.mail = ""
                this.typeCode = ""
                this.RegionName =""
                 this.RegionCode = ""
                 this.fileBase64 = ""
                 this.fileBase64B = ""
                 this.idNum = ""
                 this.fullName=""
            },
            //提交
            SubmitEvent(){
                let data = {}
                let aollow = false
                //  if(this.sendType === '1'){
                //     var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
                //     aollow = myreg.test(this.phone)
                // }else{
                //     // eslint-disable-next-line no-redeclare
                //     var myreg =  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
                //     aollow = myreg.test(this.mail)
                // }
                // if(!aollow){
                //     if(this.sendType === '1'){
                //         showToast('请正确输入手机')
                //     }else{
                //         showToast('请正确输入邮箱')
                //     }
                //     return
                // }
                // if(!this.sms){
                //     showToast("请输入验证码")
                //     return
                // }fullName
                if( this.fullName === ""){
                    showToast("请输入全名")
                    return
                }
                if( this.idNum === ""){
                    showToast("请输入证件号")
                    return
                }
                if( this.fileBase64 === ""){
                    showToast("请上传证件正面")
                    return
                }
                if( this.fileBase64B === ""){
                    showToast("请上传证件背面")
                    return
                }
                //开始提交资料
                DAuthWalletManager.kycRegister({
                    fullName: this.fullName,
                    idType: this.typeCode === "ID" ? "ID_CARD" : "DRIVERS",
                    idNum: this.idNum,
                    idFrontImg: this.fileBase64,
                    idBackImg: this.fileBase64B,
                    issuingCountry: this.RegionCode
                }).then((res)=>{
                    if(res.data === "KYCSucess"){
                        showDialog({
                            title:"成功",
                            message:
                                'Verification may take 15 minutes. Check the results later.',
                            })
                            .then(() => {
                                // on confirm
                                window.close
                            })
                    }
                    if(res.data === "KYCDisposing"){
                        showDialog({
                            title:"KYC正在处理",
                            message:
                                'Verification may take 15 minutes. Check the results later.',
                            })
                            .then(() => {
                                // on confirm
                                window.close
                            })
                    }
                    else{
                        showDialog({
                            title:"失败",
                            message:
                                'Submission failed!',
                            })
                            .then(() => {
                                // on confirm
                                this.cleanEvent()
                            })
                    }
                }).catch((res)=>{
                    showDialog({
                            title:"失败",
                            message:
                                'Submission failed!' + res.msg,
                            })
                            .then(() => {
                                // on confirm
                                this.cleanEvent()
                            })
                })
            },
            afterReadB(file){
                file.status = 'uploading';
                file.message = 'processing...';

                //调api上传
                this.fileBase64B = file.content

                //console.log("revice ", file)
                
                setTimeout(() => {
                    //里面的状态放到请求api的回调里面，成功放成功失败放失败
                    // file.status = 'failed';
                    // file.message = '上传失败';
                    //成功
                    file.status = 'done';
                    file.message = 'done';
                }, 1000);
            },
            afterRead(file){
                //console.log(file)
                file.status = 'uploading';
                file.message = 'processing...';
                this.fileBase64 = file.content

                //调api上传

                
                setTimeout(() => {
                    //里面的状态放到请求api的回调里面，成功放成功失败放失败
                    // file.status = 'failed';
                    // file.message = '上传失败';
                    //成功
                    file.status = 'done';
                    file.message = 'done';
                }, 1000);

                // let reader = new FileReader()
                // console.log(reader)
                // reader.readAsDataUrl(file)
                // reader.onload = function(){

                // const formData = new FormData();
                // formData.append('files',file)

                // 请求 
                // }
            },
            getSms(){
                // let aollow = false
                // if(this.sendType === '1'){
                //     var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
                //     aollow = myreg.test(this.phone)
                // }else{
                //     // eslint-disable-next-line no-redeclare
                //     var myreg =  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
                //     aollow = myreg.test(this.mail)
                // }
                
  
                // if(aollow){
                //     if(this.isSend){return}
                //     this.isSend = true
                //     let data = {
                //         "phone":this.phone,
                //         "code":this.phoneNum
                //     }
                //     postEventToken("url",data,()=>{
                //         //成功
                //          showToast('已发送')
                //         this.second = 59
                //         this.reckonTime()
                //     })
                   

                // }else{
                //     if(this.sendType === '1'){
                //         showToast('请正确输入手机')
                //     }else{
                //         showToast('请正确输入邮箱')
                //     }
                    
                // }
            },
            reckonTime(){
                let sTime = setInterval(()=>{
                if(this.second > 0){
                this.second = this.second - 1
                }else{
                clearInterval(sTime)
                    this.smsTitle = "重新发送"
                this.isSend = false
                }
                },1000)
            },
            typeDisplay(){
                this.typeShow = true
            },
            typeClose(){
                this.typeShow = false
            },
            typeConfirm({ selectedOptions }){
                console.log(selectedOptions)
                this.typeCode = selectedOptions[0].value
                this.front = selectedOptions[0].front
                this.back = selectedOptions[0].back
                this.frontTitle = selectedOptions[0].frontTitle
                this.backTitle = selectedOptions[0].backTitle
                this.fileList = []
                this.fileListB = []
                this.typeShow = false
            },
            regionDisplay(){
                this.regionShow = true
            },
            regionClose(){
                this.regionShow = false
            },
            regionConfirm({ selectedOptions }){
                console.log(selectedOptions)
                this.RegionCode = selectedOptions[0].countryISO
                this.RegionName = selectedOptions[0].value
                this.regionShow = false
                this.front = 0
                this.back = 0 
                this.fileList = []
                this.fileListB = []
            },
            pickerDisplay(bool){
                this.pickerShow = bool
            },

            onClose(){
            this.pickerShow = false
            },

            onConfirm({ selectedOptions }){
                console.log(selectedOptions)
                this.phoneNum = "+"+selectedOptions[0].value
                this.pickerShow = false
            }
        }
    }
</script>
<style scoped lang="less">
.submit_btn{
    margin-top: 13vw;
}
.select_box{
    border: 0.2vw solid #E6E7EB;
    width: 85.3vw;
    position: relative;
    padding: 0 2.15vw;
       display: flex;
    align-items: center;
    // height: 3vh;
}
.kyc_title{
    font-size:6.4vw;
    font-weight:700;
    
}
.key_s_title2{
    font-size:3.73vw;
    margin-top: 4vw;
    margin-bottom: 3vw;
}
.kyc_info{
    font-size: 3.73vw;
    padding-top: 2vw;
    padding-bottom: 6vw;
    border-bottom: 0.2vw solid rgba(204, 204, 204, 1);
}
.van_group_box{
    padding: 6.6vw 5.3vw 5.3vw;

}
.key_s_title{
    padding-top: 5.3vw;
    font-weight: 700;
    font-size: 3.73vw;
}
.flex_main{
 display:flex;
  align-item:stretch;
margin-bottom:3.7vw
}
.van_field_css{
    border:0.2vw solid #E6E7EB;
    padding:1.5vw 2.15vw;
    margin-bottom:3.7vw;
    &::after{
    border-bottom:0px solid transparent;
    opacity:0;
}
}

.van_field_css_phone{
width:78%;
margin-bottom:0;
margin-left:2%;
}

.van_field_css_sms{
width:68%;
margin-bottom:0;
margin-right:2%;
}
.phone_num{
width:20%;
border:0.2vw solid #E6E7EB;
background:#fff;
position:relative;
display:flex;
align-items:center;
justify-content:center;
font-size: 3.73vw;
}
.sms_btn{
    width:30%;
    border:0.2vw solid #1989fa;
    color:#1989fa;
    display:flex;
    align-items:center;
    justify-content:center;
}
.sms_btn_disable{
 color:#BBBDBF;
border:0.2vw solid #BBBDBF 
}
</style>
<style lang="less">
.van_group_box{
    .van-tabs__nav--line{
        height: 78% !important;
    }
    .van-uploader{
        width: 100% !important;
    }
    .van-uploader__wrapper{
        width: 100% !important;

    }
    .van-uploader__upload{
        width: 100% !important;
        height: 40vw !important;
    }
    .van-uploader__preview{
          width: 100% !important;
    }
    .van-uploader__preview-image{
         width: 100% !important;
        height: 40vw !important;
    }
}

</style>