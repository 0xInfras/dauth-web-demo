<template>
  <div class="test">
    <button @click="startAuth">
      发起Twitter登录授权
    </button>
    <label>{{ addressText }}</label>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {DAuthWalletManaget} from "dauth-web"

@Component
export default class TestUndo extends Vue {
  name = 'TestDAuthWeb'

  data() {
    return {
      addressText: 'address:'
    }
  }
  

  private startAuth() {
    const info = {
      type: 'TWITTER',
      clientId: 'Vks1X3E3WVZoTHpXUUx3RGhaNlU6MTpjaQ',
      redirectUri: window.location.href
    }
    DAuthWalletManaget.loginWithType(info)
  }

  mounted(){
    DAuthWalletManaget.initSDK({appId: "1bfe5bbf619681e49cdc62d07badc4cb",
    appKey: "4466*dff@cde",
    signKey:"2342a&*&45aeq",
    sdkVersion:"1.2.2",
    urlForAppServerKeyToSubmit:""});
    this.checkAuth()
  }

  private async checkAuth() {
    const response =  await DAuthWalletManaget.checkLoginRedirctUrl({});
    //window.alert(JSON.stringify(response))
    if( response.error === 0 ){
      DAuthWalletManaget.createWallet({ dauthId: response.data.dauthId,
          access_token:response.data.dauthAccessToken}).then(
            (res:any)=>{
              window.alert(res.data);
            }
          );
    }
  }
}
</script>

<style lang="less" scoped>

</style>
