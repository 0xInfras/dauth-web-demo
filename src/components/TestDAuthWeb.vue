<!-- eslint-disable vue/valid-template-root -->
<template>
  <div>
    <div class="TestDAuthWeb1">
    <button @click="startAuth">
      发起Twitter登录授权
    </button>
  </div>
  <div class="TestDAuthWeb2">
    <label>address:</label>
    <label ref="addLabel">{{ addressText }}</label>
  </div>
  <div class="TestDAuthWeb3">
    <label>转账给</label>
    <input type="text" v-model="transferAddress" placeholder="转出地址"></input>
    <label>0.001eth</label>
    <button @click="transfer">
      提交
    </button>
  </div>
  <div class="TestDAuthWeb4">
    <label>{{ trxRes }}</label>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {DAuthWalletManaget} from "dauth-web";

@Component
export default class TestDAuthWeb extends Vue{

   addressText : string = "地址"
   transferAddress : string = ""
   trxRes : string = "交易结果"

    startAuth() {
    const info = {
      type: 'TWITTER',
      clientId: 'Vks1X3E3WVZoTHpXUUx3RGhaNlU6MTpjaQ',
      redirectUri: window.location.href
    }
    DAuthWalletManaget.loginWithType(info)
  }

   transfer(){

    if ("" !== this.addressText){
     DAuthWalletManaget.excute(
        this.transferAddress,
        0.001,
        '0x'
      ).then((res)=>{
        this.trxRes = res;
      }).catch((res)=>{
        this.trxRes = res;
      });
    }

  }

  mounted(){
    DAuthWalletManaget.initSDK({appId: "1bfe5bbf619681e49cdc62d07badc4cb",
    signKey:"2342a&*&45aeq",
    sdkVersion:"1.2.2",
    serverTag:"test",
    urlForAppServerKeyToSubmit:""});
    this.checkAuth();
  }

   async checkAuth() {
    const response =  await DAuthWalletManaget.checkLoginRedirctUrl({});
    //window.alert(JSON.stringify(response))
    if( response.error === 0 ){
      const dauthReponse = {
        dauthId: response.data.dauthId,
        access_token:response.data.dauthAccessToken
      }
      
      DAuthWalletManaget.queryWalletAddress(dauthReponse).then((res)=>{
        this.addressText = res.data;
      }
      ).catch((res)=>{
        console.log(res);
        DAuthWalletManaget.createWallet(dauthReponse).then(
            (res:any)=>{
              console.log(res);
             this.addressText = res.data;
            }
          );
      });
    }
  }
}
</script>

<style lang="less" scoped>

</style>
