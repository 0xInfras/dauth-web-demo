<template>
  <div class="test">
    <button @click="test">测试Twitter登录</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import WalletManager from 'dauth-web'

@Component
export default class TestUndo extends Vue {
  name = 'TestDAuthWeb'

  private test() {
    const info = {
      type: 'TWITTER',
      clientId: 'Vks1X3E3WVZoTHpXUUx3RGhaNlU6MTpjaQ',
      redirectUri: window.location.href
    }
    WalletManager.loginWithType(info)
    console.log('yes')
  }

}
</script>

<style lang="less" scoped>

</style>
