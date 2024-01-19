<!-- eslint-disable vue/no-parsing-error -->
<script lang="ts">
import { Vue } from 'vue-class-component';

import {DAuthWalletManager} from "dauth-web"

export default class TgLogin extends Vue{
  mounted() {
    DAuthWalletManager.tgLinkLogin().then(()=>{
      //登录成功 ，跳转
      this.$router.push({
            name: 'home'
          })
    }).catch(()=>{
      window.alert("login error")
    });
  }
}
</script>

<style>
/* Vue 组件的样式部分 */
</style>
