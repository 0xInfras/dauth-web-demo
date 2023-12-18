<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <label>Telegram登录</label>
    <iframe src="/static/tgLogin.html" width="100%" height="500px" frameborder="0" align="center" />
  </div>
</template>
  
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({})
export default class TgLogin extends Vue{
 
}
</script>

<style>
/* Vue 组件的样式部分 */
</style>
