<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <TestDAuthWeb />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import  TestDAuthWeb  from '../components/TestDAuthWeb.vue'

@Component({
  components: {
    TestDAuthWeb
  },
})
export default class Home extends Vue {}
</script>
