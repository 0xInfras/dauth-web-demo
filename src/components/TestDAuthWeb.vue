<template>
  <div class="test">
    <button @click="startAuth">
      发起Twitter登录授权
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import WalletManager from 'dauth-web'

@Component
export default class TestUndo extends Vue {
  name = 'TestDAuthWeb'

  private startAuth() {
    const info = {
      type: 'TWITTER',
      clientId: 'Vks1X3E3WVZoTHpXUUx3RGhaNlU6MTpjaQ',
      redirectUri: window.location.href
    }
    WalletManager.loginWithType(info)
  }

  mounted(){
    this.checkAuth()
  }

  private async checkAuth() {
    const response =  await WalletManager.checkLoginRedirctUrl()
    window.alert(JSON.stringify(response))
  }
}
</script>

<style lang="less" scoped>

</style>
