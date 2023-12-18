<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <TgLogin></TgLogin>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
// import TestDAuthWeb from '@/components/HelloWorld.vue'; // @ is an alias to /src
import TgLogin from '@/components/Tglogin.vue'

@Options({
  components: {
    TgLogin,
  },
})
export default class TgLoginView extends Vue {
  test(){
    console.log("")
  }
}
</script>
