<template>
  <div class="space">
    <TestDAuthWeb />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TestDAuthWeb from '@/components/TestDAuthWeb.vue'


@Component({
  components: {
    TestDAuthWeb
  },
})
export default class Space extends Vue {
  name = 'Space'

}
</script>

<style lang="less" scoped>
.space {
  height: 100%;
  width: 100%;
  &-option {
    height: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &-item {
      margin: 0 5px;
      cursor: pointer;
    }
  }
  .selected {
    color: #42b983;
  }
}
</style>
