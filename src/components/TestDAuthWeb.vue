<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <div class="TestDAuthWeb1">
      <button @click="startAuth">
        发起Twitter登录授权
      </button>
      <button @click="startAuthGoogle">
        发起Google登录授权
      </button>
    </div>
    <div>
      <input type="text" v-model="emailStr" placeholder="请输入邮箱地址">
      <button @click="getEmailVCode">
        获取验证码
      </button>
      <input type="text" v-model="emailVcode" placeholder="验证码">
      <button @click="startAuthEmailVerCode">
        登录
      </button>
    </div>
    <div class="TestDAuthWeb2">
      <label>address:</label>
      <label ref="addLabel">{{ addressText }}</label>
    </div>
    <div class="TestDAuthWeb3">
      <label>转账给</label>
      <input type="text" v-model="transferAddress" placeholder="转出地址">
      <label>0.001eth</label>
      <button @click="transfer">
        提交
      </button>
    </div>
    <div class="TestDAuthWeb4">
      <label>{{ trxRes }}</label>
    </div>
    <div>
      <button @click="logout">退出</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {DAuthWalletManager, TLoginType} from "dauth-web";


@Component
export default class TestDAuthWeb extends Vue{

   addressText : string = "地址"
   transferAddress : string = ""
   trxRes : string = "交易结果";

   emailStr:string = "";
   emailVcode:string = "";

   dauthID : string = ''
   dauthAccessToken : string = ''

    startAuth() {
    const info = {
      type: "TWITTER" as TLoginType,
      clientId: 'Vks1X3E3WVZoTHpXUUx3RGhaNlU6MTpjaQ',
      redirectUri: "https://demos.infras.online/space"
    }
    DAuthWalletManager.loginWithType(info)
  }

  startAuthGoogle() {
    const info = {
      type: "GOOGLE" as TLoginType,
      clientId: '209392989758-j14das5beql07e9ifomltgv3icgiuuvh.apps.googleusercontent.com',
      redirectUri: "http://localhost:3000",
      clientSecret:"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"
    }
    DAuthWalletManager.loginWithType(info)
  }

  getEmailVCode(){
    DAuthWalletManager.sendEmailVerifyCode({email:this.emailStr}).then(()=>{
      window.alert("验证码获取成功")
    })
    .catch(
      ()=>{
        window.alert("验证码获取失败")
      }
    );
  
  }
  startAuthEmailVerCode(){
    const info = {
      type: "EMAILVCODE" as TLoginType,
      redirectUri:"http://localhost:3000",
      payload:{
        account : this.emailStr,
        external : this.emailVcode
      }
    };
    DAuthWalletManager.loginWithType(info)
}


  logout(){
    DAuthWalletManager.logout().then(()=>{
      this.addressText = "地址";
      window.alert("退出成功");
    }
    ).catch(()=>{
      window.alert("退出失败");
    })

  }

   transfer(){
    console.log("transfer", this.addressText)

    const callData = {
          toAddress : this.transferAddress,
          amount:0.001,
          callData:'0x'
        };

    const userInfo = 
    {
      dauthId:this.dauthID,
      accessToken: this.dauthAccessToken
    }
    //预估gas
    DAuthWalletManager.estimateGas(callData, userInfo).then(
      (gasres)=>{
        if ("" !== this.addressText){
        console.log("estmit gas ",gasres.data.verificationGas, gasres.data.callGas )
          //gas预估结果，提交交易
        DAuthWalletManager.execute(callData,
            {
              verificationGas:gasres.data.verificationGas,
              callGas:gasres.data.callGas + 21000 * 1000
            },
            userInfo
          ).then((res)=>{
            this.trxRes = res.data;
          }).catch((res)=>{
            this.trxRes = res.data;
          });
        }
      }
    );
  }

  mounted(){
    DAuthWalletManager.initSDK({appId: "1bfe5bbf619681e49cdc62d07badc4cb",
    sdkVersion:"1.2.2",
    serverTag:"test"
  });
    this.checkAuth();
  }

   async checkAuth() {
    const response =  await DAuthWalletManager.checkLoginRedirctUrl({url:window.location.href});
    //window.alert(JSON.stringify(response))
    console.log("check data ", response.data);
    if (typeof response.data !== "undefined"){
      if( response.error === 0){
        const dauthReponse = {
          dauthId: response.data.dauthId,
          accessToken:response.data.dauthAccessToken
        }

        this.dauthID = response.data.dauthId;
        console.log("check redecrit ", response.data);
        this.dauthAccessToken = response.data.dauthAccessToken;
        
        // DAuthWalletManager.createWallet(dauthReponse).then(
        //       (createRes:any)=>{
        //         console.log(createRes);
        //        this.addressText = createRes.data;
        //       }
        //     );

        DAuthWalletManager.queryWalletAddress(dauthReponse).then((res)=>{
          this.addressText = res.data;
        }
        ).catch((res)=>{
          console.log(res);
          DAuthWalletManager.createWallet(dauthReponse).then(
              (createRes:any)=>{
                console.log(createRes);
              this.addressText = createRes.data;
              }
            );
        });
      }
      else{
        window.alert(JSON.stringify(response));
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
