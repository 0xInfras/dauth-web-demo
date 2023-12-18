<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <TestDAuthWeb></TestDAuthWeb>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
// import TestDAuthWeb from '@/components/HelloWorld.vue'; // @ is an alias to /src
import TestDAuthWeb from '@/components/TestDAuthWeb.vue'

@Options({
  components: {
    TestDAuthWeb,
  },
})
export default class HomeView extends Vue {
  test(){
    console.log("")
  }
}
</script>
