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
import {DAuthWalletManager} from "dauth-web";

@Component
export default class TestDAuthWeb extends Vue{

   addressText : string = "地址"
   transferAddress : string = ""
   trxRes : string = "交易结果"


   dauthID : string = ''
   dauthAccessToken : string = ''

    startAuth() {
    const info = {
      type: 'TWITTER',
      clientId: 'Vks1X3E3WVZoTHpXUUx3RGhaNlU6MTpjaQ',
      redirectUri: window.location.href
    }
    DAuthWalletManager.loginWithType(info)
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
          //gas预估结果，提交交易
        DAuthWalletManager.execute(callData,
            {
              verificationGas:gasres.data.verificationGas,
              callGas:gasres.data.callGas
            },
            userInfo
          ).then((res)=>{
            this.trxRes = res;
          }).catch((res)=>{
            this.trxRes = res;
          });
        }
      }
    );
  }

  mounted(){
    DAuthWalletManager.initSDK({appId: "1bfe5bbf619681e49cdc62d07badc4cb",
    signKey:"2342a&*&45aeq",
    sdkVersion:"1.2.2",
    serverTag:"test",
    urlForAppServerKeyToSubmit:""});
    this.checkAuth();
  }

   async checkAuth() {
    const response =  await DAuthWalletManager.checkLoginRedirctUrl({});
    //window.alert(JSON.stringify(response))
    if( response.error === 0 ){
      const dauthReponse = {
        dauthId: response.data.dauthId,
        accessToken:response.data.dauthAccessToken
      }

      this.dauthID = response.data.dauthId;
      console.log("check redecrit ", response.data);
      this.dauthAccessToken = response.data.dauthAccessToken;
      
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
</script>

<style lang="less" scoped>

</style>
